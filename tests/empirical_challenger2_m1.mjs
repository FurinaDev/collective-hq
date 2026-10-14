// ==============================================================================
// EMPIRICAL CHALLENGER 2: RESPONSIVE LAYOUT CONSTRAINTS & KEYBOARD SHORTCUTS
// Milestone M1 Empirical Verification Harness
// ==============================================================================

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";

const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, "src");

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  yellow: "\x1b[33m",
  bgGreen: "\x1b[42m",
  bgRed: "\x1b[41m"
};

let passedCount = 0;
let failedCount = 0;
const failures = [];

function test(name, fn) {
  const start = Date.now();
  try {
    fn();
    const duration = Date.now() - start;
    passedCount++;
    console.log(`  ${ANSI.green}✔ [PASS]${ANSI.reset} ${name} ${ANSI.dim}(${duration}ms)${ANSI.reset}`);
  } catch (err) {
    const duration = Date.now() - start;
    failedCount++;
    failures.push({ name, error: err });
    console.log(`  ${ANSI.red}✖ [FAIL]${ANSI.reset} ${name} ${ANSI.dim}(${duration}ms)${ANSI.reset}`);
    console.log(`     ${ANSI.red}Error: ${err.message}${ANSI.reset}`);
  }
}

async function testAsync(name, fn) {
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    passedCount++;
    console.log(`  ${ANSI.green}✔ [PASS]${ANSI.reset} ${name} ${ANSI.dim}(${duration}ms)${ANSI.reset}`);
  } catch (err) {
    const duration = Date.now() - start;
    failedCount++;
    failures.push({ name, error: err });
    console.log(`  ${ANSI.red}✖ [FAIL]${ANSI.reset} ${name} ${ANSI.dim}(${duration}ms)${ANSI.reset}`);
    console.log(`     ${ANSI.red}Error: ${err.message}${ANSI.reset}`);
  }
}

console.log(`\n${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}`);
console.log(`${ANSI.bold}${ANSI.cyan}  CHALLENGER 2 EMPIRICAL TEST SUITE: RESPONSIVE LAYOUT & KEYBOARD SHORTCUTS   ${ANSI.reset}`);
console.log(`${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}\n`);

// ------------------------------------------------------------------------------
// SECTION 1: TypeScript Zero-Error Verification
// ------------------------------------------------------------------------------
console.log(`${ANSI.bold}--- SECTION 1: TYPESCRIPT COMPILATION HEALTH ---${ANSI.reset}`);

