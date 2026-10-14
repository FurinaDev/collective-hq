"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  UserPlus, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Phone, 
  MessageCircle, 
  Filter, 
  Trash2, 
  Edit3, 
  Plus, 
  X,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Search,
  Copy,
  Layers,
  Briefcase,
  Calendar,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { useToast } from "./ui/ToastNotification";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { TeamMember, AvailabilityStatus } from "../types";

export { type TeamMember };

export const sanitizePhone = (raw: string): string => {
  if (!raw) return "";
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "9" + digits;
  if (!digits.startsWith("90")) digits = "90" + digits;
  return digits;
};

export const normalizeAvailability = (status: string): AvailabilityStatus => {
  switch (status) {
    case "available":
    case "MÜSAİT":
      return "MÜSAİT";
    case "exam_period":
    case "SINAV_HAFTASI":
      return "SINAV_HAFTASI";
    case "overloaded":
    case "AŞIRI_YÜKLÜ":
      return "AŞIRI_YÜKLÜ";
    case "out_of_office":
    case "İZİNLİ":
      return "İZİNLİ";
    default:
      return "MÜSAİT";
  }
};

export const getBadgeLabel = (status: string): string => {
  const normalized = normalizeAvailability(status);
  switch (normalized) {
    case "MÜSAİT":
      return "Müsait";
    case "SINAV_HAFTASI":
      return "Sınav Haftası";
    case "AŞIRI_YÜKLÜ":
      return "Aşırı Yüklü";
    case "İZİNLİ":
      return "İzinli";
    default:
      return "Bilinmiyor";
  }
};

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "m-1",
    name: "Buse Kaya",
    role: "Genel Koordinatör & Operasyon",
    department: "Operasyon & Kurumsal",
    phone: "905321112233",
    weeklyCapacityHours: 20,
    allocatedHours: 14,
    availability: "MÜSAİT",
    notes: "Hafta içi öğleden sonraları ve hafta sonu tam zamanlı aktif."
  },
  {
    id: "m-2",
    name: "Fatih Demir",
    role: "Sponsorluk & Kaynak Geliştirme",
    department: "Mali İşler & Fon",
    phone: "905334445566",
    weeklyCapacityHours: 12,
    allocatedHours: 12,
    availability: "SINAV_HAFTASI",
    notes: "28 Ekim'e kadar üniversite vize dönemi nedeniyle acil olmayan işler donduruldu."
  },
  {
    id: "m-3",
    name: "Can Yılmaz",
    role: "Teknik Prodüksiyon Lideri",
    department: "Teknik & Sahne",
    phone: "905357778899",
    weeklyCapacityHours: 25,
    allocatedHours: 25,
    availability: "AŞIRI_YÜKLÜ",
    notes: "Lansman hazırlığı sebebiyle maksimum kapasitede çalışıyor."
  },
  {
    id: "m-4",
    name: "Zeynep Arslan",
    role: "Tasarım & UI/UX Yöneticisi",
    department: "Tasarım & Marka",
    phone: "905368889900",
    weeklyCapacityHours: 15,
    allocatedHours: 8,
    availability: "MÜSAİT",
    notes: "Yeni marka rehberi ve yatırımcı sunum revizyonlarını üstlenebilir."
  }
];

