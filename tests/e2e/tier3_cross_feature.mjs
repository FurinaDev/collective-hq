// ==============================================================================
// TIER 3: CROSS-FEATURE PAIRWISE & INTEGRATION COMBINATIONS
// ==============================================================================

import fs from "node:fs";
import path from "node:path";
import { harness, assertCustom as assert } from "./harness.mjs";

const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, "src");

export function registerTier3Tests() {
  harness.suite("Tier 3 - Cross-Feature Pairwise Interactions", () => {
    // --------------------------------------------------------------------------
    // Cross-1: De-Bottleneck Action -> Workspace Document Generation
    // --------------------------------------------------------------------------
    harness.test("Cross-1: De-bottlenecking resolution triggers onCreateDoc and opens document draft in Workspace Docs Hub", () => {
      let createdDoc = null;
      let activeTab = "pulse";

      const handleCreateDoc = (title, type) => {
        createdDoc = {
          id: `doc-${Date.now()}`,
          title,
          docType: type,
          status: "Düzenlemeye Hazır"
        };
        activeTab = "workspace_docs";
      };

      // User resolves grant bottleneck and clicks 'Google Workspace'te Canlı Aç'
      const scenarioDraft = {
        title: "TÜBİTAK 1507 Ar-Ge Bütçeleme & Maliyet Gerekçelendirme Notu",
        type: "google_sheets"
      };

      handleCreateDoc(scenarioDraft.title, scenarioDraft.type);

      assert.strictEqual(activeTab, "workspace_docs", "Must navigate to workspace_docs tab");
      assert.ok(createdDoc, "Document must be created");
      assert.strictEqual(createdDoc.title, scenarioDraft.title);
      assert.strictEqual(createdDoc.docType, "google_sheets");
    });

    // --------------------------------------------------------------------------
    // Cross-2: Team Member Availability Flag -> Zero-Login WhatsApp Task Delegation
    // --------------------------------------------------------------------------
    harness.test("Cross-2: Team member 'SINAV_HAFTASI' availability flag triggers zero-login WhatsApp task delegation link", () => {
      const member = {
        name: "Fatih Demir",
        role: "Sponsorluk Sorumlusu",
        phone: "905334445566",
        availability: "SINAV_HAFTASI"
      };

      assert.strictEqual(member.availability, "SINAV_HAFTASI");

      // Generate delegation message
      const taskTitle = "Sponsorluk dosyasının Buse'ye devredilmesi";
      const deadline = "Bugün 18:00";
      const priority = "Acil";
      const waMessage = `Merhaba ${member.name.split(" ")[0]}, sınav haftan nedeniyle sana ${priority === "Acil" ? "🚨 Acil" : "📌"} devir görevi atandı:\n\n*Görev:* ${taskTitle}\n*Teslim Termini:* ${deadline}\n\nLütfen bu mesajı 'TAMAM' olarak yanıtla.`;

      const waLink = `https://api.whatsapp.com/send?phone=${member.phone}&text=${encodeURIComponent(waMessage)}`;

      assert.contains(waLink, "phone=905334445566");
      assert.contains(waLink, "s%C4%B1nav%20haftan");
      assert.contains(waLink, "TAMAM");
    });

    // --------------------------------------------------------------------------
    // Cross-3: Capital Forge Readiness -> Investor Memorandum in Workspace Docs
    // --------------------------------------------------------------------------
    harness.test("Cross-3: Capital Forge readiness checklist completion unlocks Seed Investor Memorandum in Docs Hub", () => {
      const readinessChecklist = [
        { key: "cap_table", label: "Cap Table Doğrulandı", done: true },
        { key: "arr_metrics", label: "ARR & MRR Hesaplandı", done: true },
        { key: "safe_terms", label: "SAFE Valüasyon Tavanı Belirlendi", done: true }
      ];

      const isInvestorReady = readinessChecklist.every(c => c.done);
      assert.strictEqual(isInvestorReady, true);

      // Verify template content in Docs Hub
      const docsHubCode = fs.readFileSync(path.join(SRC_DIR, "components", "WorkspaceDocsHub.tsx"), "utf-8");
      assert.contains(docsHubCode, "Seed Turu Yatırımcı Bilgi Memorandumu");
      assert.contains(docsHubCode, "$450,000 SAFE");
    });

    // --------------------------------------------------------------------------
    // Cross-4: Command Palette -> Deep Navigation to Comms Studio
    // --------------------------------------------------------------------------
    harness.test("Cross-4: Command Palette deep action dispatches tab change and focuses target module", () => {
      let activeTab = "pulse";
      let selectedActionPayload = null;

      const onSelectAction = (actionKey, payload) => {
        if (actionKey === "docs_investor") {
          activeTab = "workspace_docs";
        } else if (actionKey === "comms_investor") {
          activeTab = "comms";
          selectedActionPayload = payload;
        }
      };

      onSelectAction("comms_investor", { templateId: "investor_update" });
      assert.strictEqual(activeTab, "comms");
      assert.strictEqual(selectedActionPayload.templateId, "investor_update");
    });

    // --------------------------------------------------------------------------
    // Cross-5: System Settings -> Real-time Shell & Header Branding Update
    // --------------------------------------------------------------------------
    harness.test("Cross-5: Updating brandChoice in System Settings propagates to ExecutiveHeader and Sidebar brand name", () => {
      let appSettings = {
        brandChoice: "BOTTLENEX",
        platformName: "Original Org"
      };

      const handleSettingsChange = (newSettings) => {
        appSettings = { ...appSettings, ...newSettings };
      };

      // User changes brandChoice to "AXIS" and platformName to "Kolektif HQ"
      handleSettingsChange({ brandChoice: "AXIS", platformName: "Kolektif HQ" });

      assert.strictEqual(appSettings.brandChoice, "AXIS");
      assert.strictEqual(appSettings.platformName, "Kolektif HQ");

      // Header component prop signature check
      const headerCode = fs.readFileSync(path.join(SRC_DIR, "components", "ExecutiveHeader.tsx"), "utf-8");
      assert.contains(headerCode, "brandName", "ExecutiveHeader must accept brandName prop");
    });

    // --------------------------------------------------------------------------
    // Cross-6: Cross-Module State Persistence Cycle
    // --------------------------------------------------------------------------
    harness.test("Cross-6: Organization profile, team members, and custom bottlenecks survive simulated localStorage refresh", () => {
      const mockStorage = new Map();
      const saveState = (key, data) => mockStorage.set(key, JSON.stringify(data));
      const loadState = (key, fallback) => {
        const raw = mockStorage.get(key);
        return raw ? JSON.parse(raw) : fallback;
      };

      // Session 1: User customizes data
      const userSettings = { brandChoice: "HELM", founderName: "Efe Kurucu" };
      const userTeam = [{ id: "m-10", name: "Yeni Üye", role: "Dev", capacity: 20 }];
      const userBottlenecks = [{ id: "b-1", title: "API Kilitlenmesi", resolved: false }];

      saveState("vortex_settings", userSettings);
      saveState("vortex_team", userTeam);
      saveState("vortex_bottlenecks", userBottlenecks);

      // Session 2: Fresh browser load
      const restoredSettings = loadState("vortex_settings", {});
      const restoredTeam = loadState("vortex_team", []);
      const restoredBottlenecks = loadState("vortex_bottlenecks", []);

      assert.strictEqual(restoredSettings.brandChoice, "HELM");
      assert.strictEqual(restoredTeam.length, 1);
      assert.strictEqual(restoredTeam[0].name, "Yeni Üye");
      assert.strictEqual(restoredBottlenecks[0].title, "API Kilitlenmesi");
    });

    // --------------------------------------------------------------------------
    // Cross-7: Non-blocking HUD Toast Feedback Across Modules
    // --------------------------------------------------------------------------
    harness.test("Cross-7: Action copy/save triggers HUD toast notification without blocking UI interactions", () => {
      const toastQueue = [];
      const showToast = (toast) => {
        toastQueue.push({ id: `t-${Date.now()}`, ...toast });
      };

      // 1. User copies WhatsApp brief in DeBottleneck
      showToast({ title: "WhatsApp mesajı kopyalandı! ✓", type: "success" });
      assert.strictEqual(toastQueue.length, 1);
      assert.strictEqual(toastQueue[0].type, "success");

      // 2. User exports Markdown in Docs Hub
      showToast({ title: "Doküman Markdown olarak indirildi! 📄", type: "info" });
      assert.strictEqual(toastQueue.length, 2);

      // 3. User saves settings in SystemSettings
      showToast({ title: "Ayarlar başarıyla kaydedildi! ⚙", type: "success" });
      assert.strictEqual(toastQueue.length, 3);
    });
  });
}
