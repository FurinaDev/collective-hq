// ==============================================================================
// VORTEX E2E TEST HARNESS - OPAQUE-BOX AUTOMATION ENGINE
// ==============================================================================

import assert from "node:assert/strict";

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m"
};

class TestHarness {
  constructor() {
    this.suites = [];
    this.currentSuite = null;
    this.stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      durationMs: 0
    };
  }

  suite(name, fn) {
    const s = {
      name,
      tests: [],
      passed: 0,
      failed: 0,
      skipped: 0
    };
    this.suites.push(s);
    this.currentSuite = s;
    fn();
    this.currentSuite = null;
  }

  test(name, fn) {
    if (!this.currentSuite) {
      throw new Error(`Test "${name}" must be registered inside a suite`);
    }
    this.currentSuite.tests.push({ name, fn });
  }

  async runAll() {
    const startTime = Date.now();
    console.log(`\n${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}`);
    console.log(`${ANSI.bold}${ANSI.cyan}  VORTEX EXECUTIVE OS — COMPREHENSIVE E2E VERIFICATION SUITE  ${ANSI.reset}`);
    console.log(`${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}\n`);

    const failures = [];

    for (const suite of this.suites) {
      console.log(`${ANSI.bold}${ANSI.magenta}▶ SUITE: ${suite.name}${ANSI.reset}`);

      for (const t of suite.tests) {
        this.stats.total++;
        const testStart = Date.now();
        try {
          await t.fn();
          const duration = Date.now() - testStart;
          suite.passed++;
          this.stats.passed++;
          console.log(`  ${ANSI.green}✔ [PASS]${ANSI.reset} ${t.name} ${ANSI.dim}(${duration}ms)${ANSI.reset}`);
        } catch (err) {
          const duration = Date.now() - testStart;
          suite.failed++;
          this.stats.failed++;
          failures.push({
            suite: suite.name,
            test: t.name,
            error: err
          });
          console.log(`  ${ANSI.red}✖ [FAIL]${ANSI.reset} ${t.name} ${ANSI.dim}(${duration}ms)${ANSI.reset}`);
          console.log(`     ${ANSI.red}Error: ${err.message}${ANSI.reset}`);
          if (err.expected !== undefined && err.actual !== undefined) {
            console.log(`     ${ANSI.dim}Expected: ${JSON.stringify(err.expected)}${ANSI.reset}`);
            console.log(`     ${ANSI.dim}Actual:   ${JSON.stringify(err.actual)}${ANSI.reset}`);
          }
        }
      }
      console.log("");
    }

    this.stats.durationMs = Date.now() - startTime;
    this.printSummary(failures);
    return {
      stats: this.stats,
      suites: this.suites,
      failures
    };
  }

  printSummary(failures) {
    console.log(`${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}`);
    console.log(`${ANSI.bold}  TEST EXECUTION SUMMARY  ${ANSI.reset}`);
    console.log(`${ANSI.bold}${ANSI.cyan}==============================================================================${ANSI.reset}`);

    const passRate = this.stats.total > 0
      ? ((this.stats.passed / this.stats.total) * 100).toFixed(1)
      : "0.0";

    for (const s of this.suites) {
      const suiteRate = s.tests.length > 0
        ? ((s.passed / s.tests.length) * 100).toFixed(0)
        : "0";
      const statusColor = s.failed === 0 ? ANSI.green : ANSI.red;
      console.log(`  ${statusColor}•${ANSI.reset} ${s.name.padEnd(58)}: ${s.passed}/${s.tests.length} passed (${suiteRate}%)`);
    }

    console.log(`\n  Total Tests : ${ANSI.bold}${this.stats.total}${ANSI.reset}`);
    console.log(`  Passed      : ${ANSI.green}${ANSI.bold}${this.stats.passed}${ANSI.reset}`);
    console.log(`  Failed      : ${this.stats.failed > 0 ? ANSI.red : ANSI.green}${ANSI.bold}${this.stats.failed}${ANSI.reset}`);
    console.log(`  Pass Rate   : ${this.stats.failed === 0 ? ANSI.green : ANSI.yellow}${ANSI.bold}${passRate}%${ANSI.reset}`);
    console.log(`  Duration    : ${ANSI.dim}${this.stats.durationMs}ms${ANSI.reset}\n`);

    if (failures.length > 0) {
      console.log(`${ANSI.bold}${ANSI.red}DISCOVERED DEFECTS / FAILURES (${failures.length}):${ANSI.reset}`);
      failures.forEach((f, idx) => {
        console.log(`  ${idx + 1}. [${f.suite}] ${f.test}`);
        console.log(`     ${ANSI.red}${f.error.message}${ANSI.reset}`);
      });
      console.log("");
    }
  }
}

// Custom assertions
export const assertCustom = {
  ...assert,
  contains(haystack, needle, message) {
    if (typeof haystack !== "string") {
      throw new Error(`assertCustom.contains expected string haystack, received ${typeof haystack}`);
    }
    if (!haystack.includes(needle)) {
      assert.fail(message || `Expected string to contain "${needle}"`);
    }
  },
  notContains(haystack, needle, message) {
    if (typeof haystack === "string" && haystack.includes(needle)) {
      assert.fail(message || `Expected string to NOT contain "${needle}"`);
    }
  },
  matches(str, regex, message) {
    if (!regex.test(str)) {
      assert.fail(message || `Expected string to match pattern ${regex}`);
    }
  },
  between(val, min, max, message) {
    if (val < min || val > max) {
      assert.fail(message || `Expected ${val} to be between ${min} and ${max}`);
    }
  }
};

export const harness = new TestHarness();