export function TeamCapacityMatrix() {
  const toast = useToast();
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "departments">("table");

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [delegateModalOpen, setDelegateModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Selected Member for Operations
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  // New Member Form State
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newDept, setNewDept] = useState("Operasyon & Kurumsal");
  const [newPhone, setNewPhone] = useState("905320000000");
  const [newCapacity, setNewCapacity] = useState(15);
  const [newStatus, setNewStatus] = useState<AvailabilityStatus>("MÜSAİT");
  const [newNotes, setNewNotes] = useState("");
  const [formError, setFormError] = useState("");

  // Edit Member Form State
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCapacity, setEditCapacity] = useState(15);
  const [editAllocated, setEditAllocated] = useState(0);
  const [editStatus, setEditStatus] = useState<AvailabilityStatus>("MÜSAİT");
  const [editNotes, setEditNotes] = useState("");
  const [editError, setEditError] = useState("");

  // WhatsApp Task Delegation Form State
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("Cuma, 17:00");
  const [taskPriority, setTaskPriority] = useState<"Normal" | "Acil">("Acil");
  const [taskEstimatedHours, setTaskEstimatedHours] = useState(2);
  const [autoAddHours, setAutoAddHours] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);

  // SSR-Safe LocalStorage Hydration
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("vortex_team") || localStorage.getItem("vortex_team_members");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMembers(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load team from localStorage:", e);
    }
  }, []);

  const persistMembers = (updated: TeamMember[]) => {
    setMembers(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vortex_team", JSON.stringify(updated));
        localStorage.setItem("vortex_team_members", JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save team to localStorage:", e);
      }
    }
  };

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    members.forEach(m => {
      if (m.department) set.add(m.department);
    });
    return Array.from(set);
  }, [members]);

  // Filtering
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // Status filter
      if (statusFilter !== "ALL") {
        const normalized = normalizeAvailability(m.availability);
        const targetNormalized = normalizeAvailability(statusFilter);
        if (normalized !== targetNormalized) return false;
      }
      // Department filter
      if (departmentFilter !== "ALL" && m.department !== departmentFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name?.toLowerCase().includes(q);
        const matchesRole = m.role?.toLowerCase().includes(q);
        const matchesDept = m.department?.toLowerCase().includes(q);
        const matchesNotes = m.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesDept && !matchesNotes) {
          return false;
        }
      }
      return true;
    });
  }, [members, statusFilter, departmentFilter, searchQuery]);

  // CRUD: Add Member
  const handleOpenAddModal = () => {
    setNewName("");
    setNewRole("");
    setNewDept("Operasyon & Kurumsal");
    setNewPhone("905320000000");
    setNewCapacity(15);
    setNewStatus("MÜSAİT");
    setNewNotes("");
    setFormError("");
    setAddModalOpen(true);
  };

  const handleAddMember = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newName || !newName.trim() || !newRole || !newRole.trim()) {
      setFormError("İsim ve Unvan alanları zorunludur.");
      return false;
    }

    const cleanPhone = sanitizePhone(newPhone);
    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim(),
      department: newDept,
      phone: cleanPhone || "905320000000",
      weeklyCapacityHours: Math.max(0, Number(newCapacity) || 0),
      allocatedHours: 0,
      availability: newStatus,
      notes: newNotes.trim() || "Yeni ekip üyesi"
    };

    const nextMembers = [...members, newMember];
    persistMembers(nextMembers);
    setAddModalOpen(false);
    toast.success("Ekip Üyesi Eklendi", `${newMember.name} kadroya başarıyla eklendi.`);
    return true;
  };

  // CRUD: Edit Member
  const handleOpenEditModal = (member: TeamMember) => {
    setEditId(member.id);
    setEditName(member.name);
    setEditRole(member.role);
    setEditDept(member.department);
    setEditPhone(member.phone);
    setEditCapacity(member.weeklyCapacityHours);
    setEditAllocated(member.allocatedHours);
    setEditStatus(normalizeAvailability(member.availability));
    setEditNotes(member.notes || "");
    setEditError("");
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editName || !editName.trim() || !editRole || !editRole.trim()) {
      setEditError("İsim ve Unvan alanları zorunludur.");
      return;
    }

    const cleanPhone = sanitizePhone(editPhone);
    const updated = members.map(m => {
      if (m.id !== editId) return m;
      return {
        ...m,
        name: editName.trim(),
        role: editRole.trim(),
        department: editDept,
        phone: cleanPhone || m.phone,
        weeklyCapacityHours: Math.max(0, Number(editCapacity) || 0),
        allocatedHours: Math.max(0, Number(editAllocated) || 0),
        availability: editStatus,
        notes: editNotes.trim()
      };
    });

    persistMembers(updated);
    setEditModalOpen(false);
    toast.success("Üye Bilgileri Güncellendi", `${editName} profili ve kapasitesi güncellendi.`);
  };

  // CRUD: Delete Member
  const handlePromptDelete = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!memberToDelete) return;
    const remaining = members.filter(m => m.id !== memberToDelete.id);
    persistMembers(remaining);
    toast.info("Ekip Üyesi Kaldırıldı", `${memberToDelete.name} kadrodan çıkarıldı.`);
    setDeleteConfirmOpen(false);
    setMemberToDelete(null);
  };

  // Inline Fast Status Switcher
  const handleQuickStatusChange = (memberId: string, status: AvailabilityStatus) => {
    const updated = members.map(m => {
      if (m.id !== memberId) return m;
      return { ...m, availability: status };
    });
    persistMembers(updated);
    const target = members.find(m => m.id === memberId);
    toast.success("Müsaitlik Değiştirildi", `${target?.name || "Üye"} durumu: ${getBadgeLabel(status)}`);
  };

  // Task Delegation Modal
  const handleOpenDelegate = (member: TeamMember) => {
    setSelectedMember(member);
    if (member.department.includes("Mali") || member.department.includes("Fon")) {
      setTaskTitle("Bütçe tablosunun revize edilmesi");
    } else if (member.department.includes("Teknik")) {
      setTaskTitle("Canlı yayın ve sahne teknik altyapı testi");
    } else if (member.department.includes("Tasarım")) {
      setTaskTitle("Yatırımcı sunumu slayt tasarımı revizyonu");
    } else {
      setTaskTitle("Sponsorluk dosyasının son çıktısını ilgili kurumlara iletme");
    }
    setTaskDeadline("Cuma, 17:00");
    setTaskPriority("Acil");
    setTaskEstimatedHours(2);
    setAutoAddHours(true);
    setCopiedLink(false);
    setCopiedBrief(false);
    setDelegateModalOpen(true);
  };

  // Task WhatsApp Message Generation
  const generatedWhatsAppTaskMessage = useMemo(() => {
    if (!selectedMember) return "";
    const firstName = selectedMember.name.split(" ")[0];
    const priorityIcon = taskPriority === "Acil" ? "🚨 Acil" : "📌 Normal";

    return `Merhaba ${firstName}, sana ${taskPriority === "Acil" ? "🚨 Acil" : "📌"} bir görev atandı:\n\n` +
      `*Görev:* ${taskTitle}\n` +
      `*Teslim Termini:* ${taskDeadline}\n` +
      `*Öncelik:* ${taskPriority}\n\n` +
      `Herhangi bir SaaS girişi yapmana gerek yoktur. İşi onaylıyorsan veya müsaitliğin uygunsa lütfen bu mesajı 'TAMAM' olarak yanıtla. ` +
      `Detay dokümanı: https://docs.google.com/document/create?title=Gorev_Notu`;
  }, [selectedMember, taskTitle, taskDeadline, taskPriority]);

  const cleanSelectedPhone = selectedMember ? sanitizePhone(selectedMember.phone) : "";
  const waMeTaskUrl = cleanSelectedPhone 
    ? `https://wa.me/${cleanSelectedPhone}?text=${encodeURIComponent(generatedWhatsAppTaskMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(generatedWhatsAppTaskMessage)}`;
  const apiWhatsAppTaskUrl = `https://api.whatsapp.com/send?phone=${cleanSelectedPhone}&text=${encodeURIComponent(generatedWhatsAppTaskMessage)}`;

  const handleCopyTaskLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(waMeTaskUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast.success("Bağlantı Kopyalandı", "WhatsApp görev bağlantısı panoya kopyalandı.");
    }
  };

  const handleCopyTaskBrief = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(generatedWhatsAppTaskMessage);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
      toast.success("Görev Brifi Kopyalandı", "Görev brif mesajı panoya kopyalandı.");
    }
  };

  const handleCompleteDelegation = () => {
    if (selectedMember && autoAddHours && taskEstimatedHours > 0) {
      const updated = members.map(m => {
        if (m.id !== selectedMember.id) return m;
        return {
          ...m,
          allocatedHours: m.allocatedHours + taskEstimatedHours
        };
      });
      persistMembers(updated);
      toast.success("Görev Atandı & Yük Güncellendi", `${selectedMember.name} üzerine +${taskEstimatedHours} saat iş yüklendi.`);
    } else {
      toast.success("Görev Gönderildi", "WhatsApp görevi başarıyla iletildi.");
    }
    setDelegateModalOpen(false);
  };

  // Metrics
  const totalWeeklyCapacity = members.reduce((sum, m) => sum + (m.weeklyCapacityHours || 0), 0);
  const totalAllocated = members.reduce((sum, m) => sum + (m.allocatedHours || 0), 0);
  const utilizationRate = totalWeeklyCapacity > 0 ? Math.round((totalAllocated / totalWeeklyCapacity) * 100) : 0;
  const examCount = members.filter(m => normalizeAvailability(m.availability) === "SINAV_HAFTASI").length;
  const overloadedCount = members.filter(m => normalizeAvailability(m.availability) === "AŞIRI_YÜKLÜ" || (m.weeklyCapacityHours > 0 && (m.allocatedHours / m.weeklyCapacityHours) >= 0.85)).length;

  // Department Capacities
  const departmentStats = useMemo(() => {
    const stats: Record<string, { count: number; capacity: number; allocated: number }> = {};
    members.forEach(m => {
      const dept = m.department || "Diğer";
      if (!stats[dept]) {
        stats[dept] = { count: 0, capacity: 0, allocated: 0 };
      }
      stats[dept].count += 1;
      stats[dept].capacity += m.weeklyCapacityHours || 0;
      stats[dept].allocated += m.allocatedHours || 0;
    });
    return Object.entries(stats).map(([name, data]) => {
      const rate = data.capacity > 0 ? Math.round((data.allocated / data.capacity) * 100) : 0;
      return { name, ...data, rate };
    });
  }, [members]);

  // Badge component
  const renderStatusBadge = (status: AvailabilityStatus) => {
    const norm = normalizeAvailability(status);
    switch (norm) {
      case "MÜSAİT":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded text-[10px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Müsait
          </span>
        );
      case "SINAV_HAFTASI":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded text-[10px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Sınav Haftası 🎓
          </span>
        );
      case "AŞIRI_YÜKLÜ":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 px-2 py-0.5 rounded text-[10px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            Aşırı Yüklü ⚠️
          </span>
        );
      case "İZİNLİ":
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            İzinli 🌴
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst İstatistikler ve Eylemler */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs">
                M
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Kadro, Kapasite & WhatsApp Görev Matrisi
              </h2>
              <span className="rounded bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 text-[10px] font-bold text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
                Zero-Login
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Gönüllü, part-time veya tam zamanlı ekibinizin gerçek müsaitliğini izleyin; sıfır sürtünmeyle WhatsApp üzerinden görev delege edin.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5 text-xs">
              <button
                onClick={() => setViewMode("table")}
                className={`rounded-md px-2.5 py-1 font-semibold transition-colors ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Kadro Tablosu
              </button>
              <button
                onClick={() => setViewMode("departments")}
                className={`rounded-md px-2.5 py-1 font-semibold transition-colors ${
                  viewMode === "departments"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Departman Yükü
              </button>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 px-3.5 py-2 text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-2xs transition-colors shrink-0"
            >
              <UserPlus className="h-3.5 w-3.5" />
              + Yeni Ekip Üyesi
            </button>
          </div>
        </div>

        {/* 4 Özet Metrik */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif Ekip Büyüklüğü</span>
            <div className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono mt-0.5">{members.length} Kişi</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Toplam Haftalık Kapasite</span>
            <div className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono mt-0.5">{totalWeeklyCapacity} Saat/hf</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doluluk / Yük Oranı</span>
            <div className={`text-lg font-black font-mono mt-0.5 ${
              utilizationRate >= 85 ? "text-rose-600" : "text-brand-600"
            }`}>
              %{utilizationRate}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sınav / Mazeretli Ekip</span>
            <div className="text-lg font-black text-amber-600 font-mono mt-0.5">
              {examCount} Kişi
            </div>
          </div>
        </div>
      </div>

      {/* Arama ve Filtre Kontrolleri */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Arama Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İsim, unvan veya departman ara..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-brand-500 focus:outline-none"
          />
        </div>

        {/* Filtre Butonları */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1 pl-1 shrink-0">
            <Filter className="h-3 w-3" /> Durum:
          </span>
          {[
            { label: "Tümü", val: "ALL" },
            { label: "Müsait", val: "MÜSAİT" },
            { label: "Sınav Haftası", val: "SINAV_HAFTASI" },
            { label: "Aşırı Yüklü", val: "AŞIRI_YÜKLÜ" },
            { label: "İzinli", val: "İZİNLİ" }
          ].map((f) => (
            <button
              key={f.val}
              onClick={() => setStatusFilter(f.val)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors shrink-0 text-xs ${
                statusFilter === f.val
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs font-semibold"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* GÖRÜNÜM 1: EKİP TABLOSU */}
      {viewMode === "table" && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <tr>
                  <th className="p-3.5">Üye Bilgisi</th>
                  <th className="p-3.5">Departman</th>
                  <th className="p-3.5">Haftalık Yük & Kapasite</th>
                  <th className="p-3.5">Müsaitlik Durumu</th>
                  <th className="p-3.5 text-right">Eylemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Filtre kriterlerine uyan ekip üyesi bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const capacity = member.weeklyCapacityHours || 0;
                    const allocated = member.allocatedHours || 0;
                    const loadPercent = capacity > 0 ? Math.round((allocated / capacity) * 100) : 0;
                    const isOverloaded = loadPercent >= 85;

                    return (
                      <tr key={member.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            {member.name}
                            {isOverloaded && (
                              <span title="Aşırı Yük Sınırı Aşıldı">
                                <AlertTriangle className="h-3 w-3 text-rose-500" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{member.role}</div>
                        </td>

                        <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                          {member.department}
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              {allocated}/{capacity} sa
                            </span>
                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${
                                  loadPercent >= 100 
                                    ? "bg-rose-600" 
                                    : isOverloaded 
                                      ? "bg-rose-500" 
                                      : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(100, loadPercent)}%` }}
                              />
                            </div>
                            <span className={`text-[10px] font-mono font-bold ${
                              loadPercent > 100 ? "text-rose-600" : "text-slate-400"
                            }`}>
                              %{loadPercent}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">{member.notes}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            {renderStatusBadge(member.availability)}
                            
                            {/* Inline Hızlı Durum Değiştirici */}
                            <select
                              value={normalizeAvailability(member.availability)}
                              onChange={(e) => handleQuickStatusChange(member.id, e.target.value as AvailabilityStatus)}
                              className="text-[10px] rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-0.5 px-1 focus:outline-none"
                              title="Hızlı Durum Güncelle"
                            >
                              <option value="MÜSAİT">Müsait</option>
                              <option value="SINAV_HAFTASI">Sınav Haftası</option>
                              <option value="AŞIRI_YÜKLÜ">Aşırı Yüklü</option>
                              <option value="İZİNLİ">İzinli</option>
                            </select>
                          </div>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenDelegate(member)}
                              className="flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors shadow-2xs"
                              title="Zero-Login WhatsApp Görevi Oluştur"
                            >
                              <Send className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              Görev Fırlat (WhatsApp)
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(member)}
                              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Üyeyi Düzenle"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() => handlePromptDelete(member)}
                              className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Üyeyi Kaldır"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GÖRÜNÜM 2: DEPARTMAN YÜKÜ VE KAPASİTE MATRİSİ */}
      {viewMode === "departments" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentStats.map((dept) => (
            <div 
              key={dept.name} 
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                  {dept.name}
                </h4>
                <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-semibold">
                  {dept.count} Üye
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Atanan / Kapasite:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{dept.allocated} / {dept.capacity} Saat</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      dept.rate >= 85 ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, dept.rate)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Doluluk Oranı</span>
                  <span className={`font-mono font-bold ${dept.rate >= 85 ? "text-rose-600" : "text-slate-700 dark:text-slate-300"}`}>
                    %{dept.rate}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    setDepartmentFilter(dept.name);
                    setViewMode("table");
                  }}
                  className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
                >
                  Ekibi Listele <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: YENİ ÜYE EKLE */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-4 text-xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-brand-600" />
                Yeni Ekip / Gönüllü Üyesi Ekle
              </h3>
              <button 
                onClick={() => setAddModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-2 text-rose-700 dark:text-rose-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Ad Soyad <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Örn: Selin Demir"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Unvan / Sorumluluk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Örn: İçerik & Sosyal Medya Lideri"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Departman</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Operasyon & Kurumsal">Operasyon & Kurumsal</option>
                    <option value="Mali İşler & Fon">Mali İşler & Fon</option>
                    <option value="Teknik & Sahne">Teknik & Sahne</option>
                    <option value="Tasarım & Marka">Tasarım & Marka</option>
                    <option value="Yazılım & Ar-Ge">Yazılım & Ar-Ge</option>
                    <option value="Saha & Etkinlik">Saha & Etkinlik</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Haftalık Kapasite (Saat)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">WhatsApp Telefonu</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="90532..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Başlangıç Durumu</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as AvailabilityStatus)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="MÜSAİT">Müsait</option>
                    <option value="SINAV_HAFTASI">Sınav Haftası 🎓</option>
                    <option value="AŞIRI_YÜKLÜ">Aşırı Yüklü ⚠️</option>
                    <option value="İZİNLİ">İzinli 🌴</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Özel Not / Uygunluk Penceresi</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Örn: Hafta içi akşamları ve hafta sonu aktif."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 dark:bg-slate-100 px-4 py-2 text-white dark:text-slate-900 font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 shadow-2xs"
                >
                  Ekip Üyesini Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ÜYE DÜZENLE */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-4 text-xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-brand-600" />
                Ekip Üyesini Düzenle: {editName}
              </h3>
              <button 
                onClick={() => setEditModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {editError && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-2 text-rose-700 dark:text-rose-400 text-xs">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Ad Soyad <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Unvan / Sorumluluk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Departman</label>
                  <input
                    type="text"
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">WhatsApp Telefonu</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Haftalık Kapasite (Saat)</label>
                  <input
                    type="number"
                    min="0"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mevcut Atanan Saat</label>
                  <input
                    type="number"
                    min="0"
                    value={editAllocated}
                    onChange={(e) => setEditAllocated(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Müsaitlik Durumu</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as AvailabilityStatus)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                >
                  <option value="MÜSAİT">Müsait</option>
                  <option value="SINAV_HAFTASI">Sınav Haftası 🎓</option>
                  <option value="AŞIRI_YÜKLÜ">Aşırı Yüklü ⚠️</option>
                  <option value="İZİNLİ">İzinli 🌴</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Not / Durum Açıklaması</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 dark:bg-slate-100 px-4 py-2 text-white dark:text-slate-900 font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 shadow-2xs"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: GÖREV DELEGE ET (ZERO-LOGIN WHATSAPP BRİFİ) */}
      {delegateModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-2xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-4 text-xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Sıfır Sürtünmeli Görev Atama: {selectedMember.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedMember.role} ({selectedMember.phone}) • {renderStatusBadge(selectedMember.availability)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setDelegateModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Görev Başlığı ve Kapsamı</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 font-medium focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Teslim Termini</label>
                  <input
                    type="text"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Öncelik</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as "Normal" | "Acil")}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Acil">Acil (Critical Path)</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tahmini Süre (Saat)</label>
                  <input
                    type="number"
                    min="0"
                    value={taskEstimatedHours}
                    onChange={(e) => setTaskEstimatedHours(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Saat Ekleme Seçeneği */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoAddHours"
                  checked={autoAddHours}
                  onChange={(e) => setAutoAddHours(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
                />
                <label htmlFor="autoAddHours" className="text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer">
                  Bu görevin tahmini süresini (+{taskEstimatedHours} sa) üyenin mevcut haftalık iş yüküne ekle
                </label>
              </div>

              {/* Oluşan WhatsApp Önizleme */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Gönderilecek WhatsApp Mesajı (Otomatik Biçimlendirildi)
                </label>
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200 font-mono text-[11px] whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
                  {generatedWhatsAppTaskMessage}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyTaskBrief}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                >
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  {copiedBrief ? "Kopyalandı! ✓" : "Brifi Kopyala"}
                </button>
                <button
                  type="button"
                  onClick={handleCopyTaskLink}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                  {copiedLink ? "Kopyalandı! ✓" : "Bağlantıyı Kopyala"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDelegateModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                >
                  Kapat
                </button>
                <a
                  href={waMeTaskUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleCompleteDelegation}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-white font-semibold hover:bg-emerald-700 shadow-2xs transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  WhatsApp&apos;ta Görevi Fırlat ↗
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SİLME ONAY DİYALOĞU (ConfirmDialog - Zero alert/confirm) */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Ekip Üyesini Kadrodan Kaldır"
        description={
          memberToDelete 
            ? `"${memberToDelete.name}" adlı ekip üyesini ve bağlı iş yükünü kadrodan silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`
            : "Bu üyeyi silmek istediğinize emin misiniz?"
        }
        confirmText="Üyeyi Kaldır"
        cancelText="Vazgeç"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setMemberToDelete(null);
        }}
      />

    </div>
  );
}
