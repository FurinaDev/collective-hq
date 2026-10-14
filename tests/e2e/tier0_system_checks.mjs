// ==============================================================================
// TIER 0: SYSTEM HEALTH & STATIC VERIFICATION CHECKS
// ==============================================================================

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { harness, assertCustom as assert } from "./harness.mjs";

const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, "src");

export function registerTier0Tests() {
  harness.suite("Tier 0.1 - Live Dev Server Health", () => {
    harness.test("Server responds with HTTP 200 OK on http://localhost:3000", async () => {
      const response = await fetch("http://localhost:3000");
      assert.strictEqual(response.status, 200, `Expected HTTP 200, received ${response.status}`);
      const text = await response.text();
      assert.ok(text.length > 500, "Expected non-trivial HTML response body");
      assert.contains(text.toLowerCase(), "html", "Expected HTML document");
    });

    harness.test("Server response contains proper headers and charset", async () => {
      const response = await fetch("http://localhost:3000");
      const contentType = response.headers.get("content-type");
      assert.ok(contentType, "Expected content-type header");
      assert.contains(contentType, "text/html", "Expected text/html content-type");
    });
  });

  harness.suite("Tier 0.2 - TypeScript Compilation Health", () => {
    harness.test("TypeScript compilation exits cleanly with code 0 (zero type errors)", () => {
      const tscPath = path.join(PROJECT_ROOT, "node_modules", "typescript", "bin", "tsc");
      try {
        const output = execSync(`node "${tscPath}" --noEmit`, {
          cwd: PROJECT_ROOT,
          encoding: "utf-8",
          stdio: ["ignore", "pipe", "pipe"]
        });
        assert.ok(true, "Compilation succeeded without errors");
      } catch (err) {
        assert.fail(`TypeScript compilation failed with error code ${err.status}:\n${err.stdout || err.stderr}`);
      }
    });
  });

  harness.suite("Tier 0.3 - Static Analysis: Browser Dialog Audit", () => {
    harness.test("ZERO alert(), confirm(), prompt() calls across all files in src/", () => {
      const violations = [];
      const dialogRegex = /\b(alert|confirm|prompt)\s*\(/g;

      function scanDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            scanDir(fullPath);
          } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
            const content = fs.readFileSync(fullPath, "utf-8");
            const lines = content.split("\n");
            lines.forEach((line, idx) => {
              // Ignore single-line comments
              const trimmed = line.trim();
              if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
                return;
              }
              let match;
              while ((match = dialogRegex.exec(line)) !== null) {
                violations.push({
                  file: path.relative(PROJECT_ROOT, fullPath),
                  line: idx + 1,
                  dialogType: match[1],
                  content: line.trim()
                });
              }
            });
          }
        }
      }

      scanDir(SRC_DIR);

      if (violations.length > 0) {
        const details = violations
          .map(v => `  - ${v.file}:${v.line} uses ${v.dialogType}() -> "${v.content}"`)
          .join("\n");
        assert.fail(`Found ${violations.length} forbidden browser dialog calls in src/:\n${details}`);
      }

      assert.strictEqual(violations.length, 0);
    });
  });

  harness.suite("Tier 0.4 - Module Architecture & Component Export Audit", () => {
    const requiredComponents = [
      "DeBottleneckEngine.tsx",
      "TeamCapacityMatrix.tsx",
      "WorkspaceDocsHub.tsx",
      "CommsStudio.tsx",
      "CapitalForge.tsx",
      "StrategicLab.tsx",
      "InteractiveTimeline.tsx",
      "SystemSettings.tsx",
      "ExecutiveHeader.tsx",
      "ExecutiveFooter.tsx",
      "CommandPalette.tsx",
      path.join("ui", "ToastNotification.tsx"),
      path.join("ui", "ConfirmDialog.tsx")
    ];

    harness.test("All 8 core operational modules and shell UI components exist in src/components", () => {
      const componentsDir = path.join(SRC_DIR, "components");
      for (const comp of requiredComponents) {
        const fullPath = path.join(componentsDir, comp);
        assert.ok(fs.existsSync(fullPath), `Missing required component file: ${comp}`);
      }
    });

    harness.test("All core components and HUD UI elements provide valid exported functional components", () => {
      const componentsDir = path.join(SRC_DIR, "components");
      for (const comp of requiredComponents) {
        const fullPath = path.join(componentsDir, comp);
        const content = fs.readFileSync(fullPath, "utf-8");
        const baseName = path.basename(comp).replace(/\.tsx$/, "");
        const hasExport = content.includes(`export function ${baseName}`) || 
                          content.includes(`export default function ${baseName}`) ||
                          content.includes(`export const ${baseName}`) ||
                          content.includes(`export function useToast`) ||
                          content.includes(`export function ToastProvider`);
        assert.ok(hasExport, `Component ${comp} does not export expected function ${baseName}`);
      }
    });
  });
}
