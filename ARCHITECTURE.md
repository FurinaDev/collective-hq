# Collective HQ - Mimari ve Ürün Dokümantasyonu

Bu proje, Google Sheets + Apps Script üzerinde doğrulanmış kurumsal operasyon, işe alım (ATS) ve e-posta asistanı iş mantığının bağımsız, çok kiracılı (multi-tenant) bir B2B SaaS haline getirilmiş çekirdeğidir.

---

## 1. Veritabanı Mimarisi (`supabase/migrations/001_initial_schema.sql`)
PostgreSQL / Supabase üzerinde tam ilişkisel veri modeli:
- **`organizations`**: Kurum adı, slug, tipoloji (`startup`, `sme`, `agency`, `ngo`, `collective`, `foundation`), özel ayarlar (takvim rezervasyon linki, başvuru formu URL'i, AI tonu, e-posta imza unvanı).
- **`departments`**: Operasyonel birimler ve komisyonlar.
- **`members`**: Kadro rehberi. Hiyerarşik sıra (`rank_order`), haftalık ayırabileceği kapasite saati, müsaitlik durumu (`active`, `exam_week`, `vacation`, `busy`, `inactive`).
- **`job_postings`**: Açık ilanlar ve çağrılar.
- **`candidates`**: Aday havuzu, Drive/dosya linkleri, Gemini/OpenRouter tarafından çıkarılan yapısal JSON verisi (`ai_extracted_data`), mülakat davet zamanları.
- **`email_threads`**: Gmail/Outlook senkronizasyonu, gelen mesaj özeti, yönetici notu, AI tarafından üretilmiş kurumsal gövde, CC/BCC listesi ve onay durumu.
- **`audit_logs`**: Tıpkı Apps Script'teki `Değişiklik Geçmişi` gibi her veri hareketinin zaman damgalı kaydı.

---

## 2. Akıllı Çekirdek Modüller

### A. E-Posta AI Yanıt Motoru (`src/lib/email-ai.ts`)
- **Yönetici Notu Odaklılık:** Yönetici yalnızca *"Randevu takvimini ver, olumlu karşıla, CC'ye Ahmet'i ekle"* yazar.
- **Halüsinasyon ve Rol Tersine Çevirme Koruması:** Gelen davet veya bilgilendirmeyi kurumun kendi eylemi gibi yazmaz.
- **Deterministik Kurumsal Şablon:** Modelin gövdesinden bağımsız olarak tekil hitap (`Sayın ...`), tekil kapanış (`Saygılarımızla`) ve kurumsal imza garantilenir.

### B. Aday & CV Çıkarma Motoru (`src/lib/cv-parser.ts`)
- Yüklenen CV metninden Ad Soyad, E-posta, Telefon, Eğitim, Yetkinlikler (Skills) ve Deneyim yılını otomatik ayrıştırıp JSONB nesnesi olarak kaydeder.

---

## 3. Çalıştırma & Geliştirme

Proje dizini: `C:\Users\Efe\.gemini\antigravity\scratch\collective-hq`

### Geliştirme Sunucusunu Başlatma:
```bash
npm run dev
```
Tarayıcıdan `http://localhost:3000` adresini açarak:
1. Organizasyon tipini (Startup, STK, Ajans vb.) seçebilir,
2. Kadro Rehberini inceleyebilir,
3. Aday Havuzunu görebilir,
4. E-Posta Asistanı üzerinden yönetici notu vererek kurumsal e-posta taslağı üretebilirsiniz.
