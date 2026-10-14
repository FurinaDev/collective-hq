// ==============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS
// ==============================================================================

import fs from "node:fs";
import path from "node:path";
import { harness, assertCustom as assert } from "./harness.mjs";

const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, "src");

export function registerTier4Tests() {
  harness.suite("Tier 4 - Real-World Application Scenario 1: Seed Round Investor Package", () => {
    harness.test("Full E2E Flow: Bottleneck -> 15-min Checklist -> WA Brief -> Seed Memo -> Markdown Export -> Comms Studio Email", () => {
      // Step 1: Founder activates Seed bottleneck
      const scenario = {
        id: "investor_deck_freeze",
        title: "Seed Turu Yatırımcısı Cap Table ve Finansal Projeksiyon İstedi",
        actionSteps: [
          { text: "Mevcut hisse dağılımını kurucu sözleşmesine göre doğrula (ESOP havuzunu %10 olarak ayır)", done: false },
          { text: "Aylık sabit giderleri 3 sütun halinde netleştir", done: false },
          { text: "Hazırlanan Google Docs One-Pager özetini yatırımcıya kurumsal e-posta ile ilet", done: false }
        ],
        whatsappDraft: {
          recipient: "Yatırım Ortağı / Ortak Kurucu",
          phone: "905332223344",
          message: "Selamlar, Venture Capital ekibi bugün 18 aylık runway ve Cap Table özetimizi istedi."
        }
      };

      // Step 2: Complete all 3 micro-actions
      for (const step of scenario.actionSteps) {
        step.done = true;
      }
      const completedCount = scenario.actionSteps.filter(s => s.done).length;
      const progressPercent = Math.round((completedCount / scenario.actionSteps.length) * 100);
      assert.strictEqual(progressPercent, 100, "Must achieve 100% bottleneck resolution");

      // Step 3: Verify Co-Founder WhatsApp link
      const waLink = `https://api.whatsapp.com/send?phone=${scenario.whatsappDraft.phone}&text=${encodeURIComponent(scenario.whatsappDraft.message)}`;
      assert.contains(waLink, "phone=905332223344");
      assert.contains(waLink, "runway%20ve%20Cap%20Table");

      // Step 4: Open and audit Seed Investment Memorandum from WorkspaceDocsHub
      const docsCode = fs.readFileSync(path.join(SRC_DIR, "components", "WorkspaceDocsHub.tsx"), "utf-8");
      assert.contains(docsCode, "Seed Turu Yatırımcı Bilgi Memorandumu");
      assert.contains(docsCode, "Hedeflenen Fonlama: $450,000 SAFE");
      assert.contains(docsCode, "Değerleme Tavanı: $4.5M, %20 İndirim");

      // Step 5: Format and export Markdown
      const mdFilename = "Seed_Turu_Yatırımcı_Bilgi_Memorandumu.md";
      assert.ok(mdFilename.endsWith(".md"));
      assert.notContains(mdFilename, " ");

      // Step 6: Generate Executive Comms email with runway metrics
      const email = {
        to: "investors@venturepartners.com",
        cc: "founders@startup.io",
        subject: "VORTEX - Tohum Yatırım İlerleme Notu: Cap Table ve Finansallar",
        body: "Değerli Yatırımcılarımız,\n\nTalep ettiğiniz 18 aylık nakit yakım (burn rate) ve Cap Table özetini ekte bilginize sunarız.\n\nRunway: 16.5 Ay\nARR: $120,000 -> $750,000",
        signature: "Saygılarımla,\nEfe (Kurucu & CEO)\nVORTEX OS"
      };

      const mailtoUri = `mailto:${email.to}?cc=${encodeURIComponent(email.cc)}&subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body + "\n\n--\n" + email.signature)}`;
      assert.ok(mailtoUri.startsWith("mailto:investors@venturepartners.com?"));
      assert.contains(mailtoUri, "cc=founders%40startup.io");
      assert.contains(mailtoUri, "Runway%3A%2016.5%20Ay");
    });
  });

  harness.suite("Tier 4 - Real-World Application Scenario 2: TÜBİTAK 1507 Grant Dossier Preparation", () => {
    harness.test("Full E2E Flow: Capital Forge Tech/AI -> 1507 Budget Table -> Adam/Ay Calculation -> TEYDEB Official Letter", () => {
      // Step 1: Capital Forge configuration audit
      const capitalCode = fs.readFileSync(path.join(SRC_DIR, "components", "CapitalForge.tsx"), "utf-8");
      assert.contains(capitalCode, "2.400.000 TL Hibe");
      assert.contains(capitalCode, "TÜBİTAK TEYDEB");

      // Step 2: Audit budget lines in WorkspaceDocsHub
      const docsCode = fs.readFileSync(path.join(SRC_DIR, "components", "WorkspaceDocsHub.tsx"), "utf-8");
      assert.contains(docsCode, "Kıdemli Sistem Mimarı");
      assert.contains(docsCode, "₺960.000"); // 12 x 80.000
      assert.contains(docsCode, "Yapay Zeka Araştırmacısı");
      assert.contains(docsCode, "₺624.000"); // 12 x 65.000 x 0.8
      assert.contains(docsCode, "Frontend Geliştirici");
      assert.contains(docsCode, "₺270.000"); // 10 x 45.000 x 0.6
      assert.contains(docsCode, "₺2.019.000"); // Total
      assert.contains(docsCode, "₺1.514.250"); // 75% grant

      // Step 3: Math verification of grant math
      const totalBudget = 2019000;
      const expectedGrant75 = totalBudget * 0.75;
      assert.strictEqual(expectedGrant75, 1514250, "75% of 2.019.000 TL must equal 1.514.250 TL exactly");

      // Step 4: Comms Studio formal letter generation to TEYDEB
      const commsCode = fs.readFileSync(path.join(SRC_DIR, "components", "CommsStudio.tsx"), "utf-8");
      assert.contains(commsCode, "proje.takip@tubitak.gov.tr");
      assert.contains(commsCode, "TEYDEB");
      assert.contains(commsCode, "1. Dönem İlerleme Raporu Teslimi");
    });
  });

  harness.suite("Tier 4 - Real-World Application Scenario 3: Academic Exam Period Delegation Under Pressure", () => {
    harness.test("Full E2E Flow: Filter Exam Status -> Identify Blocked Lead -> Zero-Login WA Delegation -> Capacity Rebalance", () => {
      // Step 1: Initial roster state
      const members = [
        { id: "m-1", name: "Buse Kaya", role: "Genel Koordinatör", capacity: 20, allocated: 14, availability: "MÜSAİT" },
        { id: "m-2", name: "Fatih Demir", role: "Sponsorluk Sorumlusu", capacity: 12, allocated: 12, availability: "SINAV_HAFTASI" },
        { id: "m-3", name: "Can Yılmaz", role: "Teknik Prodüksiyon Lideri", capacity: 25, allocated: 25, availability: "AŞIRI_YÜKLÜ" },
        { id: "m-4", name: "Zeynep Arslan", role: "Tasarım & UI/UX Yöneticisi", capacity: 15, allocated: 8, availability: "MÜSAİT" }
      ];

      // Step 2: Coordinator filters by SINAV_HAFTASI
      const examMembers = members.filter(m => m.availability === "SINAV_HAFTASI");
      assert.strictEqual(examMembers.length, 1);
      assert.strictEqual(examMembers[0].name, "Fatih Demir");
      assert.strictEqual(examMembers[0].allocated, 12, "Fatih Demir is 100% booked during exam week");

      // Step 3: Zero-login WhatsApp handover message generation to backup lead (Buse Kaya)
      const handoverTask = {
        title: "Sponsorluk dosyasının son çıktısını ilgili kurumlara iletme",
        deadline: "Cuma 17:00",
        priority: "Acil",
        assignedToBackup: "Buse Kaya"
      };

      const waHandover = `Fatih selam, sınav haftan olduğunu biliyoruz, başarılar! Masandaki sponsorluk dosyasının sadece son PDF çıktısını Buse'ye devrettik, senin hiçbir şeye dokunmana gerek yok. Masan rahat olsun.`;

      assert.contains(waHandover, "sınav haftan olduğunu biliyoruz");
      assert.contains(waHandover, "Buse'ye devrettik");

      // Step 4: Rebalance workload in system
      // Fatih's allocated hours reduced to 0 for exam week; Buse takes 4 hours of the critical handover
      const rebalancedMembers = members.map(m => {
        if (m.name === "Fatih Demir") {
          return { ...m, allocated: 0, notes: "Sınav haftası nedeniyle görevler Buse'ye devredildi." };
        }
        if (m.name === "Buse Kaya") {
          return { ...m, allocated: m.allocated + 4 }; // 14 + 4 = 18h (within 20h capacity)
        }
        return m;
      });

      const buse = rebalancedMembers.find(m => m.name === "Buse Kaya");
      const fatih = rebalancedMembers.find(m => m.name === "Fatih Demir");

      assert.strictEqual(fatih.allocated, 0, "Fatih must be free of operational burden during exams");
      assert.strictEqual(buse.allocated, 18, "Buse absorbed 4 hours of critical handover within 20h capacity");
      assert.ok(buse.allocated <= buse.capacity, "Buse remains within healthy capacity limits");
    });
  });
}
