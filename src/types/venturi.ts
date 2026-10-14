// ==============================================================================
// VENTURI - FOUNDER'S ACCELERATION OS TYPE DEFINITIONS
// ==============================================================================

export type IndustryVertical = 
  | 'tech_ai'       // Bilişim Teknolojileri, Yapay Zeka, Derin Teknoloji
  | 'ecommerce'     // E-Ticaret, D2C, İhracat
  | 'ngo'           // Sivil Toplum, Hak Temelli Yapılar, Çevre & İklim
  | 'creative';     // Kültür, Sanat, Tasarım & Bağımsız Kolektifler

export type DecisionVerdict = 'RECOMMENDED' | 'HIGH_RISK' | 'NEUTRAL';

export interface DecisionOption {
  id: string;
  name: string;
  speedScore: number;     // 1-10
  cashflowScore: number;  // 1-10
  effortScore: number;    // 1-10 (Düşük efor = yüksek puan)
  teamLoadScore: number;  // 1-10
  totalScore: number;     // Ağırlıklı toplam
  verdict: DecisionVerdict;
  rationale: string;
}

export interface WorkspaceDocument {
  id: string;
  title: string;
  docType: 'google_docs' | 'google_sheets' | 'google_calendar';
  url: string;
  createdAt: string;
  assignedTo: string;
  status: 'Ready' | 'In_Review' | 'Synced';
  summary: string;
  category: 'Investor' | 'Grant' | 'Spec' | 'Contract';
}

export interface TimelineMilestone {
  id: string;
  title: string;
  ownerName: string;
  ownerPhone: string;
  ownerRole: string;
  startDate: string;
  endDate: string;
  progress: number; // 0 - 100
  isCriticalPath: boolean;
  blocker?: string;
  verificationChannel: 'WhatsApp' | 'Slack' | 'Email';
  status: 'On_Track' | 'At_Risk' | 'Delayed' | 'Completed';
}

export interface CapitalGrantOpportunity {
  id: string;
  title: string;
  authority: string; // TÜBİTAK, KOSGEB, AB Sivil Düşün, İKSV vb.
  vertical: IndustryVertical;
  maxFunding: string;
  deadline: string;
  readinessScore: number; // %
  docTemplate: string;
}
