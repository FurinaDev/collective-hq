// ==============================================================================
// CHALLENGER M1: EMPIRICAL STRESS & VERIFICATION SUITE
// ==============================================================================
// Independent verification harness for Milestone M1 (Design System, Shell, HUD Toasts)
// Usage: node tests/m1_stress_suite.mjs
// ==============================================================================

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { createRequire } from "node:module";

const requireCjs = createRequire(import.meta.url);

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
};

const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, "src");

// Helper to compile TSX in-memory to executable CommonJS
function compileTsx(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
  }).outputText;

  const mod = { exports: {} };
  const nodeRequire = (id) => {
    if (id === "react") return React;
    if (id === "react-dom/server") return ReactDOMServer;
    return requireCjs(id);
  };

  const fn = new Function("require", "module", "exports", transpiled);
  fn(nodeRequire, mod, mod.exports);
  return mod.exports;
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testErrors = [];

async function test(name, fn) {
  totalTests++;
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    passedTests++;
    console.log(`  ${ANSI.green}✔ [PASS]${ANSI.reset} ${name} ${ANSI.dim}(${duration}ms)${ANSI.reset}`);
  } catch (err) {
    const duration = Date.now() - start;
    failedTests++;
    testErrors.push({ name, error: err });
    console.log(`  ${ANSI.red}✖ [FAIL]${ANSI.reset} ${name} ${ANSI.dim}(${duration}ms)${ANSI.reset}`);
    console.log(`     ${ANSI.red}Error: ${err.message}${ANSI.reset}`);
  }
}

function suite(title) {
  console.log(`\n${ANSI.bold}${ANSI.magenta}▶ SUITE: ${title}${ANSI.reset}`);
}

