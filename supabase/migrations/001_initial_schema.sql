-- ==============================================================================
-- COLLECTIVE HQ - DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Multi-Tenant Architecture for Startups, Collectives, NGOs & SMEs
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE organization_type AS ENUM (
    'startup',      -- Erken Aşama Girişim
    'sme',          -- KOBİ / Ticari Şirket
    'agency',       -- Ajans / Hizmet Firması
    'ngo',          -- Sivil Toplum Kuruluşu / Dernek
    'collective',   -- Kolektif / İnisiyatif / Kültür-Sanat
    'foundation'    -- Vakıf / Enstitü
);

CREATE TYPE member_availability AS ENUM (
    'active',       -- Aktif çalışabilir
    'exam_week',    -- Sınav haftasında / Geçici meşgul
    'vacation',     -- İzinli / Tatilde
    'busy',         -- Kapasitesi dolu
    'inactive'      -- Pasif
);

CREATE TYPE candidate_status AS ENUM (
    'new',                  -- Yeni Başvuru
    'under_review',         -- İnceleniyor
    'interview_invited',    -- Mülakat Daveti İletildi
    'accepted',             -- Kadroya Kabul Edildi
    'rejected'              -- Reddedildi / Arşive Alındı
);

CREATE TYPE email_status AS ENUM (
    'pending',              -- Bekliyor
    'draft_ready',          -- AI Taslağı Hazır
    'replied',              -- Yanıtlandı
    'archived'              -- Arşivlendi
);

-- 2. ORGANIZATIONS (Her kurum kendi ortamını yönetir)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    org_type organization_type NOT NULL DEFAULT 'startup',
    logo_url TEXT,
    website TEXT,
    -- Kurumun özel şablonları ve ayarları (Takvim linki, Google Form, İletişim imzası, AI Prompt kuralları)
    settings JSONB NOT NULL DEFAULT '{
        "calendar_booking_url": "",
        "default_form_url": "",
        "signature_title": "Kurumsal İletişim",
        "ai_tone": "professional_warm",
        "ai_preferred_provider": "gemini"
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DEPARTMENTS / UNITS (Birimler, Komisyonlar, Ekipler)
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(org_id, name)
);

-- 4. MEMBERS (Ekip & Kadro Rehberi - Tablo 4'ün modern veritabanı hali)
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    user_id UUID, -- Supabase Auth auth.users bağlamak istersen
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role_title VARCHAR(100) NOT NULL, -- ör: Birim Koordinatörü, Kurucu Ortak, Gönüllü
    rank_order INT NOT NULL DEFAULT 50, -- Hiyerarşi sırası: 10: Lider, 20: Yard, 30: Üye vb.
    weekly_capacity_hours INT DEFAULT 10,
    availability member_availability NOT NULL DEFAULT 'active',
    cv_url TEXT,
    primary_responsibility TEXT, -- Birincil odak alanı
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(org_id, email)
);

-- 5. OPEN CALLS / JOB POSTINGS (İlanlar / Açık Çağrılar)
CREATE TABLE job_postings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    category VARCHAR(50) DEFAULT 'Genel Başvuru', -- Tam zamanlı, Staj, Gönüllülük
    description TEXT,
    requirements TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(org_id, slug)
);

-- 6. CANDIDATES & APPLICANTS (Aday Havuzu & AI OCR Çıktısı)
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    posting_id UUID REFERENCES job_postings(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    education_summary TEXT,
    cv_file_url TEXT NOT NULL,
    cv_drive_file_id TEXT,
    ai_summary TEXT, -- 2-3 cümlelik objektif AI analizi
    ai_extracted_data JSONB DEFAULT '{}'::jsonb, -- Yetkinlikler, deneyim yılı, diller vb.
    status candidate_status NOT NULL DEFAULT 'new',
    interview_invited_at TIMESTAMPTZ,
    interview_scheduled_at TIMESTAMPTZ,
    hr_evaluation_notes TEXT, -- Manuel İK değerlendirme notu
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. EMAIL THREADS & AI DRAFTS (Gmail / E-posta Kokpiti)
CREATE TABLE email_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider_thread_id VARCHAR(100),
    provider_message_id VARCHAR(100),
    sender_name VARCHAR(150),
    sender_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    incoming_snippet TEXT,
    status email_status NOT NULL DEFAULT 'pending',
    manager_note TEXT, -- Yöneticinin kısa fikri ("teşekkür et, randevu linkini ver")
    ai_generated_body TEXT, -- Temiz, imzasız gövde metni
    cc_list TEXT[] DEFAULT '{}',
    bcc_list TEXT[] DEFAULT '{}',
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AUDIT LOGS (Değişiklik Geçmişi)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_name VARCHAR(150) NOT NULL DEFAULT 'Sistem / AI',
    action_type VARCHAR(100) NOT NULL, -- ör: 'Kişi Aktarımı', 'E-Posta Gönderimi'
    target_entity VARCHAR(50) NOT NULL, -- 'members', 'candidates', 'email_threads'
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES for Ultra-Fast Queries
CREATE INDEX idx_members_org ON members(org_id);
CREATE INDEX idx_departments_org ON departments(org_id);
CREATE INDEX idx_candidates_org_status ON candidates(org_id, status);
CREATE INDEX idx_emails_org_status ON email_threads(org_id, status);
CREATE INDEX idx_audit_org ON audit_logs(org_id, created_at DESC);
