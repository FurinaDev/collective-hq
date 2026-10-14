// ==============================================================================
// VORTEX E2E MASTER TEST RUNNER
// ==============================================================================
// Usage: node tests/e2e/test_runner.mjs
// ==============================================================================

import { harness } from "./harness.mjs";
import { registerTier0Tests } from "./tier0_system_checks.mjs";
import { registerTier1Tests } from "./tier1_feature_coverage.mjs";
import { registerTier2Tests } from "./tier2_boundary_corner.mjs";
import { registerTier3Tests } from "./tier3_cross_feature.mjs";
import { registerTier4Tests } from "./tier4_real_world_scenarios.mjs";

console.log("Registering VORTEX test suites across 4 Tiers + System Health Checks...");

registerTier0Tests();
registerTier1Tests();
registerTier2Tests();
registerTier3Tests();
registerTier4Tests();

console.log(`Registered ${harness.suites.length} suites with ${harness.suites.reduce((sum, s) => sum + s.tests.length, 0)} total tests.`);

const results = await harness.runAll();

// Exit code based on failures
if (results.failures.length > 0) {
  console.error(`\x1b[31m\x1b[1mExecution completed with ${results.failures.length} failing test(s).\x1b[0m`);
  process.exit(1);
} else {
  console.log(`\x1b[32m\x1b[1mAll ${results.stats.passed} test(s) passed successfully (100% Zero-Defect Pass).\x1b[0m`);
  process.exit(0);
}