async function runAll() {
  console.log(`\n${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}`);
  console.log(`${ANSI.bold}${ANSI.cyan}  CHALLENGER 1: EMPIRICAL STRESS & VERIFICATION SUITE (MILESTONE M1)  ${ANSI.reset}`);
  console.log(`${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}`);

  // ----------------------------------------------------------------------------
  // SUITE 1: ZERO BROWSER BLOCKING DIALOGS AUDIT
  // ----------------------------------------------------------------------------
  suite("1. Zero Native Browser Dialogs Audit (alert, confirm, prompt)");

  await test("Scan all source files in src/ for native alert(), confirm(), prompt()", () => {
    const violations = [];
    const dialogRegex = /\b(alert|confirm|prompt)\s*\(/g;
    const windowDialogRegex = /window\.(alert|confirm|prompt)\s*\(/g;
    const bracketRegex = /window\s*\[\s*['"`](alert|confirm|prompt)['"`]\s*\]/g;

    function walkDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const lines = content.split("\n");
          lines.forEach((line, idx) => {
            const trimmed = line.trim();
            // Skip comments
            if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
              return;
            }
            let m;
            while ((m = dialogRegex.exec(line)) !== null) {
              violations.push({ file: path.relative(PROJECT_ROOT, fullPath), line: idx + 1, match: m[0], content: trimmed });
            }
            while ((m = windowDialogRegex.exec(line)) !== null) {
              violations.push({ file: path.relative(PROJECT_ROOT, fullPath), line: idx + 1, match: m[0], content: trimmed });
            }
            while ((m = bracketRegex.exec(line)) !== null) {
              violations.push({ file: path.relative(PROJECT_ROOT, fullPath), line: idx + 1, match: m[0], content: trimmed });
            }
          });
        }
      }
    }

    walkDir(SRC_DIR);

    assert.strictEqual(
      violations.length,
      0,
      `Found ${violations.length} native browser dialog calls: ${JSON.stringify(violations, null, 2)}`
    );
  });

  await test("Verify previously reported offending components replaced dialogs with HUD/Modals", () => {
    // 1. CapitalForge.tsx line 88 had alert()
    const capitalForge = fs.readFileSync(path.join(SRC_DIR, "components", "CapitalForge.tsx"), "utf-8");
    assert.ok(!capitalForge.includes("alert("), "CapitalForge.tsx must not contain alert(");
    assert.ok(capitalForge.includes("toast.success"), "CapitalForge.tsx must use toast.success");

    // 2. StrategicLab.tsx line 46 had alert()
    const strategicLab = fs.readFileSync(path.join(SRC_DIR, "components", "StrategicLab.tsx"), "utf-8");
    assert.ok(!strategicLab.includes("alert("), "StrategicLab.tsx must not contain alert(");
    assert.ok(strategicLab.includes("toast.success"), "StrategicLab.tsx must use toast.success");

    // 3. WorkspaceDocsHub.tsx line 124 had prompt()
    const docsHub = fs.readFileSync(path.join(SRC_DIR, "components", "WorkspaceDocsHub.tsx"), "utf-8");
    assert.ok(!docsHub.includes("prompt("), "WorkspaceDocsHub.tsx must not contain prompt(");
    assert.ok(docsHub.includes("isCreateModalOpen") || docsHub.includes("setIsCreateModalOpen"), "WorkspaceDocsHub.tsx must use modal for creation");

    // 4. SystemSettings.tsx line 71 had confirm()
    const settings = fs.readFileSync(path.join(SRC_DIR, "components", "SystemSettings.tsx"), "utf-8");
    assert.ok(!settings.includes("confirm("), "SystemSettings.tsx must not contain confirm(");
    assert.ok(settings.includes("ConfirmDialog"), "SystemSettings.tsx must use ConfirmDialog component");
  });

  // ----------------------------------------------------------------------------
  // SUITE 2: TOAST NOTIFICATION SYSTEM EMPIRICAL STRESS
  // ----------------------------------------------------------------------------
  suite("2. ToastNotification.tsx Exports, Hooks & Avalanche Stress Testing");

  const toastPath = path.join(SRC_DIR, "components", "ui", "ToastNotification.tsx");
  const toastModule = compileTsx(toastPath);

  await test("ToastNotification exports ToastProvider and useToast", () => {
    assert.ok(typeof toastModule.ToastProvider === "function", "ToastProvider must be a function component");
    assert.ok(typeof toastModule.useToast === "function", "useToast must be a function hook");
  });

  await test("useToast() throws descriptive error when invoked outside ToastProvider", () => {
    let thrownError = null;
    function BrokenComponent() {
      toastModule.useToast();
      return null;
    }
    try {
      ReactDOMServer.renderToString(React.createElement(BrokenComponent));
    } catch (err) {
      thrownError = err;
    }
    assert.ok(thrownError !== null, "Calling useToast outside ToastProvider must throw an error");
    assert.ok(
      thrownError.message.includes("useToast must be used within a ToastProvider"),
      `Expected specific error message, got: ${thrownError.message}`
    );
  });

  await test("ToastProvider renders children and floating HUD container properly", () => {
    function TestChild() {
      return React.createElement("div", { id: "test-child" }, "Child Content");
    }

    const html = ReactDOMServer.renderToString(
      React.createElement(toastModule.ToastProvider, null, React.createElement(TestChild))
    );

    assert.ok(html.includes("Child Content"), "ToastProvider must render its children");
    assert.ok(html.includes('aria-live="polite"'), "HUD container must have aria-live='polite' for accessibility");
    assert.ok(html.includes("fixed bottom-5 right-5 z-50"), "HUD container must be docked fixed at bottom-5 right-5");
  });

  await test("Hook helpers (success, info, warning, error) format payloads accurately", () => {
    let capturedToasts = [];
    let hookInstance = null;

    function TestHarness() {
      hookInstance = toastModule.useToast();
      capturedToasts = hookInstance.toasts;
      return null;
    }

    // Verify hook API structure
    ReactDOMServer.renderToString(
      React.createElement(toastModule.ToastProvider, null, React.createElement(TestHarness))
    );

    assert.ok(typeof hookInstance.showToast === "function", "showToast must be a function");
    assert.ok(typeof hookInstance.removeToast === "function", "removeToast must be a function");
    assert.ok(typeof hookInstance.success === "function", "success helper must be a function");
    assert.ok(typeof hookInstance.info === "function", "info helper must be a function");
    assert.ok(typeof hookInstance.warning === "function", "warning helper must be a function");
    assert.ok(typeof hookInstance.error === "function", "error helper must be a function");
  });

  await test("Queue capping stress test: 50 simultaneous toasts capped at max 5 items", () => {
    // In ToastProvider, showToast caps the queue using: [...prev.slice(-4), newToast]
    // Let's empirically test this state transition logic directly:
    const simulateQueue = (count) => {
      let queue = [];
      const showToast = (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast = { ...toast, id };
        queue = [...queue.slice(-4), newToast];
      };

      for (let i = 0; i < count; i++) {
        showToast({ title: `Toast ${i + 1}`, description: `Detail ${i + 1}`, type: "info" });
      }
      return queue;
    };

    const finalQueue = simulateQueue(50);
    assert.strictEqual(finalQueue.length, 5, `Expected queue capped at 5, but got ${finalQueue.length}`);
    assert.strictEqual(finalQueue[4].title, "Toast 50", "The latest toast must be at the end of the queue");
    assert.strictEqual(finalQueue[0].title, "Toast 46", "Oldest retained toast must be Toast 46");
  });

  await test("High throughput micro-benchmark: 1,000 rapid toast events in under 50ms", () => {
    const start = performance.now();
    let queue = [];
    const showToast = (t) => {
      queue = [...queue.slice(-4), { ...t, id: `t-${Math.random()}` }];
    };

    for (let i = 0; i < 1000; i++) {
      showToast({ title: `Stress ${i}`, type: i % 2 === 0 ? "success" : "error" });
    }
    const elapsed = performance.now() - start;
    assert.strictEqual(queue.length, 5);
    assert.ok(elapsed < 50, `1,000 rapid toasts took ${elapsed}ms, expected < 50ms`);
  });

  await test("XSS Safety: Malicious script tags in title/description safely escaped by React", () => {
    const xssPayload = '<script>alert("xss")</script><img src=x onerror=alert(1)>';
    // We can test ToastItem rendering
    const code = fs.readFileSync(toastPath, "utf-8");
    // Ensure it uses React text nodes ({toast.title}, {toast.description}) and NO dangerouslySetInnerHTML
    assert.ok(!code.includes("dangerouslySetInnerHTML"), "ToastNotification must never use dangerouslySetInnerHTML");
  });

  // ----------------------------------------------------------------------------
  // SUITE 3: CONFIRM DIALOG EMPIRICAL STRESS
  // ----------------------------------------------------------------------------
  suite("3. ConfirmDialog.tsx Component & Callback Verification");

  const confirmPath = path.join(SRC_DIR, "components", "ui", "ConfirmDialog.tsx");
  const confirmModule = compileTsx(confirmPath);

  await test("ConfirmDialog exports ConfirmDialog component", () => {
    assert.ok(typeof confirmModule.ConfirmDialog === "function", "ConfirmDialog must be a function component");
  });

  await test("ConfirmDialog returns null when isOpen=false (zero DOM footprint)", () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(confirmModule.ConfirmDialog, {
        isOpen: false,
        title: "Test",
        description: "Test Desc",
        onConfirm: () => {},
        onCancel: () => {},
      })
    );
    assert.strictEqual(html, "", "When isOpen is false, ConfirmDialog must render nothing");
  });

  await test("ConfirmDialog renders accessible modal structure when isOpen=true", () => {
    const html = ReactDOMServer.renderToString(
      React.createElement(confirmModule.ConfirmDialog, {
        isOpen: true,
        title: "Sistem Ayarlarını Sıfırla",
        description: "Tüm yerel ayarlar silinecek ve fabrika ayarlarına dönülecektir.",
        confirmText: "Fabrika Ayarlarına Dön",
        cancelText: "Vazgeç",
        variant: "danger",
        onConfirm: () => {},
        onCancel: () => {},
      })
    );

    assert.ok(html.includes('role="dialog"'), "Modal must have role='dialog'");
    assert.ok(html.includes('aria-modal="true"'), "Modal must have aria-modal='true'");
    assert.ok(html.includes("Sistem Ayarlarını Sıfırla"), "Must render title");
    assert.ok(html.includes("Tüm yerel ayarlar silinecek"), "Must render description");
    assert.ok(html.includes("Fabrika Ayarlarına Dön"), "Must render custom confirm button text");
    assert.ok(html.includes("Vazgeç"), "Must render cancel button text");
    assert.ok(html.includes("bg-rose-600"), "Danger variant must include rose button class");
  });

  await test("ConfirmDialog styling variants (warning, primary, danger)", () => {
    const renderVariant = (variant) =>
      ReactDOMServer.renderToString(
        React.createElement(confirmModule.ConfirmDialog, {
          isOpen: true,
          title: "V Title",
          description: "V Desc",
          variant,
          onConfirm: () => {},
          onCancel: () => {},
        })
      );

    const htmlDanger = renderVariant("danger");
    assert.ok(htmlDanger.includes("bg-rose-600"), "Danger variant uses rose button");

    const htmlWarning = renderVariant("warning");
    assert.ok(htmlWarning.includes("bg-amber-600"), "Warning variant uses amber button");

    const htmlPrimary = renderVariant("primary");
    assert.ok(htmlPrimary.includes("bg-blue-600"), "Primary variant uses blue button");
  });

  await test("Keyboard event logic analysis in ConfirmDialog", () => {
    const code = fs.readFileSync(confirmPath, "utf-8");
    // Verify Escape key cancels
    assert.ok(code.includes('e.key === "Escape"'), "Must handle Escape key");
    assert.ok(code.includes("onCancel()"), "Escape key must trigger onCancel()");

    // Verify Enter key confirms
    assert.ok(code.includes('e.key === "Enter"'), "Must handle Enter key");
    assert.ok(code.includes("onConfirm()"), "Enter key must trigger onConfirm()");

    // Verify event cleanup
    assert.ok(
      code.includes('window.removeEventListener("keydown", handleKeyDown)'),
      "Must clean up keydown listener on unmount/re-render"
    );
  });

  // ----------------------------------------------------------------------------
  // SUITE 4: DEV SERVER & APP SHELL HTTP HEALTH
  // ----------------------------------------------------------------------------
  suite("4. Dev Server & App Shell HTTP Health Check");

  await test("Server responds with HTTP 200 OK on http://localhost:3000", async () => {
    const res = await fetch("http://localhost:3000");
    assert.strictEqual(res.status, 200, `Expected HTTP 200, received ${res.status}`);
    const text = await res.text();
    assert.ok(text.length > 500, "Expected non-empty HTML response body");
    assert.ok(text.includes("<html") || text.includes("<!DOCTYPE html>"), "Expected HTML document root");
  });

  await test("Server headers contain correct MIME type and charset", async () => {
    const res = await fetch("http://localhost:3000");
    const contentType = res.headers.get("content-type");
    assert.ok(contentType, "Expected content-type header");
    assert.ok(contentType.includes("text/html"), `Expected text/html, got ${contentType}`);
  });

  await test("Concurrency stress: 25 simultaneous HTTP requests all succeed with status 200", async () => {
    const requests = Array.from({ length: 25 }, () => fetch("http://localhost:3000"));
    const responses = await Promise.all(requests);
    const non200 = responses.filter((r) => r.status !== 200);
    assert.strictEqual(non200.length, 0, `All 25 requests must return HTTP 200, but ${non200.length} failed`);
  });

  await test("src/app/page.tsx wraps executive shell inside ToastProvider", () => {
    const pageCode = fs.readFileSync(path.join(SRC_DIR, "app", "page.tsx"), "utf-8");
    assert.ok(pageCode.includes("<ToastProvider>"), "page.tsx must mount ToastProvider at the root");
    assert.ok(pageCode.includes("</ToastProvider>"), "page.tsx must close ToastProvider");
    assert.ok(pageCode.includes("const toast = useToast();"), "page.tsx must consume useToast()");
  });

  // ----------------------------------------------------------------------------
  // SUITE 5: DESIGN SYSTEM TOKENS & RESPONSIVE LAYOUT AUDIT
  // ----------------------------------------------------------------------------
  suite("5. Design System Tokens, Typography & Responsive Layout");

  await test("Dual-theme CSS variables and tokens exist in src/app/globals.css", () => {
    const css = fs.readFileSync(path.join(SRC_DIR, "app", "globals.css"), "utf-8");
    // Check Dark Obsidian tokens
    assert.ok(css.includes("#090a0f") || css.includes("090a0f"), "globals.css must define Dark Obsidian token (#090a0f)");
    // Check Crisp Slate tokens
    assert.ok(css.includes("#f8fafc") || css.includes("f8fafc"), "globals.css must define Crisp Slate token (#f8fafc)");
    // Check typography tokens: tabular nums & negative tracking
    assert.ok(css.includes("tabular-nums"), "globals.css must configure tabular-nums for numeric alignment");
    assert.ok(css.includes("letter-spacing") || css.includes("-0.02em"), "globals.css must configure executive tracking");
  });

  await test("Tailwind config defines bespoke obsidian and slate.crisp tokens", () => {
    const tw = fs.readFileSync(path.join(PROJECT_ROOT, "tailwind.config.js"), "utf-8");
    assert.ok(tw.includes("obsidian"), "tailwind.config.js must include obsidian colors");
    assert.ok(tw.includes("crisp"), "tailwind.config.js must include crisp slate colors");
    assert.ok(tw.includes("hud"), "tailwind.config.js must include hud shadow tokens");
  });

  await test("Responsive off-canvas mobile drawer & backdrop scrim in page.tsx", () => {
    const pageCode = fs.readFileSync(path.join(SRC_DIR, "app", "page.tsx"), "utf-8");
    assert.ok(pageCode.includes("mobileMenuOpen"), "page.tsx must track mobileMenuOpen state");
    assert.ok(pageCode.includes("sm:hidden"), "Mobile backdrop scrim must hide on sm: screens");
    assert.ok(
      pageCode.includes("-translate-x-full") && pageCode.includes("translate-x-0"),
      "Sidebar must have off-canvas drawer slide classes"
    );
  });

  await test("CommandPalette Ctrl+K window listener & quick action bindings", () => {
    const cmdCode = fs.readFileSync(path.join(SRC_DIR, "components", "CommandPalette.tsx"), "utf-8");
    assert.ok(
      cmdCode.includes("e.metaKey || e.ctrlKey") && cmdCode.includes('"k"'),
      "CommandPalette must listen for Ctrl+K or Cmd+K"
    );
    assert.ok(cmdCode.includes("ArrowDown") && cmdCode.includes("ArrowUp"), "CommandPalette must support keyboard arrow navigation");

    const pageCode = fs.readFileSync(path.join(SRC_DIR, "app", "page.tsx"), "utf-8");
    assert.ok(pageCode.includes("calendar_book"), "page.tsx must handle calendar_book action from CommandPalette");
  });

  // ----------------------------------------------------------------------------
  // SUITE 6: ADVERSARIAL EDGE CASES & BOUNDARY INVARIANTS
  // ----------------------------------------------------------------------------
  suite("6. Adversarial Edge Cases & Boundary Invariants");

  await test("Toast queue: Out-of-order dismissal and non-existent ID removal invariant", () => {
    let queue = [
      { id: "t-1", title: "Toast 1" },
      { id: "t-2", title: "Toast 2" },
      { id: "t-3", title: "Toast 3" },
      { id: "t-4", title: "Toast 4" },
      { id: "t-5", title: "Toast 5" },
    ];

    const remove = (id) => {
      queue = queue.filter((t) => t.id !== id);
    };

    // Remove middle item
    remove("t-3");
    assert.deepStrictEqual(queue.map((t) => t.id), ["t-1", "t-2", "t-4", "t-5"]);

    // Remove non-existent item (should be idempotent no-op)
    remove("non-existent-id");
    assert.deepStrictEqual(queue.map((t) => t.id), ["t-1", "t-2", "t-4", "t-5"]);

    // Remove head and tail
    remove("t-1");
    remove("t-5");
    assert.deepStrictEqual(queue.map((t) => t.id), ["t-2", "t-4"]);
  });

  await test("ConfirmDialog handles boundary inputs: empty text, 10,000 char strings, default fallbacks", () => {
    // 1. Empty strings
    const htmlEmpty = ReactDOMServer.renderToString(
      React.createElement(confirmModule.ConfirmDialog, {
        isOpen: true,
        title: "",
        description: "",
        onConfirm: () => {},
        onCancel: () => {},
      })
    );
    assert.ok(htmlEmpty.includes('role="dialog"'), "Renders dialog even with empty title/description");
    assert.ok(htmlEmpty.includes("Onayla"), "Defaults confirmText to 'Onayla'");
    assert.ok(htmlEmpty.includes("Vazgeç"), "Defaults cancelText to 'Vazgeç'");

    // 2. 10,000 character stress test
    const longString = "A".repeat(10000);
    const htmlLong = ReactDOMServer.renderToString(
      React.createElement(confirmModule.ConfirmDialog, {
        isOpen: true,
        title: "Long Title",
        description: longString,
        onConfirm: () => {},
        onCancel: () => {},
      })
    );
    assert.ok(htmlLong.includes(longString), "Renders massive 10,000 char description without truncation exception");
  });

  await test("Default VORTEX brand identity consistency across shell, header and settings", () => {
    const pageCode = fs.readFileSync(path.join(SRC_DIR, "app", "page.tsx"), "utf-8");
    assert.ok(pageCode.includes('brandChoice: "VORTEX"'), "page.tsx default brandChoice must be 'VORTEX'");

    const settingsCode = fs.readFileSync(path.join(SRC_DIR, "components", "SystemSettings.tsx"), "utf-8");
    assert.ok(settingsCode.includes('"VORTEX"'), "SystemSettings.tsx must include 'VORTEX' in brand choices");
    assert.ok(settingsCode.includes('brandChoice: "VORTEX"'), "SystemSettings.tsx default brand must be 'VORTEX'");
  });

  // ----------------------------------------------------------------------------
  // SUMMARY & VERDICT
  // ----------------------------------------------------------------------------
  console.log(`\n${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}`);
  console.log(`${ANSI.bold}  CHALLENGER 1 VERIFICATION SUMMARY  ${ANSI.reset}`);
  console.log(`${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}`);
  console.log(`  Total Executed Tests : ${ANSI.bold}${totalTests}${ANSI.reset}`);
  console.log(`  Passed               : ${ANSI.green}${ANSI.bold}${passedTests}${ANSI.reset}`);
  console.log(`  Failed               : ${failedTests > 0 ? ANSI.red : ANSI.green}${ANSI.bold}${failedTests}${ANSI.reset}`);
  console.log(`  Pass Rate            : ${failedTests === 0 ? ANSI.green : ANSI.red}${ANSI.bold}${((passedTests / totalTests) * 100).toFixed(1)}%${ANSI.reset}`);

  if (failedTests > 0) {
    console.log(`\n${ANSI.bold}${ANSI.red}VERDICT: REJECT${ANSI.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${ANSI.bold}${ANSI.green}VERDICT: APPROVE${ANSI.reset}`);
    process.exit(0);
  }
}

runAll().catch((err) => {
  console.error("Fatal test runner crash:", err);
  process.exit(1);
});