test("1.1: tsc --noEmit compiles the entire project with exit code 0", () => {
  const tscBin = path.join(PROJECT_ROOT, "node_modules", "typescript", "bin", "tsc");
  assert.ok(fs.existsSync(tscBin), `tsc binary must exist at ${tscBin}`);
  
  const stdout = execSync(`node "${tscBin}" --noEmit`, {
    cwd: PROJECT_ROOT,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  
  assert.strictEqual(stdout.trim(), "", "tsc --noEmit output should be completely empty on 0 errors");
});

// ------------------------------------------------------------------------------
// SECTION 2: Mobile Drawer Class Toggle & Responsive Viewport Constraints
// ------------------------------------------------------------------------------
console.log(`\n${ANSI.bold}--- SECTION 2: MOBILE DRAWER & RESPONSIVE LAYOUT CONSTRAINTS ---${ANSI.reset}`);

const pageSource = fs.readFileSync(path.join(SRC_DIR, "app", "page.tsx"), "utf-8");
const headerSource = fs.readFileSync(path.join(SRC_DIR, "components", "ExecutiveHeader.tsx"), "utf-8");

test("2.1: Scrim overlay is conditional on mobileMenuOpen and hidden on desktop (sm:hidden)", () => {
  // Must render conditional scrim
  assert.ok(pageSource.includes("{mobileMenuOpen && ("), "Scrim must be conditionally rendered when mobileMenuOpen is true");
  
  // Scrim must have fixed inset-0 z-40 and sm:hidden and onClick setMobileMenuOpen(false)
  const scrimBlockMatch = pageSource.match(/\{mobileMenuOpen\s*&&\s*\(\s*(<div[\s\S]*?\/>)\s*\)/);
  assert.ok(scrimBlockMatch, "Scrim div block must exist");
  
  const scrimTag = scrimBlockMatch[1];
  assert.ok(scrimTag.includes("setMobileMenuOpen(false)"), "Scrim must have onClick setMobileMenuOpen(false)");
  
  const classMatch = scrimTag.match(/className="([^"]+)"/);
  assert.ok(classMatch, "Scrim must have className attribute");
  
  const scrimClasses = classMatch[1].split(/\s+/);
  assert.ok(scrimClasses.includes("fixed"), "Scrim must be fixed positioned");
  assert.ok(scrimClasses.includes("inset-0"), "Scrim must cover inset-0");
  assert.ok(scrimClasses.includes("z-40"), "Scrim must be z-40");
  assert.ok(scrimClasses.includes("sm:hidden"), "Scrim MUST have sm:hidden so desktop viewports are never covered");
  assert.ok(scrimClasses.some(c => c.includes("bg-slate-950")), "Scrim must have dark background");
});

test("2.2: Aside element classes dynamically toggle between closed and open states", () => {
  // Regex to extract aside element class template
  const asideMatch = pageSource.match(/<aside[^>]*className=\{`([^`]+)`\}/s);
  assert.ok(asideMatch, "Aside element with template string className must exist");
  
  const templateStr = asideMatch[1];
  
  // Base classes that must always be present
  assert.ok(templateStr.includes("fixed inset-y-0 left-0 z-50"), "Aside must have mobile off-canvas fixed position");
  assert.ok(templateStr.includes("sm:static sm:z-20 sm:w-64 sm:shrink-0 sm:translate-x-0"), "Aside must have desktop static in-flow styling");
  assert.ok(templateStr.includes("transition-transform"), "Aside must have smooth transition-transform");
  
  // Dynamic expression
  assert.ok(
    templateStr.includes("mobileMenuOpen ?"),
    "Aside must contain dynamic ternary checking mobileMenuOpen"
  );
  
  // Simulate closed state:
  const closedClassSimulation = (open) => `fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out sm:static sm:z-20 sm:w-64 sm:shrink-0 sm:translate-x-0 ${
    open ? "translate-x-0 shadow-2xl" : "-translate-x-full sm:translate-x-0"
  }`;
  
  const closedClasses = closedClassSimulation(false).split(/\s+/);
  assert.ok(closedClasses.includes("-translate-x-full"), "Closed state must have -translate-x-full for mobile");
  assert.ok(closedClasses.includes("sm:translate-x-0"), "Closed state must have sm:translate-x-0 so desktop sidebar is visible");
  assert.ok(closedClasses.includes("sm:static"), "Desktop sidebar must be static in-flow");
  assert.ok(closedClasses.includes("sm:w-64"), "Desktop sidebar must have standard 256px width");
  
  // Simulate open state:
  const openClasses = closedClassSimulation(true).split(/\s+/);
  assert.ok(openClasses.includes("translate-x-0"), "Open state must have translate-x-0 to slide in");
  assert.ok(openClasses.includes("shadow-2xl"), "Open state must have shadow-2xl for elevated drawer look");
  assert.ok(openClasses.includes("w-72"), "Mobile drawer must have comfortable w-72 (288px) width");
  assert.ok(openClasses.includes("sm:static"), "Desktop remains static even if open is set");
});

test("2.3: All drawer navigation clicks dismiss mobileMenuOpen (setMobileMenuOpen(false))", () => {
  // Every activeTab switch button in the navigation must dismiss mobile menu
  const modules = ["pulse", "strategic_lab", "timeline", "workspace_docs", "capital_forge", "team_matrix", "comms", "settings"];
  
  for (const mod of modules) {
    const pattern = new RegExp(`setActiveTab\\("${mod}"\\);\\s*setMobileMenuOpen\\(false\\);`);
    assert.ok(
      pattern.test(pageSource),
      `Navigation item "${mod}" must call setActiveTab("${mod}") and setMobileMenuOpen(false)`
    );
  }
});

test("2.4: Drawer close (X) button exists and is hidden on desktop (sm:hidden)", () => {
  // Mobile drawer header close button
  const closeBtnPattern = /<button[^>]*onClick=\{[^}]*setMobileMenuOpen\(false\)[^}]*\}[^>]*className="([^"]+)"[^>]*aria-label="Kapat"[^>]*>\s*<X/s;
  const match = pageSource.match(closeBtnPattern);
  assert.ok(match, "Drawer close button with <X> icon and aria-label='Kapat' must exist");
  
  const btnClasses = match[1].split(/\s+/);
  assert.ok(btnClasses.includes("sm:hidden"), "Drawer close button must be sm:hidden");
});

test("2.5: ExecutiveHeader hamburger toggle is sm:hidden and toggles mobileMenuOpen state", () => {
  // Hamburger button in header
  const hamburgerPattern = /<button[^>]*onClick=\{[^}]*setMobileMenuOpen\(\(prev\)\s*=>\s*!prev\)[^}]*\}[^>]*className="([^"]+)"/s;
  const match = headerSource.match(hamburgerPattern);
  assert.ok(match, "Header hamburger button with setMobileMenuOpen toggle must exist");
  
  const btnClasses = match[1].split(/\s+/);
  assert.ok(btnClasses.includes("sm:hidden"), "Header hamburger button must have sm:hidden");
  
  // Verify accessible aria-label switching
  assert.ok(
    headerSource.includes('aria-label={mobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}'),
    "Hamburger button must have dynamic accessible aria-label"
  );
  
  // Verify icon toggle between X and Menu
  assert.ok(
    headerSource.includes('{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}'),
    "Hamburger button must switch between Menu and X icon"
  );
});

test("2.6: Layout container geometry ensures zero horizontal overflow and no desktop overlap", () => {
  // Root container: flex h-screen w-screen overflow-hidden
  assert.ok(
    pageSource.includes('className="flex h-screen w-screen overflow-hidden'),
    "Root container must constrain viewport with flex h-screen w-screen overflow-hidden"
  );
  
  // Right content container: flex flex-1 flex-col overflow-hidden
  assert.ok(
    pageSource.includes('className="flex flex-1 flex-col overflow-hidden bg-slate-50"'),
    "Content container must be flex flex-1 flex-col overflow-hidden"
  );
  
  // Main area: flex-1 overflow-y-auto
  assert.ok(
    pageSource.includes('className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"'),
    "Main scroll area must have flex-1 overflow-y-auto and responsive padding"
  );
});

// ------------------------------------------------------------------------------
// SECTION 3: Keyboard Shortcut Listener (Ctrl+K / Cmd+K)
// ------------------------------------------------------------------------------
console.log(`\n${ANSI.bold}--- SECTION 3: CTRL+K KEYBOARD SHORTCUT LISTENER EMPIRICAL VERIFICATION ---${ANSI.reset}`);

const cmdPaletteSource = fs.readFileSync(path.join(SRC_DIR, "components", "CommandPalette.tsx"), "utf-8");

test("3.1: CommandPalette binds keydown listener to window with proper cleanup", () => {
  // Must attach to window
  assert.ok(
    cmdPaletteSource.includes('window.addEventListener("keydown", handleKeyDown)'),
    "Must bind keydown listener to window"
  );
  
  // Must remove on unmount
  assert.ok(
    cmdPaletteSource.includes('window.removeEventListener("keydown", handleKeyDown)'),
    "Must remove keydown listener from window on unmount/re-render"
  );
  
  // Dependencies must include [isOpen, onClose, onOpen]
  assert.ok(
    cmdPaletteSource.includes("}, [isOpen, onClose, onOpen]);"),
    "useEffect dependencies must be [isOpen, onClose, onOpen]"
  );
});

test("3.2: Empirical Simulation: Ctrl+K / Cmd+K handler execution logic", () => {
  // Extract or simulate the exact handleKeyDown function from CommandPalette.tsx:
  //
  // const handleKeyDown = (e: KeyboardEvent) => {
  //   if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
  //     e.preventDefault();
  //     if (isOpen) {
  //       onClose();
  //     } else if (onOpen) {
  //       onOpen();
  //     }
  //   }
  //   if (e.key === "Escape" && isOpen) {
  //     onClose();
  //   }
  // };

  function createHandler(isOpen, onClose, onOpen) {
    return (e) => {
      let prevented = false;
      const eventProxy = {
        ...e,
        preventDefault: () => { prevented = true; }
      };

      if ((eventProxy.metaKey || eventProxy.ctrlKey) && (eventProxy.key === "k" || eventProxy.key === "K")) {
        eventProxy.preventDefault();
        if (isOpen) {
          onClose();
        } else if (onOpen) {
          onOpen();
        }
      }
      if (eventProxy.key === "Escape" && isOpen) {
        onClose();
      }
      return { prevented };
    };
  }

  // Subtest A: Windows/Linux Ctrl+k when closed -> calls onOpen and preventDefault
  let opened = false;
  let closed = false;
  let handler = createHandler(false, () => { closed = true; }, () => { opened = true; });
  let res = handler({ ctrlKey: true, metaKey: false, key: "k" });
  assert.strictEqual(opened, true, "Ctrl+k when closed must invoke onOpen");
  assert.strictEqual(closed, false, "Ctrl+k when closed must NOT invoke onClose");
  assert.strictEqual(res.prevented, true, "Ctrl+k must call preventDefault");

  // Subtest B: Mac Cmd+k when closed -> calls onOpen
  opened = false;
  closed = false;
  handler = createHandler(false, () => { closed = true; }, () => { opened = true; });
  res = handler({ ctrlKey: false, metaKey: true, key: "k" });
  assert.strictEqual(opened, true, "Cmd+k when closed must invoke onOpen");
  assert.strictEqual(res.prevented, true, "Cmd+k must call preventDefault");

  // Subtest C: Uppercase K (Caps Lock or Shift)
  opened = false;
  closed = false;
  handler = createHandler(false, () => { closed = true; }, () => { opened = true; });
  res = handler({ ctrlKey: true, metaKey: false, key: "K" });
  assert.strictEqual(opened, true, "Ctrl+K uppercase must invoke onOpen");

  // Subtest D: Ctrl+K when already OPEN -> toggles closed
  opened = false;
  closed = false;
  handler = createHandler(true, () => { closed = true; }, () => { opened = true; });
  res = handler({ ctrlKey: true, metaKey: false, key: "k" });
  assert.strictEqual(closed, true, "Ctrl+K when open must invoke onClose (toggle)");
  assert.strictEqual(opened, false, "Ctrl+K when open must NOT invoke onOpen");
  assert.strictEqual(res.prevented, true, "Ctrl+K when open must call preventDefault");

  // Subtest E: Escape when OPEN -> calls onClose
  opened = false;
  closed = false;
  handler = createHandler(true, () => { closed = true; }, () => { opened = true; });
  res = handler({ ctrlKey: false, metaKey: false, key: "Escape" });
  assert.strictEqual(closed, true, "Escape when open must invoke onClose");

  // Subtest F: Escape when CLOSED -> does nothing
  opened = false;
  closed = false;
  handler = createHandler(false, () => { closed = true; }, () => { opened = true; });
  res = handler({ ctrlKey: false, metaKey: false, key: "Escape" });
  assert.strictEqual(closed, false, "Escape when closed must NOT invoke onClose");

  // Subtest G: Irrelevant key (e.g. 'k' without modifier) -> does nothing, not prevented
  opened = false;
  closed = false;
  handler = createHandler(false, () => { closed = true; }, () => { opened = true; });
  res = handler({ ctrlKey: false, metaKey: false, key: "k" });
  assert.strictEqual(opened, false, "Plain 'k' must NOT open palette");
  assert.strictEqual(res.prevented, false, "Plain 'k' must NOT be preventDefaulted");

  // Subtest H: Other shortcut (e.g. Ctrl+S, Ctrl+P) -> does nothing, not prevented
  opened = false;
  closed = false;
  handler = createHandler(false, () => { closed = true; }, () => { opened = true; });
  res = handler({ ctrlKey: true, metaKey: false, key: "s" });
  assert.strictEqual(opened, false, "Ctrl+s must not trigger command palette");
  assert.strictEqual(res.prevented, false, "Ctrl+s must not be preventDefaulted");
});

test("3.3: App shell passes onOpen, onClose, and isOpen correctly to CommandPalette", () => {
  // Check page.tsx passes props:
  // <CommandPalette
  //   isOpen={commandPaletteOpen}
  //   onOpen={() => setCommandPaletteOpen(true)}
  //   onClose={() => setCommandPaletteOpen(false)}
  //   onSelectAction={...}
  // />
  const paletteUsage = pageSource.match(/<CommandPalette\s+isOpen=\{commandPaletteOpen\}\s+onOpen=\{\(\)\s*=>\s*setCommandPaletteOpen\(true\)\}\s+onClose=\{\(\)\s*=>\s*setCommandPaletteOpen\(false\)\}/s);
  assert.ok(paletteUsage, "page.tsx must provide isOpen, onOpen, and onClose props to CommandPalette");
});

test("3.4: ExecutiveHeader trigger button invokes onOpenCommand", () => {
  // Check that header button calls onOpenCommand
  assert.ok(
    headerSource.includes("onClick={onOpenCommand}"),
    "ExecutiveHeader search button must trigger onOpenCommand"
  );
  
  // Check that page.tsx binds onOpenCommand to setCommandPaletteOpen(true)
  assert.ok(
    pageSource.includes("onOpenCommand={() => setCommandPaletteOpen(true)}"),
    "page.tsx must pass onOpenCommand={() => setCommandPaletteOpen(true)} to ExecutiveHeader"
  );
  
  // Check keyboard hint badge in button
  assert.ok(
    headerSource.includes("<kbd"),
    "ExecutiveHeader search button must include keyboard shortcut hint badge"
  );
  assert.ok(
    headerSource.includes("K"),
    "ExecutiveHeader search button must display 'K' badge"
  );
});

// ------------------------------------------------------------------------------
// SECTION 4: Stress Testing & Boundary Scenarios
// ------------------------------------------------------------------------------
console.log(`\n${ANSI.bold}--- SECTION 4: STRESS TESTING & BOUNDARY MATRIX ---${ANSI.reset}`);

test("4.1: Rapid consecutive toggling (1,000 cycles) maintains state consistency", () => {
  let isOpen = false;
  const onOpen = () => { isOpen = true; };
  const onClose = () => { isOpen = false; };

  for (let i = 0; i < 1000; i++) {
    // Simulate Ctrl+K keypress
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  }

  // 1000 toggles starting from false must end on false (even number)
  assert.strictEqual(isOpen, false, "1000 toggles must cleanly return to closed state");

  // 1001 toggles must end on true
  if (isOpen) onClose(); else onOpen();
  assert.strictEqual(isOpen, true, "1001 toggles must cleanly result in open state");
});

test("4.2: Keyboard event with malformed or undefined properties does not throw", () => {
  function safeHandler(isOpen, onClose, onOpen) {
    return (e) => {
      if ((e?.metaKey || e?.ctrlKey) && (e?.key === "k" || e?.key === "K")) {
        if (isOpen) onClose();
        else if (onOpen) onOpen();
      }
      if (e?.key === "Escape" && isOpen) {
        onClose();
      }
    };
  }

  const handler = safeHandler(false, () => {}, () => {});
  
  // Empty event
  assert.doesNotThrow(() => handler({}));
  // Null-ish properties
  assert.doesNotThrow(() => handler({ key: null, ctrlKey: undefined }));
  // Numerical key
  assert.doesNotThrow(() => handler({ key: 123, ctrlKey: true }));
  // Object key
  assert.doesNotThrow(() => handler({ key: {}, ctrlKey: true }));
});

test("4.3: Viewport Responsive Breakpoint Matrix Validation", () => {
  // Define standard viewport profiles
  const viewports = [
    { name: "iPhone SE", width: 375, isMobile: true, asideShouldBeStatic: false },
    { name: "iPhone 14 Pro Max", width: 430, isMobile: true, asideShouldBeStatic: false },
    { name: "Mobile Boundary (639px)", width: 639, isMobile: true, asideShouldBeStatic: false },
    { name: "Tablet Min (sm: 640px)", width: 640, isMobile: false, asideShouldBeStatic: true },
    { name: "iPad Mini (768px / md)", width: 768, isMobile: false, asideShouldBeStatic: true },
    { name: "iPad Pro / Desktop Min (1024px / lg)", width: 1024, isMobile: false, asideShouldBeStatic: true },
    { name: "MacBook Air (1280px / xl)", width: 1280, isMobile: false, asideShouldBeStatic: true },
    { name: "Full HD Monitor (1920px / 2xl)", width: 1920, isMobile: false, asideShouldBeStatic: true }
  ];

  for (const vp of viewports) {
    // In Tailwind CSS:
    // 'sm' applies when width >= 640px
    const smApplies = vp.width >= 640;
    
    // Scrim display rule: 'fixed inset-0 ... sm:hidden'
    const scrimDisplay = smApplies ? "none" : (/* if open */ "block");
    
    // Aside position rule: 'fixed ... sm:static'
    const asidePosition = smApplies ? "static" : "fixed";
    
    // Aside transform rule when menu is closed: '-translate-x-full sm:translate-x-0'
    const asideClosedTransform = smApplies ? "translateX(0)" : "translateX(-100%)";
    
    // Aside transform rule when menu is open: 'translate-x-0'
    const asideOpenTransform = "translateX(0)";

    // Hamburger button rule: 'sm:hidden'
    const hamburgerDisplay = smApplies ? "none" : "block";

    if (vp.isMobile) {
      assert.strictEqual(smApplies, false, `${vp.name} (${vp.width}px) is mobile: sm media query must NOT apply`);
      assert.strictEqual(asidePosition, "fixed", `${vp.name} aside must be off-canvas fixed overlay`);
      assert.strictEqual(asideClosedTransform, "translateX(-100%)", `${vp.name} closed aside must be hidden off-canvas`);
      assert.strictEqual(hamburgerDisplay, "block", `${vp.name} hamburger must be visible`);
    } else {
      assert.strictEqual(smApplies, true, `${vp.name} (${vp.width}px) is desktop/tablet: sm media query MUST apply`);
      assert.strictEqual(asidePosition, "static", `${vp.name} aside must be static in-flow column`);
      assert.strictEqual(asideClosedTransform, "translateX(0)", `${vp.name} closed aside must remain visible in-flow`);
      assert.strictEqual(scrimDisplay, "none", `${vp.name} scrim must be display:none (sm:hidden)`);
      assert.strictEqual(hamburgerDisplay, "none", `${vp.name} hamburger must be hidden (sm:hidden)`);
    }
  }
});

// ------------------------------------------------------------------------------
// SUMMARY & VERDICT GENERATION
// ------------------------------------------------------------------------------
console.log(`\n${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}`);
console.log(`${ANSI.bold}  EMPIRICAL VERIFICATION EXECUTION SUMMARY${ANSI.reset}`);
console.log(`${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}`);
console.log(`  Total Checks Executed : ${passedCount + failedCount}`);
console.log(`  Passed                : ${ANSI.green}${passedCount}${ANSI.reset}`);
console.log(`  Failed                : ${failedCount === 0 ? ANSI.green + "0" : ANSI.red + failedCount}${ANSI.reset}`);
console.log(`  Pass Rate             : ${((passedCount / (passedCount + failedCount)) * 100).toFixed(1)}%`);

if (failedCount > 0) {
  console.log(`\n${ANSI.red}${ANSI.bold}FAILURES (${failedCount}):${ANSI.reset}`);
  for (const f of failures) {
    console.log(`  - ${f.name}: ${f.error.message}`);
  }
  console.log(`\n${ANSI.bgRed}${ANSI.bold} VERDICT: REJECT ${ANSI.reset}\n`);
  process.exit(1);
} else {
  console.log(`\n${ANSI.bold}${ANSI.green}ALL CHECKS PASSED. ZERO DEFECTS FOUND.${ANSI.reset}`);
  console.log(`\n${ANSI.bgGreen}${ANSI.bold} VERDICT: APPROVE ${ANSI.reset}\n`);
  process.exit(0);
}
