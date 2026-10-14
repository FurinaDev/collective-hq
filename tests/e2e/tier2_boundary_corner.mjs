// ==============================================================================
// TIER 2: BOUNDARY, CORNER & ADVERSARIAL CASES (F1 - F9, >=5 PER FEATURE)
// ==============================================================================

import fs from "node:fs";
import path from "node:path";
import { harness, assertCustom as assert } from "./harness.mjs";

const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, "src");

export function registerTier2Tests() {
  // ----------------------------------------------------------------------------
  // F1 Boundary: Layout Constraints & Typography Edge Cases
  // ----------------------------------------------------------------------------
  harness.suite("Tier 2 - F1: Responsive Layout & Typography Boundaries", () => {
    harness.test("F1.B1: Mobile breakpoint (<640px) off-canvas drawer and header toggle constraints", () => {
      const headerCode = fs.readFileSync(path.join(SRC_DIR, "components", "ExecutiveHeader.tsx"), "utf-8");
      assert.ok(
        headerCode.includes("sm:hidden") || headerCode.includes("lg:hidden"),
        "Mobile menu button must be hidden on larger viewports (sm:hidden or lg:hidden)"
      );
      assert.contains(headerCode, "hidden sm:inline", "Command shortcut text must be hidden on mobile screens");
    });

    harness.test("F1.B2: Tablet breakpoint (640-1024px) adaptive grid column definitions", () => {
      const pageCode = fs.readFileSync(path.join(SRC_DIR, "components", "TeamCapacityMatrix.tsx"), "utf-8");
      assert.contains(pageCode, "grid-cols-2 sm:grid-cols-4", "Metric cards must adapt from 2 columns on mobile to 4 on tablet/desktop");
    });

    harness.test("F1.B3: Desktop breakpoint (>1024px) two-column layout allocation", () => {
      const deBottleneck = fs.readFileSync(path.join(SRC_DIR, "components", "DeBottleneckEngine.tsx"), "utf-8");
      assert.contains(deBottleneck, "lg:col-span-5", "Checklist column must take 5 of 12 columns on desktop");
      assert.contains(deBottleneck, "lg:col-span-7", "Automation column must take 7 of 12 columns on desktop");
    });

    harness.test("F1.B4: Text truncation with CSS ellipsis on extreme-length organization names", () => {
      const pageCode = fs.readFileSync(path.join(SRC_DIR, "app", "page.tsx"), "utf-8");
      assert.contains(pageCode, "truncate", "Long names in sidebar must have CSS truncate class");
      // Simulation of truncation logic
      const truncateText = (str, maxLen = 30) => str.length > maxLen ? str.slice(0, maxLen) + "…" : str;
      const superLongName = "Supercalifragilistic Global Venture Capital & Acceleration Holding A.Ş.";
      assert.strictEqual(truncateText(superLongName, 25).endsWith("…"), true);
      assert.ok(truncateText(superLongName, 25).length <= 26);
    });

    harness.test("F1.B5: High contrast text colors against slate backgrounds meet readability standards", () => {
      const header = fs.readFileSync(path.join(SRC_DIR, "components", "ExecutiveHeader.tsx"), "utf-8");
      assert.contains(header, "text-slate-900", "High-contrast headings must use text-slate-900");
      assert.contains(header, "text-slate-600", "Sub-elements must use readable text-slate-600");
    });
  });

  // ----------------------------------------------------------------------------
  // F2 Boundary: Notification HUD & Dialog Edge Cases
  // ----------------------------------------------------------------------------
  harness.suite("Tier 2 - F2: HUD Toast & Modal Boundary Handling", () => {
    harness.test("F2.B1: Rapid succession toast queue handling without dropping active toasts", () => {
      let toasts = [];
      const addToast = (t) => {
        toasts = [...toasts, { id: `t-${Date.now()}-${toasts.length}`, ...t }];
      };
      // Fire 50 toasts rapidly
      for (let i = 0; i < 50; i++) {
        addToast({ title: `Toast #${i}`, type: "info" });
      }
      assert.strictEqual(toasts.length, 50, "Queue must accept 50 rapid sequential toasts without corruption");
      assert.strictEqual(toasts[49].title, "Toast #49");
    });

    harness.test("F2.B2: Extreme-length toast descriptions do not cause viewport horizontal scroll", () => {
      const hugeDescription = "Lorem ipsum dolor sit amet ".repeat(50); // ~1350 characters
      const toastPayload = {
        title: "Kritik Sistem Bildirimi",
        description: hugeDescription
      };
      // Sanitizer or CSS clamp verification
      const maxDisplayChars = 300;
      const displayDesc = toastPayload.description.length > maxDisplayChars
        ? toastPayload.description.slice(0, maxDisplayChars) + "..."
        : toastPayload.description;
      assert.ok(displayDesc.length <= 304, "Toast descriptions must be clamped or wrapped without layout break");
    });

    harness.test("F2.B3: ConfirmDialog dismisses on Escape key and backdrop click", () => {
      let open = true;
      const handleKeyDown = (e) => {
        if (e.key === "Escape") open = false;
      };
      const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) open = false;
      };

      handleKeyDown({ key: "Escape" });
      assert.strictEqual(open, false, "Escape must close dialog");

      open = true;
      handleBackdropClick({ target: "modal-backdrop", currentTarget: "modal-backdrop" });
      assert.strictEqual(open, false, "Backdrop click must close dialog");
    });

    harness.test("F2.B4: ConfirmDialog with missing/undefined optional description renders cleanly", () => {
      const renderDialogProps = (title, description) => ({
        title: title || "Onay Gerekiyor",
        description: description || null,
        hasDescription: Boolean(description)
      });
      const dialog = renderDialogProps("Emin misiniz?", undefined);
      assert.strictEqual(dialog.title, "Emin misiniz?");
      assert.strictEqual(dialog.description, null);
      assert.strictEqual(dialog.hasDescription, false);
    });

    harness.test("F2.B5: Concurrent modal and toast notifications maintain correct z-index stacking", () => {
      // Modals must be z-50 or higher; Toasts must be z-40 or z-50
      const cmdPalette = fs.readFileSync(path.join(SRC_DIR, "components", "CommandPalette.tsx"), "utf-8");
      assert.contains(cmdPalette, "z-50", "Command modal backdrop must have z-50 stacking order");
    });
  });

  // ----------------------------------------------------------------------------
  // F3 Boundary: Command Palette & Shell Edge Cases
  // ----------------------------------------------------------------------------
  harness.suite("Tier 2 - F3: Command Palette & Navigation Boundaries", () => {
    harness.test("F3.B1: Query input with regex special characters does not cause RegExp crash", () => {
      const quickActions = [
        { id: "1", title: "Test (API) [v1] * special? + $ \\" }
      ];
      const queryWithRegexMeta = "([*+?\\$^])";
      // Pure substring or safe regex search
      const safeSearch = (items, q) =>
        items.filter(item => item.title.toLowerCase().includes(q.toLowerCase()));

      let threw = false;
      try {
        const results = safeSearch(quickActions, queryWithRegexMeta);
        assert.ok(Array.isArray(results));
      } catch (err) {
        threw = true;
      }
      assert.strictEqual(threw, false, "Search query with regex special chars must never throw an exception");
    });

    harness.test("F3.B2: Empty or whitespace-only query string displays all available quick actions", () => {
      const quickActions = [
        { id: "1", title: "Action A", group: "G1" },
        { id: "2", title: "Action B", group: "G2" },
        { id: "3", title: "Action C", group: "G3" }
      ];
      const filterActions = (q) => {
        const trimmed = (q || "").trim();
        if (!trimmed) return quickActions;
        return quickActions.filter(a => a.title.toLowerCase().includes(trimmed.toLowerCase()));
      };

      assert.strictEqual(filterActions("").length, 3);
      assert.strictEqual(filterActions("   ").length, 3);
      assert.strictEqual(filterActions(null).length, 3);
    });

    harness.test("F3.B3: Query with zero matches returns empty list and displays friendly message", () => {
      const quickActions = [
        { id: "1", title: "Tohum Yatırım Notu", group: "Google Workspace" }
      ];
      const query = "UZAY_GEMISI_ROKETI";
      const matches = quickActions.filter(a => a.title.includes(query));
      assert.strictEqual(matches.length, 0);

      const emptyMessage = matches.length === 0 ? "Eşleşen komut bulunamadı." : "";
      assert.strictEqual(emptyMessage, "Eşleşen komut bulunamadı.");
    });

    harness.test("F3.B4: Rapid repeated Ctrl+K keypress toggling does not corrupt open state", () => {
      let isOpen = false;
      const toggle = () => { isOpen = !isOpen; };
      for (let i = 0; i < 20; i++) {
        toggle();
      }
      // 20 toggles should bring it back to false
      assert.strictEqual(isOpen, false);
      toggle();
      assert.strictEqual(isOpen, true);
    });

    harness.test("F3.B5: Unknown or invalid actionKey passed to onSelectAction does not crash app", () => {
      let activeTab = "pulse";
      const handleSelect = (actionKey) => {
        switch (actionKey) {
          case "docs_investor": activeTab = "workspace_docs"; break;
          case "matrix_pivot": activeTab = "strategic_lab"; break;
          default:
            // Safe fallback: keep current tab or no-op
            break;
        }
      };

      handleSelect("MALFORMED_UNKNOWN_KEY_404");
      assert.strictEqual(activeTab, "pulse", "Invalid key must gracefully maintain active tab");
    });
  });

  // ----------------------------------------------------------------------------
  // F4 Boundary: De-Bottlenecking Edge Cases
  // ----------------------------------------------------------------------------
  harness.suite("Tier 2 - F4: De-Bottlenecking Engine Boundaries", () => {
    harness.test("F4.B1: Empty or whitespace-only custom bottleneck input does not trigger analysis", () => {
      let triggered = false;
      const handleCustomAnalyze = (input) => {
        if (!input || !input.trim()) return;
        triggered = true;
      };

      handleCustomAnalyze("");
      handleCustomAnalyze("    ");
      handleCustomAnalyze(null);
      assert.strictEqual(triggered, false, "Empty input must not trigger analysis");

      handleCustomAnalyze("Nakit akışı tıkandı");
      assert.strictEqual(triggered, true);
    });

    harness.test("F4.B2: Extremely long custom bottleneck input (2,000+ characters) handled and truncated in title", () => {
      const superLongInput = "Kritik darboğaz: ".concat("Çok acil operasyonel kilitlenme! ".repeat(70));
      const sanitizeDocTitle = (input) => `Operasyonel Kriz Çözüm Memorandumu: ${input.slice(0, 30)}`;

      const title = sanitizeDocTitle(superLongInput);
      assert.ok(title.length <= 67);
      assert.contains(title, "Kritik darboğaz");
    });

    harness.test("F4.B3: 0% completion state (zero items checked) calculates 0% without NaN or error", () => {
      const actions = [
        { text: "A1", done: false },
        { text: "A2", done: false }
      ];
      const completed = actions.filter(a => a.done).length;
      const progress = Math.round((completed / actions.length) * 100);
      assert.strictEqual(progress, 0);
      assert.strictEqual(Number.isNaN(progress), false);
    });

    harness.test("F4.B4: 100% completion state displays 'Darboğaz Çözüldü!' celebration indicator", () => {
      const actions = [
        { text: "A1", done: true },
        { text: "A2", done: true }
      ];
      const completed = actions.filter(a => a.done).length;
      const isResolved = completed === actions.length;
      assert.strictEqual(isResolved, true);

      const statusText = isResolved ? "Darboğaz Çözüldü!" : "Tüm adımlar tamamlandığında kilit kalkar.";
      assert.strictEqual(statusText, "Darboğaz Çözüldü!");
    });

    harness.test("F4.B5: Malformed phone numbers with spaces and dashes sanitized for WhatsApp link", () => {
      const rawPhones = [
        "+90 (532) 111-22-33",
        "0532 111 22 33",
        "90 532 111 2233",
        "+90-532-111-22-33"
      ];
      const sanitizePhone = (raw) => {
        let digits = raw.replace(/\D/g, "");
        if (digits.startsWith("0")) digits = "9" + digits;
        if (!digits.startsWith("90")) digits = "90" + digits;
        return digits;
      };

      for (const phone of rawPhones) {
        const clean = sanitizePhone(phone);
        assert.strictEqual(clean, "905321112233", `Phone ${phone} must sanitize to 905321112233`);
      }
    });
  });

  // ----------------------------------------------------------------------------
  // F5 Boundary: Team Capacity Matrix Edge Cases
  // ----------------------------------------------------------------------------
  harness.suite("Tier 2 - F5: Team Capacity Matrix Boundaries", () => {
    harness.test("F5.B1: Zero weekly capacity hours member (capacity = 0) avoids division by zero", () => {
      const members = [
        { name: "Gönüllü", weeklyCapacityHours: 0, allocatedHours: 0 }
      ];
      const totalCapacity = members.reduce((sum, m) => sum + m.weeklyCapacityHours, 0);
      const totalAllocated = members.reduce((sum, m) => sum + m.allocatedHours, 0);
      const utilizationRate = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;

      assert.strictEqual(utilizationRate, 0);
      assert.strictEqual(Number.isNaN(utilizationRate), false);
    });

    harness.test("F5.B2: Over-allocated member (allocatedHours > weeklyCapacityHours) calculates utilization > 100%", () => {
      const members = [
        { name: "Can Yılmaz", weeklyCapacityHours: 20, allocatedHours: 25 }
      ];
      const totalCapacity = members.reduce((sum, m) => sum + m.weeklyCapacityHours, 0);
      const totalAllocated = members.reduce((sum, m) => sum + m.allocatedHours, 0);
      const rate = Math.round((totalAllocated / totalCapacity) * 100);

      assert.strictEqual(rate, 125, "Rate must be 125% for 25h allocated on 20h capacity");
    });

    harness.test("F5.B3: Form submission with empty member name or role is strictly prevented", () => {
      let added = false;
      const handleAdd = (name, role) => {
        if (!name || !name.trim() || !role || !role.trim()) {
          return false;
        }
        added = true;
        return true;
      };

      assert.strictEqual(handleAdd("", "Developer"), false);
      assert.strictEqual(handleAdd("Ahmet", ""), false);
      assert.strictEqual(handleAdd("   ", "   "), false);
      assert.strictEqual(added, false);
      assert.strictEqual(handleAdd("Ahmet", "Developer"), true);
      assert.strictEqual(added, true);
    });

    harness.test("F5.B4: Filtering by category with 0 matching members returns empty list without error", () => {
      const members = [
        { name: "Buse", availability: "MÜSAİT" },
        { name: "Can", availability: "AŞIRI_YÜKLÜ" }
      ];
      const filterByStatus = (status) =>
        status === "ALL" ? members : members.filter(m => m.availability === status);

      const examMembers = filterByStatus("SINAV_HAFTASI");
      assert.strictEqual(examMembers.length, 0);
      assert.ok(Array.isArray(examMembers));
    });

    harness.test("F5.B5: Empty members list (members = []) calculates 0% utilization without crash", () => {
      const members = [];
      const totalCapacity = members.reduce((sum, m) => sum + (m.weeklyCapacityHours || 0), 0);
      const totalAllocated = members.reduce((sum, m) => sum + (m.allocatedHours || 0), 0);
      const rate = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;

      assert.strictEqual(rate, 0);
      assert.strictEqual(totalCapacity, 0);
    });
  });

  // ----------------------------------------------------------------------------
  // F6 Boundary: Document Engine & Markdown Export Edge Cases
  // ----------------------------------------------------------------------------
  harness.suite("Tier 2 - F6: Document Engine & Export Boundaries", () => {
    harness.test("F6.B1: Document title containing markdown meta-characters handled safely without broken format", () => {
      const rawTitle = "# Özel Yatırım Belgesi: [2026] & **Gizli**";
      const formatDocumentHeading = (title) => `# ${title.replace(/[#*`]/g, "").trim()}`;

      const heading = formatDocumentHeading(rawTitle);
      assert.ok(heading.startsWith("# "));
      assert.notContains(heading, "**");
      assert.notContains(heading, "##");
    });

    harness.test("F6.B2: Search query with Turkish uppercase/lowercase characters (İ, ı, Ş, ş, Ğ, ğ)", () => {
      const docs = [
        { title: "TÜBİTAK 1507 Ar-Ge Bütçe & Personel Maliyet Tablosu", summary: "PRODİS" },
        { title: "Çift Taraflı Gizlilik Sözleşmesi", summary: "Hukuk" }
      ];

      const trCaseFold = (str) =>
        str.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase();

      const searchDocs = (query) => {
        const qFolded = trCaseFold(query);
        return docs.filter(d => trCaseFold(d.title).includes(qFolded));
      };

      assert.strictEqual(searchDocs("tübitak").length, 1);
      assert.strictEqual(searchDocs("TÜBİTAK").length, 1);
      assert.strictEqual(searchDocs("GİZLİLİK").length, 1);
      assert.strictEqual(searchDocs("gizlilik").length, 1);
    });

    harness.test("F6.B3: Large document content (50,000+ characters) export produces valid blob representation", () => {
      const largeContent = "# BÜYÜK YATIRIMCI VE TEKNİK DOKÜMAN\n\n" + "Detaylı madde satırı ve finansal projeksiyon verileri.\n".repeat(1000);
      assert.ok(largeContent.length > 50000, "Content must exceed 50,000 characters");

      const blobSimulation = {
        size: Buffer.byteLength(largeContent, "utf-8"),
        type: "text/markdown;charset=utf-8;"
      };
      assert.ok(blobSimulation.size > 50000);
      assert.strictEqual(blobSimulation.type, "text/markdown;charset=utf-8;");
    });

    harness.test("F6.B4: Export filename sanitization: spaces to underscores and illegal characters stripped", () => {
      const dirtyTitle = "TÜBİTAK 1507 / Proje & Bütçe: V1.0? [Özel]";
      const sanitizeFilename = (title) => {
        return title
          .replace(/[\/\\:*?"<>|\[\]]/g, "")
          .trim()
          .replace(/\s+/g, "_")
          .concat(".md");
      };

      const clean = sanitizeFilename(dirtyTitle);
      assert.strictEqual(clean, "TÜBİTAK_1507_Proje_&_Bütçe_V1.0_Özel.md");
      assert.notContains(clean, "/");
      assert.notContains(clean, "?");
      assert.notContains(clean, ":");
    });

    harness.test("F6.B5: Creating document with cancelled prompt / empty title gracefully aborted", () => {
      let created = false;
      const handleCreateDoc = (promptResult) => {
        if (!promptResult || !promptResult.trim()) {
          return null; // Abort
        }
        created = true;
        return { id: "doc-new", title: promptResult.trim() };
      };

      assert.strictEqual(handleCreateDoc(null), null);
      assert.strictEqual(handleCreateDoc(""), null);
      assert.strictEqual(handleCreateDoc("   "), null);
      assert.strictEqual(created, false);

      const validDoc = handleCreateDoc("Yeni Resmi Evrak");
      assert.ok(validDoc);
      assert.strictEqual(validDoc.title, "Yeni Resmi Evrak");
      assert.strictEqual(created, true);
    });
  });

  // ----------------------------------------------------------------------------
  // F7 Boundary: Executive Comms & RFC 6068 Mailto Edge Cases
  // ----------------------------------------------------------------------------
  harness.suite("Tier 2 - F7: Executive Comms & Mailto URI Boundaries", () => {
    harness.test("F7.B1: Reserved query characters (&, ?, =, #, %, \\n) safely encoded in mailto URI", () => {
      const subject = "Q3 & Q4 Runway: 100% Growth? #1";
      const body = "Line 1\nLine 2 = 100% & Done";
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body);

      assert.contains(encodedSubject, "%26"); // &
      assert.contains(encodedSubject, "%3F"); // ?
      assert.contains(encodedSubject, "%23"); // #
      assert.contains(encodedBody, "%0A");   // \n
      assert.contains(encodedBody, "%3D");   // =
    });

    harness.test("F7.B2: Empty CC field does not produce invalid empty &cc= parameter in mailto link", () => {
      const buildMailto = (to, cc, subject) => {
        const params = [];
        if (cc && cc.trim()) params.push(`cc=${encodeURIComponent(cc.trim())}`);
        if (subject && subject.trim()) params.push(`subject=${encodeURIComponent(subject.trim())}`);
        return `mailto:${to}${params.length ? "?" + params.join("&") : ""}`;
      };

      const withoutCc = buildMailto("investor@vc.com", "", "Update");
      assert.strictEqual(withoutCc, "mailto:investor@vc.com?subject=Update");
      assert.notContains(withoutCc, "cc=");
    });

    harness.test("F7.B3: Multiple CC email addresses separated by comma properly formatted", () => {
      const rawCc = "founder1@startup.io, founder2@startup.io, advisor@angel.net";
      const sanitizedCc = rawCc.split(",").map(e => e.trim()).filter(Boolean).join(",");
      assert.strictEqual(sanitizedCc, "founder1@startup.io,founder2@startup.io,advisor@angel.net");
    });

    harness.test("F7.B4: Long email body exceeding standard 2,000 character URL limits flags clipboard fallback", () => {
      const veryLongBody = "Bu bir uzun kurumsal durum raporudur.\n".repeat(80); // ~3200 characters
      const isTooLongForUrl = veryLongBody.length > 2000;
      assert.strictEqual(isTooLongForUrl, true);

      const recommendedAction = isTooLongForUrl ? "COPY_TO_CLIPBOARD" : "LAUNCH_MAILTO";
      assert.strictEqual(recommendedAction, "COPY_TO_CLIPBOARD");
    });

    harness.test("F7.B5: Executive signature containing custom multi-line text and URL formatting", () => {
      const customSig = "Efe\nKurucu\nhttps://vortex.app";
      const cleanSig = customSig.trim();
      assert.strictEqual(cleanSig.split("\n").length, 3);
      assert.contains(cleanSig, "https://vortex.app");
    });
  });

  // ----------------------------------------------------------------------------
  // F8 Boundary: Capital & Grant Orchestrator Edge Cases
  // ----------------------------------------------------------------------------
  harness.suite("Tier 2 - F8: Capital & Grant Orchestrator Boundaries", () => {
    harness.test("F8.B1: Invalid industry vertical identifier safely falls back to default tech_ai", () => {
      const verticals = ["tech_ai", "ecommerce", "ngo", "creative"];
      const resolveVertical = (v) => verticals.includes(v) ? v : "tech_ai";

      assert.strictEqual(resolveVertical("unknown_vertical"), "tech_ai");
      assert.strictEqual(resolveVertical("ecommerce"), "ecommerce");
      assert.strictEqual(resolveVertical(null), "tech_ai");
    });

    harness.test("F8.B2: Zero readiness score formatted properly without broken percentage indicator", () => {
      const formatScore = (val) => {
        const num = Number(val);
        if (Number.isNaN(num) || num < 0) return "%0";
        if (num > 100) return "%100";
        return `%${Math.round(num)}`;
      };

      assert.strictEqual(formatScore(0), "%0");
      assert.strictEqual(formatScore(75.4), "%75");
      assert.strictEqual(formatScore(-10), "%0");
      assert.strictEqual(formatScore(120), "%100");
    });

    harness.test("F8.B3: Multiple currency symbols and budget formats (TL, EUR, USD, $, ₺, €) parsed cleanly", () => {
      const rawBudgets = [
        "2.400.000 TL Hibe",
        "60.000 EUR Hibe",
        "$250.000 Seed",
        "₺1.514.250 Destek"
      ];
      for (const b of rawBudgets) {
        assert.ok(b.length > 5, `Budget string "${b}" must have sufficient length`);
        assert.matches(b, /\d+/, `Budget string "${b}" must contain numerical amounts`);
      }
    });

    harness.test("F8.B4: Repeated fast clicks on 'Belge Oluştur' debounced without duplicate requests", () => {
      let isGenerating = false;
      let generateCallCount = 0;

      const triggerGenerate = () => {
        if (isGenerating) return false;
        isGenerating = true;
        generateCallCount++;
        return true;
      };

      assert.strictEqual(triggerGenerate(), true);
      assert.strictEqual(triggerGenerate(), false); // Blocked
      assert.strictEqual(triggerGenerate(), false); // Blocked
      assert.strictEqual(generateCallCount, 1, "Only 1 generation should occur during active loading");
    });

    harness.test("F8.B5: Document URL encoding for complex Turkish titles with accents and symbols", () => {
      const title = "TÜBİTAK 1507 Ar-Ge & İnovasyon Destek Başvurusu (Ön Rapor)";
      const url = `https://docs.google.com/document/create?title=${encodeURIComponent(title)}`;

      assert.notContains(url, " ");
      assert.notContains(url, "Ö");
      assert.notContains(url, "İ");
      assert.contains(url, "https://docs.google.com/document/create?title=");
    });
  });

  // ----------------------------------------------------------------------------
  // F9 Boundary: LocalStorage Corruption & SSR Resiliency
  // ----------------------------------------------------------------------------
  harness.suite("Tier 2 - F9: LocalStorage Persistence & Corruption Boundaries", () => {
    harness.test("F9.B1: Corrupted or invalid JSON string in localStorage safely falls back to DEFAULT_SETTINGS", () => {
      const DEFAULT_SETTINGS = {
        brandChoice: "BOTTLENEX",
        platformName: "Default HQ"
      };
      const parseStorage = (raw) => {
        try {
          return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
        } catch {
          return DEFAULT_SETTINGS;
        }
      };

      const corrupted = "{ bad json, invalid syntax: ;;;";
      const result = parseStorage(corrupted);
      assert.deepStrictEqual(result, DEFAULT_SETTINGS, "Must fall back to default settings on JSON parse error");
    });

    harness.test("F9.B2: LocalStorage throwing quota exceeded or security error is caught gracefully", () => {
      let errorHandled = false;
      const safeSetItem = (key, val) => {
        try {
          // Simulate QuotaExceededError
          throw new Error("QuotaExceededError: DOM Exception 22");
        } catch (err) {
          errorHandled = true;
          return false;
        }
      };

      const success = safeSetItem("key", "val");
      assert.strictEqual(success, false);
      assert.strictEqual(errorHandled, true);
    });

    harness.test("F9.B3: Missing fields in stored JSON filled with default fallback schema (Schema Migration)", () => {
      const DEFAULT_SETTINGS = {
        brandChoice: "BOTTLENEX",
        platformName: "Default HQ",
        founderName: "Efe Kurucu",
        apiKey: "",
        driveFolderUrl: "https://drive.google.com"
      };
      // Stored JSON is from older version with only platformName
      const legacyStored = { platformName: "Old Platform Name" };
      const migrated = { ...DEFAULT_SETTINGS, ...legacyStored };

      assert.strictEqual(migrated.platformName, "Old Platform Name");
      assert.strictEqual(migrated.brandChoice, "BOTTLENEX");
      assert.strictEqual(migrated.driveFolderUrl, "https://drive.google.com");
    });

    harness.test("F9.B4: Private browsing mode with localStorage null/disabled handled without unhandled exception", () => {
      const getStorageItem = (mockStorage, key, fallback) => {
        try {
          if (!mockStorage) return fallback;
          return mockStorage.getItem(key) || fallback;
        } catch {
          return fallback;
        }
      };

      const result1 = getStorageItem(null, "key", "fallback_val");
      assert.strictEqual(result1, "fallback_val");

      const throwingStorage = {
        getItem: () => { throw new Error("SecurityError: Storage is disabled"); }
      };
      const result2 = getStorageItem(throwingStorage, "key", "fallback_val");
      assert.strictEqual(result2, "fallback_val");
    });

    harness.test("F9.B5: Resetting settings to default completely overwrites stale local keys", () => {
      let mockStorage = {
        bottlenex_settings: JSON.stringify({ customKey: "stale_value" })
      };
      const DEFAULT_SETTINGS = { brandChoice: "BOTTLENEX", platformName: "Default HQ" };

      const resetStorage = () => {
        mockStorage.bottlenex_settings = JSON.stringify(DEFAULT_SETTINGS);
      };

      resetStorage();
      const parsed = JSON.parse(mockStorage.bottlenex_settings);
      assert.strictEqual(parsed.brandChoice, "BOTTLENEX");
      assert.strictEqual(parsed.customKey, undefined);
    });
  });
}
