// ==============================================================================
// COLLECTIVE HQ - CORE TYPE DEFINITIONS
// ==============================================================================

export type OrganizationType = 
  | 'startup'       // B2B/B2C Girişim
  | 'sme'           // KOBİ / Ticari Şirket
  | 'agency'        // Ajans / Stüdyo
  | 'ngo'           // Sivil Toplum Kuruluşu / Dernek
  | 'collective'    // Kolektif / Kültür-Sanat
  | 'foundation';   // Vakıf / Platform

export type MemberAvailability = 
  | 'active'        // Müsait / Görev verilebilir
  | 'exam_week'     // Sınav haftası (Gönüllü/Stajyer)
  | 'vacation'      // İzinli
  | 'busy'          // Yoğun / Kapasite dolu
  | 'inactive';     // Pasif

export type CandidateStatus = 
  | 'new' 
  | 'under_review' 
  | 'interview_invited' 
  | 'accepted' 
  | 'rejected';

export type EmailThreadStatus = 
  | 'pending' 
  | 'draft_ready' 
  | 'replied' 
  | 'archived';

export interface OrgSettings {
  calendar_booking_url: string;
  default_form_url: string;
  signature_title: string;
  ai_tone: 'professional_warm' | 'formal_corporate' | 'community_friendly';
  ai_preferred_provider: 'gemini' | 'openrouter';
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  org_type: OrganizationType;
  logo_url?: string;
  website?: string;
  settings: OrgSettings;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  sort_order: number;
}

export interface Member {
  id: string;
  org_id: string;
  department_id?: string;
  department_name?: string;
  full_name: string;
  email: string;
  phone?: string;
  role_title: string;
  rank_order: number; // 10: Lider, 20: Yardımcı, 30: Üye vb.
  weekly_capacity_hours: number;
  availability: MemberAvailability;
  cv_url?: string;
  primary_responsibility?: string;
  is_active: boolean;
}

export interface Candidate {
  id: string;
  org_id: string;
  posting_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  education_summary?: string;
  cv_file_url: string;
  ai_summary?: string;
  ai_extracted_data?: {
    skills?: string[];
    experience_years?: number;
    languages?: string[];
    volunteer_experience?: string;
    highlights?: string[];
  };
  status: CandidateStatus;
  interview_invited_at?: string;
  interview_scheduled_at?: string;
  hr_evaluation_notes?: string;
  created_at: string;
}

export interface EmailThread {
  id: string;
  org_id: string;
  provider_thread_id?: string;
  provider_message_id?: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  incoming_snippet: string;
  status: EmailThreadStatus;
  manager_note?: string;
  ai_generated_body?: string;
  cc_list: string[];
  bcc_list: string[];
  is_approved: boolean;
  replied_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  org_id: string;
  actor_name: string;
  action_type: string;
  target_entity: string;
  target_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

// ==============================================================================
// VORTEX EXECUTIVE OS - SHARED CAPACITY & DE-BOTTLENECK INTERFACES
// ==============================================================================

export type AvailabilityStatus = 
  | 'available' 
  | 'exam_period' 
  | 'overloaded' 
  | 'out_of_office'
  | 'MÜSAİT'
  | 'SINAV_HAFTASI'
  | 'AŞIRI_YÜKLÜ'
  | 'İZİNLİ';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  weeklyCapacityHours: number;
  allocatedHours: number;
  availability: AvailabilityStatus;
  notes?: string;
  statusNote?: string;
  activeTasks?: string[];
}

export interface MicroActionStep {
  id?: string;
  text: string;
  estimatedMinutes?: number;
  done: boolean;
  priority?: 'critical' | 'high' | 'normal';
}

export interface BottleneckScenario {
  id: string;
  title: string;
  category: "Hibe & Fon" | "Yatırımcı" | "Ekip & İnsan" | "Hukuk & Sözleşme" | "Operasyon";
  urgency: "KRİTİK" | "YÜKSEK" | "ORTA";
  problemDesc: string;
  solutionPlan: {
    title: string;
    actionSteps: MicroActionStep[];
    whatsappDraft: {
      recipient: string;
      role: string;
      phone: string;
      message: string;
    };
    docDraft: {
      title: string;
      type: "google_docs" | "google_sheets";
      contentSnippet: string;
    };
  };
}

