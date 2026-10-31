import React, { useState, useMemo, useEffect } from 'react';
import { 
  Member, Invoice, Lead, BiometricLog, PTSession, RenewalTask, AuditLogItem,
  MembershipPlan, UserRole, PaymentMethod, UserAccount, SystemSettings, WorkoutPlan, TrainerProfile, ToastItem 
} from '../types';
import { 
  Users, CreditCard, Calendar, Activity, Dumbbell, Shield, 
  Search, Plus, Filter, Download, ArrowUpRight, CheckCircle2, 
  AlertCircle, Clock, ChevronRight, Phone, Mail, Award,
  Sparkles, RefreshCw, Eye, DollarSign, FileText, Smartphone,
  Fingerprint, ArrowLeft, Building2, UserCheck, Lock, LogOut,
  ShieldAlert, ShieldCheck, UserX, ToggleLeft, ToggleRight, Check, UserCheck2,
  CalendarCheck, ClipboardList, Target, X, BarChart3, Settings as SettingsIcon,
  Trash2, Edit3, Image, AlertTriangle, Layers, RotateCcw, CheckCircle, Info
} from 'lucide-react';
import { BiometricModal } from './BiometricModal';
import { InvoiceModal } from './InvoiceModal';
import { MemberModal } from './MemberModal';
import { DemoPaymentModal } from './DemoPaymentModal';
import { 
  INITIAL_PLANS as DEFAULT_PLANS,
  INITIAL_MEMBERS as DEFAULT_MEMBERS,
  INITIAL_INVOICES as DEFAULT_INVOICES,
  INITIAL_TRAINERS as DEFAULT_TRAINERS,
  INITIAL_GALLERY_ITEMS,
  DEMO_ACCOUNTS
} from '../mockData';

interface WFitCrmProps {
  onBackToLanding: () => void;
  currentUser: UserAccount;
  authToken: string;
  onLogout: () => void;
  onSwitchDemoAccount?: (account: UserAccount) => void;
  initialPlans: MembershipPlan[];
  initialMembers: Member[];
  initialInvoices: Invoice[];
  initialLeads: Lead[];
  initialLogs: BiometricLog[];
  initialPTSessions: PTSession[];
  initialRenewals: RenewalTask[];
  initialAuditLogs: AuditLogItem[];
}

export const WFitCrm: React.FC<WFitCrmProps> = ({
  onBackToLanding,
  currentUser,
  authToken,
  onLogout,
  onSwitchDemoAccount,
  initialPlans,
  initialMembers,
  initialInvoices,
  initialLeads,
  initialLogs,
  initialPTSessions,
  initialRenewals,
  initialAuditLogs
}) => {
  // Navigation & View State based on Role
  const defaultTab = useMemo(() => {
    if (currentUser.role === 'TRAINER') return 'trainer-dashboard';
    if (currentUser.role === 'MEMBER') return 'member-dashboard';
    return 'dashboard';
  }, [currentUser.role]);

  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // When currentUser changes (e.g. via demo role switcher), update activeTab if needed
  useEffect(() => {
    if (currentUser.role === 'TRAINER') setActiveTab('trainer-dashboard');
    else if (currentUser.role === 'MEMBER') setActiveTab('member-dashboard');
    else setActiveTab('dashboard');
  }, [currentUser.role]);

  // Core Demo App State (Saved in session / state for interactive demonstration)
  const [plans, setPlans] = useState<MembershipPlan[]>(() => {
    const saved = localStorage.getItem('wfit_demo_plans');
    return saved ? JSON.parse(saved) : initialPlans;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('wfit_demo_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('wfit_demo_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [trainers, setTrainers] = useState<TrainerProfile[]>(DEFAULT_TRAINERS);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [biometricLogs, setBiometricLogs] = useState<BiometricLog[]>(initialLogs);
  const [ptSessions, setPtSessions] = useState<PTSession[]>(initialPTSessions);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [staffAccounts, setStaffAccounts] = useState<UserAccount[]>(DEMO_ACCOUNTS);

  // System Settings State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    managerPaymentAccessEnabled: false,
    gymName: 'WFIT GYM',
    primaryBranch: 'Downtown Flagship',
    allowSelfRegistration: true,
    biometricEnforcementActive: true
  });

  // Trainer & Workout Specific State
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([
    {
      id: 'WO-2026-01',
      memberId: 'WFIT-2026-001',
      memberName: 'Rohan Mehra',
      trainerId: 'TR-ALEX',
      trainerName: 'Alex Chen',
      title: 'Strength Hypertrophy Block A',
      focus: 'Barbell Squats & Overhead Pressing Mechanics',
      exercises: [
        { name: 'Barbell Back Squat', sets: '4', reps: '6', weight: '120 kg', notes: 'Maintain torso angle' },
        { name: 'Overhead Barbell Press', sets: '3', reps: '8', weight: '65 kg', notes: 'Full lockout at top' },
        { name: 'Romanian Deadlift', sets: '3', reps: '10', weight: '100 kg' },
        { name: 'Weighted Pull-ups', sets: '3', reps: '8', weight: '+15 kg' }
      ],
      updatedAt: '2026-10-28',
      status: 'Active',
      coachNotes: 'Technique is dialled in on back squat. Ready to increase load next microcycle.'
    },
    {
      id: 'WO-2026-02',
      memberId: 'WFIT-2026-002',
      memberName: 'Priya Sharma',
      trainerId: 'TR-ALEX',
      trainerName: 'Alex Chen',
      title: 'Posterior Chain & Functional Power',
      focus: 'Kettlebell Swings, Trap Bar Deadlifts & Core Stability',
      exercises: [
        { name: 'Trap Bar Deadlift', sets: '4', reps: '8', weight: '80 kg' },
        { name: 'Single-Arm Dumbbell Row', sets: '3', reps: '12', weight: '20 kg' },
        { name: 'Bulgarian Split Squat', sets: '3', reps: '10 each', weight: '14 kg dbs' },
        { name: 'Hanging Leg Raises', sets: '3', reps: '15' }
      ],
      updatedAt: '2026-10-29',
      status: 'Active',
      coachNotes: 'Great unilateral balance improvement. Consistent 3x per week attendance.'
    }
  ]);

  // Persist demo changes to localStorage
  useEffect(() => {
    localStorage.setItem('wfit_demo_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('wfit_demo_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('wfit_demo_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Modals
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isPaymentDemoOpen, setIsPaymentDemoOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedMemberForDrawer, setSelectedMemberForDrawer] = useState<Member | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<typeof INITIAL_GALLERY_ITEMS[0] | null>(null);

  // Edit Plan Price Modal State
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  // Destructive Confirmation Dialog Modal State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    onConfirm: () => {}
  });

  // New Workout Form Modal
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({
    memberId: 'WFIT-2026-001',
    title: '',
    focus: '',
    exercisesText: 'Barbell Squats (4x6)\nRomanian Deadlift (3x10)\nPlank Holds (3x60s)',
    coachNotes: ''
  });

  // Biometric Terminal Simulator State
  const [deviceOnline, setDeviceOnline] = useState(true);

  // Filters & Search
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>('All');
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('All');
  const [invoiceMethodFilter, setInvoiceMethodFilter] = useState<string>('All');

  // Role permissions evaluation
  const permissions = useMemo(() => {
    const isOwner = currentUser.role === 'OWNER / ADMIN';
    const isManager = currentUser.role === 'CLUB MANAGER';
    const isTrainer = currentUser.role === 'TRAINER';
    const isMember = currentUser.role === 'MEMBER';

    return {
      canViewFinances: isOwner || (isManager && systemSettings.managerPaymentAccessEnabled),
      canManageStaff: isOwner,
      canEditSecurity: isOwner,
      canManageMembers: isOwner || isManager,
      canManageWorkouts: isOwner || isManager || isTrainer,
      isTrainerOnly: isTrainer,
      isMemberOnly: isMember
    };
  }, [currentUser.role, systemSettings.managerPaymentAccessEnabled]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = 
        m.fullName.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        m.mobile.includes(memberSearchQuery) ||
        m.id.toLowerCase().includes(memberSearchQuery.toLowerCase());
      const matchesStatus = memberStatusFilter === 'All' || m.status === memberStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, memberSearchQuery, memberStatusFilter]);

  // Filtered invoices list for Payment History
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = 
        inv.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
        (inv.demoTransactionId && inv.demoTransactionId.toLowerCase().includes(invoiceSearchQuery.toLowerCase())) ||
        inv.memberName.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
        inv.memberId.toLowerCase().includes(invoiceSearchQuery.toLowerCase());
      const matchesStatus = invoiceStatusFilter === 'All' || inv.status === invoiceStatusFilter;
      const matchesMethod = invoiceMethodFilter === 'All' || inv.paymentMethod === invoiceMethodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [invoices, invoiceSearchQuery, invoiceStatusFilter, invoiceMethodFilter]);

  // Current Member Record for Member Portal
  const currentMemberRecord = useMemo(() => {
    if (currentUser.role !== 'MEMBER') return members[0];
    return members.find(m => m.id === currentUser.memberId) || members[0];
  }, [currentUser, members]);

  // Current Member Invoices for Member Portal
  const currentMemberInvoices = useMemo(() => {
    if (currentUser.role !== 'MEMBER') return [];
    return invoices.filter(inv => inv.memberId === currentMemberRecord.id);
  }, [currentUser, invoices, currentMemberRecord.id]);

  // Current Trainer Assigned Members
  const trainerAssignedMembers = useMemo(() => {
    if (currentUser.role !== 'TRAINER') return [];
    return members.filter(m => m.assignedTrainerId === currentUser.trainerId);
  }, [currentUser, members]);

  // Current Trainer Profile
  const currentTrainerProfile = useMemo(() => {
    if (currentUser.role !== 'TRAINER') return trainers[0];
    return trainers.find(t => t.id === currentUser.trainerId) || trainers[0];
  }, [currentUser, trainers]);

  // Financial Dashboard Calculations (Strictly for Authorized Roles)
  const metrics = useMemo(() => {
    const totalBookedSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const membershipSales = invoices
      .filter(inv => !inv.items.some(i => i.description.toLowerCase().includes('pt') || i.description.toLowerCase().includes('trainer')))
      .reduce((sum, inv) => sum + inv.total, 0);
    const ptSales = invoices
      .filter(inv => inv.items.some(i => i.description.toLowerCase().includes('pt') || i.description.toLowerCase().includes('trainer')))
      .reduce((sum, inv) => sum + inv.total, 0);
    const totalDiscounts = invoices.reduce((sum, inv) => sum + inv.discount, 0);

    const paidInvoices = invoices.filter(inv => inv.status === 'DEMO PAID' || inv.status === 'Paid');
    const paymentsCollected = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const totalOutstandingDues = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
    const unpaidInvoicesCount = invoices.filter(inv => inv.balanceDue > 0).length;

    const activeMembersCount = members.filter(m => m.status === 'Active').length;
    const expiringCount = members.filter(m => m.status === 'Expiring Soon').length;
    const unpaidMembersCount = members.filter(m => m.status === 'Unpaid').length;
    const expiredCount = members.filter(m => m.status === 'Expired').length;

    return {
      totalBookedSales,
      membershipSales,
      ptSales,
      totalDiscounts,
      paymentsCollected,
      totalOutstandingDues,
      unpaidInvoicesCount,
      activeMembersCount,
      expiringCount,
      unpaidMembersCount,
      expiredCount,
      paidInvoicesCount: paidInvoices.length
    };
  }, [invoices, members]);

  // Handlers for Member Management (Feature 4)
  const handleSimulateRenewal = (member: Member, monthsToAdd: number) => {
    const now = new Date();
    const currentExpiry = new Date(member.expiryDate);
    const baseDate = currentExpiry > now ? currentExpiry : now;
    baseDate.setMonth(baseDate.getMonth() + monthsToAdd);
    const newExpiry = baseDate.toISOString().split('T')[0];

    setMembers(prev => prev.map(m => m.id === member.id ? {
      ...m,
      status: 'Active',
      expiryDate: newExpiry
    } : m));

    // Log simulated renewal
    const newLog: AuditLogItem = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser.email,
      role: currentUser.role,
      action: 'Simulated Membership Renewal',
      target: `${member.fullName} (${member.id})`,
      details: `Extended membership by +${monthsToAdd} months to ${newExpiry}`,
      status: 'SUCCESS'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    addToast('success', 'Membership Renewed (Demo)', `${member.fullName}'s membership extended to ${newExpiry}.`);
  };

  const handleDeleteMember = (member: Member) => {
    setConfirmDialog({
      isOpen: true,
      title: `Remove Member ${member.fullName}?`,
      message: `Are you sure you want to delete ${member.fullName} (${member.id}) from the demo roster? This action can be reversed via "Reset Demo Data".`,
      confirmLabel: 'Delete Member',
      onConfirm: () => {
        setMembers(prev => prev.filter(m => m.id !== member.id));
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        addToast('info', 'Member Removed', `${member.fullName} was removed from the demo roster.`);
      }
    });
  };

  const handleSaveMemberEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberToEdit) return;

    setMembers(prev => prev.map(m => m.id === memberToEdit.id ? memberToEdit : m));
    setMemberToEdit(null);
    addToast('success', 'Profile Updated', `Updated details for ${memberToEdit.fullName}.`);
  };

  // Handler for Plan Price Editing (Feature 1 & 2)
  const handleSavePlanPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setPlans(prev => prev.map(p => p.id === editingPlan.id ? editingPlan : p));
    setIsEditPlanModalOpen(false);
    setEditingPlan(null);
    addToast('success', 'Plan Price Updated', `${editingPlan.name} price updated to ₹${editingPlan.price.toLocaleString('en-IN')}.`);
  };

  // Handler for Reset Demo Data (Feature 7)
  const handleResetDemoData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Demo Data to Original State?',
      message: 'This will restore all default members, plans, invoices, trainers, and audit records, removing all simulated payments and edits.',
      confirmLabel: 'Reset All Demo Data',
      onConfirm: () => {
        localStorage.removeItem('wfit_demo_plans');
        localStorage.removeItem('wfit_demo_members');
        localStorage.removeItem('wfit_demo_invoices');
        setPlans(DEFAULT_PLANS);
        setMembers(DEFAULT_MEMBERS);
        setInvoices(DEFAULT_INVOICES);
        setTrainers(DEFAULT_TRAINERS);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        addToast('success', 'Demo Data Reset', 'All sample records and plan prices restored to original state.');
      }
    });
  };

  // Handler for Trainer Photo Switcher Preset (Feature 5)
  const handleSwitchTrainerPhoto = (trainerId: string, newPhotoUrl: string) => {
    setTrainers(prev => prev.map(t => t.id === trainerId ? { ...t, photoUrl: newPhotoUrl } : t));
    addToast('info', 'Trainer Photo Updated', 'Photo preset applied for demonstration.');
  };

  // Navigation Items per Authenticated Role
  const navTabs = useMemo(() => {
    if (currentUser.role === 'OWNER / ADMIN') {
      return [
        { id: 'dashboard', label: 'Dashboard & Metrics', icon: Activity },
        { id: 'members', label: `Members (${members.length})`, icon: Users },
        { id: 'billing', label: `Demo Payments (${invoices.length})`, icon: CreditCard },
        { id: 'plans', label: 'Membership Plans (Editable)', icon: Dumbbell },
        { id: 'trainers', label: 'Trainer Roster', icon: UserCheck2 },
        { id: 'gallery', label: 'Gym Facility Gallery', icon: Image },
        { id: 'reports', label: 'Demo Revenue & Reconciliation', icon: BarChart3 },
        { id: 'staff', label: 'Staff Accounts', icon: Shield },
        { id: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: ShieldAlert },
      ];
    }

    if (currentUser.role === 'CLUB MANAGER') {
      const items = [
        { id: 'dashboard', label: 'Operational Dashboard', icon: Activity },
        { id: 'members', label: `Member Management (${members.length})`, icon: Users },
        { id: 'plans', label: 'Membership Plans', icon: Dumbbell },
        { id: 'trainers', label: 'Trainer Roster', icon: UserCheck2 },
        { id: 'gallery', label: 'Gym Facility Gallery', icon: Image },
        { id: 'branch-ops', label: 'Turnstile & Biometric Logs', icon: Fingerprint },
      ];

      if (systemSettings.managerPaymentAccessEnabled) {
        items.splice(2, 0, { id: 'billing', label: 'Demo Payments', icon: CreditCard });
      }

      return items;
    }

    if (currentUser.role === 'TRAINER') {
      return [
        { id: 'trainer-dashboard', label: 'Trainer Overview', icon: Activity },
        { id: 'trainer-profile', label: 'My Coach Profile', icon: UserCheck },
        { id: 'trainer-members', label: `Assigned Clients (${trainerAssignedMembers.length})`, icon: Users },
        { id: 'trainer-workouts', label: 'Workout Programming', icon: Dumbbell },
        { id: 'gallery', label: 'Gym Facility Gallery', icon: Image },
      ];
    }

    if (currentUser.role === 'MEMBER') {
      return [
        { id: 'member-dashboard', label: 'My Member Dashboard', icon: Activity },
        { id: 'member-profile', label: 'Personal Profile', icon: UserCheck },
        { id: 'member-payments', label: `Interactive Payment Demo (${currentMemberInvoices.length})`, icon: CreditCard },
        { id: 'member-workouts', label: 'My Workout Program', icon: ClipboardList },
        { id: 'gallery', label: 'Club Facility Gallery', icon: Image },
      ];
    }

    return [];
  }, [currentUser.role, members.length, invoices.length, auditLogs.length, systemSettings.managerPaymentAccessEnabled, trainerAssignedMembers.length, currentMemberInvoices.length]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#172033] font-sans antialiased relative pb-16">
      
      {/* =========================================================================
          PROMINENT DEMO MODE BANNER (FEATURE 1 & SAFETY)
      ========================================================================= */}
      <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-extrabold uppercase text-[10px] tracking-wider animate-pulse font-mono">
            DEMO MODE
          </span>
          <span className="text-slate-300 font-medium">
            Interactive Presentation Version • Browser Session Only • No Real Money or Banking Credentials Processed
          </span>
        </div>

        {/* Quick Demo Role Switcher in Top Bar */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden lg:inline font-mono">Switch Demo Role:</span>
          
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
            {DEMO_ACCOUNTS.slice(0, 4).map((acc) => {
              const isSelected = currentUser.id === acc.id;
              const shortRole = acc.role === 'OWNER / ADMIN' ? 'Admin' :
                                acc.role === 'CLUB MANAGER' ? 'Manager' :
                                acc.role === 'TRAINER' ? 'Trainer' : 'Member';
              return (
                <button
                  key={acc.id}
                  onClick={() => onSwitchDemoAccount && onSwitchDemoAccount(acc)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#1D4ED8] text-white shadow-xs font-bold' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                  title={`Switch to demo account: ${acc.name}`}
                >
                  {shortRole}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleResetDemoData}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition-colors cursor-pointer"
            title="Restore original sample data"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* ================= TOP NAVIGATION HEADER (WHITE THEME) ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        
        {/* Left: Brand Plate & Back To Gym Club Landing */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#172033] border border-[#E2E8F0] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#5B6475]" />
            <span>WFIT Gym Club</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-archivo-brand text-lg font-bold tracking-widest text-[#172033] uppercase">
              WFIT
            </span>
            <span className="text-[#CBD5E1] text-sm font-light">/</span>
            <span className="text-xs font-mono font-semibold tracking-wider text-[#5B6475] uppercase">
              DEMO OPERATIONS
            </span>
          </div>
        </div>

        {/* Center: Current Demo User Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-1.5 rounded-full text-xs shadow-xs">
            <div className={`w-2 h-2 rounded-full ${
              currentUser.role === 'OWNER / ADMIN' ? 'bg-[#1D4ED8]' :
              currentUser.role === 'CLUB MANAGER' ? 'bg-sky-500' :
              currentUser.role === 'TRAINER' ? 'bg-purple-500' :
              'bg-[#15803D]'
            }`} />
            
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#172033]">{currentUser.name}</span>
              <span className="text-[#CBD5E1]">|</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                currentUser.role === 'OWNER / ADMIN' ? 'bg-blue-50 text-[#1D4ED8] border border-blue-200' :
                currentUser.role === 'CLUB MANAGER' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                currentUser.role === 'TRAINER' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                'bg-emerald-50 text-[#15803D] border border-emerald-200'
              }`}>
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Security & Demo Actions */}
        <div className="flex items-center gap-3">
          {/* Turnstile Terminal Simulator */}
          <button
            onClick={() => setIsBiometricModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F8FAFC] text-[#172033] border border-[#E2E8F0] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            title="Launch Biometric Turnstile Hardware Terminal Simulator"
          >
            <Fingerprint className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span className="hidden sm:inline">Turnstile Terminal</span>
          </button>

          {/* Payment Demo Trigger Button */}
          <button
            onClick={() => setIsPaymentDemoOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
            title="Launch Interactive Payment Demo Modal"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Interactive Payment Demo</span>
          </button>

          {/* Secure Sign Out */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-[#B91C1C] border border-rose-200 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            title="Exit Demo Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </header>

      {/* ================= SECONDARY ROLE-RESTRICTED SUB-NAVIGATION TABS ================= */}
      <nav aria-label="Sub-navigation" className="bg-white border-b border-[#E2E8F0] px-6 overflow-x-auto shadow-xs">
        <div className="flex items-center gap-1.5 py-2.5 min-w-max text-xs">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 text-[#1D4ED8] border border-blue-200 shadow-xs' 
                    : 'text-[#5B6475] hover:text-[#172033] hover:bg-[#F8FAFC]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1D4ED8]' : 'text-[#70798A]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ================= MAIN DASHBOARD VIEWS ================= */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">

        {/* =========================================================================
            VIEW 1: OWNER / ADMIN DASHBOARD (FEATURE 1)
        ========================================================================= */}
        {currentUser.role === 'OWNER / ADMIN' && activeTab === 'dashboard' && metrics && (
          <div className="space-y-6">
            
            {/* Top Presentation Pitch Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#172033]">
                    Gym Owner & Executive KPI Overview (Demo Session)
                  </h3>
                  <p className="text-xs text-[#5B6475]">
                    Comprehensive real-time view of membership volume, demo collections, trainer utilization, and turnstile activity.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsPaymentDemoOpen(true)}
                  className="px-3.5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Test Payment Demo Flow</span>
                </button>

                <button
                  onClick={() => setIsMemberModalOpen(true)}
                  className="px-3.5 py-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#172033] text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>
            </div>

            {/* Core KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                <div className="flex justify-between text-xs text-[#5B6475] uppercase font-mono font-semibold">
                  <span>Simulated Total Sales</span>
                  <Activity className="w-4 h-4 text-[#70798A]" />
                </div>
                <div className="my-3">
                  <div className="font-archivo-title text-3xl font-bold text-[#172033] tracking-tight">
                    ₹{metrics.totalBookedSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-[#5B6475] mt-1">
                    Booked demo invoice value across memberships
                  </div>
                </div>
                <div className="text-[11px] text-[#70798A] border-t border-[#E2E8F0] pt-2 font-mono">
                  *Demonstration metrics only
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                <div className="flex justify-between text-xs text-[#15803D] uppercase font-mono font-bold">
                  <span>Simulated Collections</span>
                  <DollarSign className="w-4 h-4 text-[#15803D]" />
                </div>
                <div className="my-3">
                  <div className="font-archivo-title text-3xl font-bold text-[#15803D] tracking-tight">
                    ₹{metrics.paymentsCollected.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-[#15803D] mt-1 font-medium">
                    {metrics.paidInvoicesCount} transactions settled in demo
                  </div>
                </div>
                <div className="text-[11px] text-[#70798A] border-t border-[#E2E8F0] pt-2 font-mono">
                  Cash + UPI + Gateway Demo
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                <div className="flex justify-between text-xs text-[#5B6475] uppercase font-mono font-semibold">
                  <span>Active Members</span>
                  <Users className="w-4 h-4 text-[#1D4ED8]" />
                </div>
                <div className="my-3">
                  <div className="font-archivo-title text-3xl font-bold text-[#1D4ED8] tracking-tight">
                    {metrics.activeMembersCount} / {members.length}
                  </div>
                  <div className="text-xs text-[#5B6475] mt-1">
                    {metrics.expiringCount} expiring soon • {metrics.unpaidMembersCount} unpaid
                  </div>
                </div>
                <div className="text-[11px] text-[#70798A] border-t border-[#E2E8F0] pt-2">
                  Full access granted on biometric gates
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between text-xs text-[#B45309] uppercase font-mono font-bold">
                  <span>Simulated Outstanding</span>
                  <AlertCircle className="w-4 h-4 text-[#B45309]" />
                </div>
                <div className="my-3">
                  <div className="font-archivo-title text-3xl font-bold text-[#B45309] tracking-tight">
                    ₹{metrics.totalOutstandingDues.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-[#5B6475] mt-1">
                    {metrics.unpaidInvoicesCount} invoices pending full clearance
                  </div>
                </div>
                <div className="text-[11px] text-[#70798A] border-t border-[#E2E8F0] pt-2">
                  Gate simulator blocks entry for unpaid
                </div>
              </div>

            </div>

            {/* Visual Charts & Trend Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Monthly Demo Revenue Overview Chart */}
              <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm space-y-4 lg:col-span-2">
                <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#172033]">Monthly Simulated Collections Trend</h4>
                    <p className="text-[11px] text-[#5B6475]">Sample 6-month historical & current collection projection</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1D4ED8] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    2026 Season
                  </span>
                </div>

                <div className="pt-2">
                  <div className="h-44 flex items-end gap-3 sm:gap-6 pt-4 border-b border-[#E2E8F0] pb-2">
                    {[
                      { month: 'May', height: '55%', amount: '₹1,45,000' },
                      { month: 'Jun', height: '65%', amount: '₹1,82,000' },
                      { month: 'Jul', height: '80%', amount: '₹2,20,000' },
                      { month: 'Aug', height: '70%', amount: '₹1,95,000' },
                      { month: 'Sep', height: '90%', amount: '₹2,60,000' },
                      { month: 'Oct (Current)', height: '100%', amount: `₹${metrics.paymentsCollected.toLocaleString('en-IN')}`, active: true }
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-mono text-[#70798A] opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.amount}
                        </span>
                        <div 
                          style={{ height: item.height }}
                          className={`w-full rounded-t-lg transition-all duration-500 cursor-pointer ${
                            item.active 
                              ? 'bg-[#1D4ED8] hover:bg-[#1E40AF] shadow-md' 
                              : 'bg-slate-200 hover:bg-slate-300'
                          }`}
                        />
                        <span className={`text-[11px] font-semibold mt-1 ${item.active ? 'text-[#1D4ED8] font-bold' : 'text-[#70798A]'}`}>
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#70798A] pt-2">
                    <span>*All figures represent simulated demonstration data for client review.</span>
                    <span className="font-semibold text-[#15803D]">↑ 18.4% YoY Demo Growth</span>
                  </div>
                </div>
              </div>

              {/* Membership Plan Tier Distribution */}
              <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
                  <h4 className="font-bold text-sm text-[#172033]">Plan Distribution</h4>
                  <span className="text-xs font-mono text-[#5B6475]">{members.length} Members</span>
                </div>

                <div className="space-y-3 pt-1">
                  {plans.map(p => {
                    const count = members.filter(m => m.planId === p.id).length;
                    const percent = Math.round((count / (members.length || 1)) * 100);
                    return (
                      <div key={p.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-[#172033]">{p.name}</span>
                          <span className="font-mono text-[#5B6475]">{count} ({percent}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#1D4ED8] rounded-full" 
                            style={{ width: `${Math.max(percent, 8)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] text-center">
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="text-xs font-bold text-[#1D4ED8] hover:underline cursor-pointer"
                  >
                    Manage & Edit Plan Prices in Demo →
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Trainer Summary Section */}
            <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
                <div>
                  <h4 className="font-bold text-sm text-[#172033]">Head Coaching Staff (Roster Summary)</h4>
                  <p className="text-[11px] text-[#5B6475]">Certified coaching staff assigned across active membership tiers</p>
                </div>
                <button
                  onClick={() => setActiveTab('trainers')}
                  className="px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#172033] text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  View Full Roster & Gallery
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {trainers.map(tr => (
                  <div key={tr.id} className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-3">
                    <img 
                      src={tr.photoUrl} 
                      alt="" 
                      className="w-12 h-12 rounded-full object-cover border border-[#E2E8F0] shrink-0" 
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-[#172033] truncate">{tr.name}</div>
                      <div className="text-[10px] text-[#1D4ED8] font-semibold truncate">{tr.specialisation.split(',')[0]}</div>
                      <div className="text-[10px] text-[#70798A] mt-0.5">{tr.experienceYears} Years Exp • {tr.assignedMemberIds.length} Clients</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 2: CLUB MANAGER DASHBOARD (FEATURE 1 & 4)
        ========================================================================= */}
        {currentUser.role === 'CLUB MANAGER' && activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#172033]">
                    Club Operational Desk & Member Administration
                  </h3>
                  <p className="text-xs text-[#5B6475]">
                    Manage branch attendance, registrations, membership renewals, and coach scheduling for {currentUser.branch || 'Downtown Flagship'}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMemberModalOpen(true)}
                  className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register New Member</span>
                </button>
              </div>
            </div>

            {/* Operational stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
                <div className="text-xs text-[#5B6475] uppercase font-mono font-semibold">Total Roster</div>
                <div className="text-3xl font-bold text-[#172033] mt-2">{members.length}</div>
                <div className="text-[11px] text-[#70798A] mt-1">Sample demo profiles</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
                <div className="text-xs text-[#15803D] uppercase font-mono font-bold">Active Clearances</div>
                <div className="text-3xl font-bold text-[#15803D] mt-2">
                  {members.filter(m => m.status === 'Active').length}
                </div>
                <div className="text-[11px] text-[#70798A] mt-1">Biometrics enabled</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm">
                <div className="text-xs text-[#B45309] uppercase font-mono font-bold">Renewals Due</div>
                <div className="text-3xl font-bold text-[#B45309] mt-2">
                  {members.filter(m => m.status === 'Expiring Soon' || m.status === 'Expired').length}
                </div>
                <div className="text-[11px] text-[#70798A] mt-1">Can simulate renewal below</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
                <div className="text-xs text-[#5B6475] uppercase font-mono font-semibold">Today's Turnstile Logs</div>
                <div className="text-3xl font-bold text-[#1D4ED8] mt-2">{biometricLogs.length}</div>
                <div className="text-[11px] text-[#70798A] mt-1">Simulated entry scans</div>
              </div>
            </div>

            {/* Quick Action: Members Pending Action */}
            <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
                <h4 className="font-bold text-sm text-[#172033]">Quick Membership Action & Renewal Simulator</h4>
                <span className="text-xs font-mono text-[#5B6475]">Click "+Month" to simulate renewal</span>
              </div>

              <div className="space-y-3">
                {members.map(m => (
                  <div key={m.id} className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={m.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]" />
                      <div>
                        <div className="font-bold text-xs text-[#172033] flex items-center gap-2">
                          <span>{m.fullName}</span>
                          <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                            m.status === 'Active' ? 'bg-emerald-50 text-[#15803D] border border-emerald-200' :
                            m.status === 'Expiring Soon' ? 'bg-amber-50 text-[#B45309] border border-amber-200' :
                            m.status === 'Unpaid' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                            'bg-rose-50 text-[#B91C1C] border border-rose-200'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5B6475] font-mono">
                          {m.id} • {m.planName} • Valid till: <strong className="text-[#172033]">{m.expiryDate}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Quick Simulation Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSimulateRenewal(m, 1)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#172033] border border-[#E2E8F0] rounded text-xs font-semibold cursor-pointer shadow-xs"
                        title="Add 1 Month to Expiry"
                      >
                        +1 Mo
                      </button>
                      <button
                        onClick={() => handleSimulateRenewal(m, 3)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#172033] border border-[#E2E8F0] rounded text-xs font-semibold cursor-pointer shadow-xs"
                        title="Add 3 Months to Expiry"
                      >
                        +3 Mo
                      </button>
                      <button
                        onClick={() => handleSimulateRenewal(m, 12)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#1D4ED8] border border-blue-200 rounded text-xs font-bold cursor-pointer shadow-xs"
                        title="Add 1 Year Annual Pass to Expiry"
                      >
                        +1 Yr
                      </button>
                      <button
                        onClick={() => setMemberToEdit(m)}
                        className="p-1.5 bg-white hover:bg-slate-100 text-[#5B6475] border border-[#E2E8F0] rounded text-xs cursor-pointer shadow-xs"
                        title="Edit Member Information"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-[#B91C1C] border border-rose-200 rounded text-xs cursor-pointer shadow-xs"
                        title="Delete Member From Demo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 3: TRAINER DASHBOARD (FEATURE 1) — ZERO FINANCIAL INFO
        ========================================================================= */}
        {currentUser.role === 'TRAINER' && (
          <div className="space-y-6">
            
            {/* Trainer Banner */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-200 bg-slate-100 shadow-sm shrink-0">
                  <img 
                    src={currentTrainerProfile.photoUrl} 
                    alt="Trainer profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#172033]">{currentTrainerProfile.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                      COACH {currentTrainerProfile.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6475] mt-0.5">
                    {currentTrainerProfile.specialisation}
                  </p>
                  <p className="text-[11px] text-[#70798A] mt-0.5">
                    Branch: {currentUser.branch || 'Downtown Flagship'} • Hours: {currentTrainerProfile.workingHours} • {currentTrainerProfile.experienceYears} Years Exp
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsWorkoutModalOpen(true)}
                className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs uppercase rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Program Workout</span>
              </button>
            </div>

            {/* Quick Metrics (Strictly non-financial!) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <span className="text-xs text-[#5B6475] uppercase font-mono font-semibold">Assigned Active Clients</span>
                <div className="text-2xl font-bold text-[#172033] mt-1">{trainerAssignedMembers.length}</div>
                <div className="text-[11px] text-[#70798A] mt-1">Direct coaching roster</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <span className="text-xs text-[#5B6475] uppercase font-mono font-semibold">Scheduled PT Sessions</span>
                <div className="text-2xl font-bold text-purple-700 mt-1">
                  {ptSessions.filter(s => s.trainerId === currentUser.trainerId).length}
                </div>
                <div className="text-[11px] text-[#70798A] mt-1">Package clients active</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <span className="text-xs text-[#5B6475] uppercase font-mono font-semibold">Active Workouts Programmed</span>
                <div className="text-2xl font-bold text-[#1D4ED8] mt-1">
                  {workouts.filter(w => w.trainerId === currentUser.trainerId).length}
                </div>
                <div className="text-[11px] text-[#70798A] mt-1">Training progressions</div>
              </div>
            </div>

            {/* Strict Financial Quarantine Notice */}
            <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl text-xs text-purple-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                <strong>Trainer Security Protocol:</strong> Financial ledgers, invoice totals, member subscription fees, and gym revenue are strictly quarantined from this dashboard.
              </span>
            </div>

            {/* Assigned Clients & Workouts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Assigned Clients List */}
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
                  <h4 className="font-bold text-sm text-[#172033]">My Assigned Clients</h4>
                  <span className="text-xs font-mono text-[#5B6475]">{trainerAssignedMembers.length} Members</span>
                </div>

                <div className="space-y-3">
                  {trainerAssignedMembers.map(member => (
                    <div key={member.id} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.photoUrl} 
                          alt="" 
                          className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]" 
                        />
                        <div>
                          <div className="font-bold text-[#172033]">{member.fullName}</div>
                          <div className="text-[11px] font-mono text-[#70798A]">{member.id} • {member.planName}</div>
                          {member.fitnessGoals && (
                            <div className="text-[10px] text-[#5B6475] mt-1 line-clamp-1">
                              Goal: {member.fitnessGoals}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setWorkoutForm(prev => ({ ...prev, memberId: member.id, title: `${member.fullName}'s Strength Progression` }));
                          setIsWorkoutModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs"
                      >
                        Program
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Workout Plans */}
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
                  <h4 className="font-bold text-sm text-[#172033]">Workout Programs</h4>
                  <span className="text-xs font-mono text-[#5B6475]">{workouts.length} Active</span>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {workouts.map(wo => (
                    <div key={wo.id} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-[#172033]">{wo.title}</div>
                          <div className="text-[11px] text-[#1D4ED8] font-semibold">Client: {wo.memberName} ({wo.memberId})</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-[#15803D] border border-emerald-200 font-bold">
                          {wo.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#5B6475]">
                        Focus: {wo.focus}
                      </div>

                      <div className="pt-2 border-t border-[#E2E8F0] space-y-1">
                        {wo.exercises.map((ex, i) => (
                          <div key={i} className="flex justify-between text-[11px] text-[#5B6475]">
                            <span>{ex.name}</span>
                            <span className="font-mono text-[#172033] font-semibold">{ex.sets} sets × {ex.reps} {ex.weight ? `(${ex.weight})` : ''}</span>
                          </div>
                        ))}
                      </div>

                      {wo.coachNotes && (
                        <div className="text-[10px] text-[#5B6475] bg-white p-2 rounded border border-[#E2E8F0]">
                          <strong className="text-[#172033]">Coach:</strong> {wo.coachNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 4: MEMBER PORTAL & INTERACTIVE PAYMENT DEMO (FEATURE 1 & 2)
        ========================================================================= */}
        {currentUser.role === 'MEMBER' && currentMemberRecord && (
          <div className="space-y-6">
            
            {/* Member Profile Overview Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <img 
                  src={currentMemberRecord.photoUrl} 
                  alt={currentMemberRecord.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 shadow-sm" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#172033]">{currentMemberRecord.fullName}</h3>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      currentMemberRecord.status === 'Active' ? 'bg-emerald-50 text-[#15803D] border border-emerald-200' :
                      currentMemberRecord.status === 'Expiring Soon' ? 'bg-amber-50 text-[#B45309] border border-amber-200' :
                      currentMemberRecord.status === 'Unpaid' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                      'bg-rose-50 text-[#B91C1C] border border-rose-200'
                    }`}>
                      {currentMemberRecord.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#5B6475] mt-1">
                    Member ID: <strong className="text-[#172033]">{currentMemberRecord.id}</strong> • Branch: {currentMemberRecord.branch}
                  </div>
                  <div className="text-xs text-[#70798A] mt-0.5">
                    Contact: {currentMemberRecord.mobile} • {currentMemberRecord.email}
                  </div>
                </div>
              </div>

              {/* Outstanding dues / Renewal callout */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPaymentDemoOpen(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Launch Payment Demo Flow</span>
                </button>
              </div>
            </div>

            {/* Membership Details & Payment History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* My Membership Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-sm">
                <div className="border-b border-[#E2E8F0] pb-3 flex justify-between items-center">
                  <h4 className="font-bold text-sm text-[#172033]">Current Membership Subscription</h4>
                  <span className="text-xs font-mono font-bold text-[#1D4ED8]">{currentMemberRecord.planName}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                  <div>
                    <span className="text-[#70798A] block font-semibold">Start Date:</span>
                    <span className="font-mono text-[#172033] font-medium">{currentMemberRecord.startDate}</span>
                  </div>
                  <div>
                    <span className="text-[#70798A] block font-semibold">Expiry Date:</span>
                    <span className="font-mono text-[#15803D] font-bold">{currentMemberRecord.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-[#70798A] block font-semibold">Biometric Status:</span>
                    <span className="text-[#172033]">{currentMemberRecord.biometricEnrolled ? 'Enrolled (ZKTECO)' : 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-[#70798A] block font-semibold">Assigned Coach:</span>
                    <span className="text-[#172033]">{currentMemberRecord.assignedTrainerName || 'Alex Chen'}</span>
                  </div>
                </div>

                {currentMemberRecord.fitnessGoals && (
                  <div className="text-xs text-[#5B6475] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                    <span className="font-bold text-[#172033] block mb-0.5">My Fitness Goals:</span>
                    {currentMemberRecord.fitnessGoals}
                  </div>
                )}
              </div>

              {/* My Invoices & Interactive Receipts */}
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-sm">
                <div className="border-b border-[#E2E8F0] pb-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-[#172033]">My Payment Records & Receipts</h4>
                    <span className="text-[11px] text-[#5B6475] font-mono">Demo Invoices & Simulated Receipts</span>
                  </div>
                  <span className="text-xs font-mono text-[#5B6475]">{currentMemberInvoices.length} Invoices</span>
                </div>

                <div className="space-y-3">
                  {currentMemberInvoices.map(inv => (
                    <div key={inv.id} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#172033]">{inv.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            inv.status === 'DEMO PAID' || inv.status === 'Paid' ? 'bg-emerald-50 text-[#15803D] border border-emerald-200' :
                            inv.status === 'PENDING' || inv.status === 'Partial' ? 'bg-amber-50 text-[#B45309] border border-amber-200' :
                            'bg-rose-50 text-[#B91C1C] border border-rose-200'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5B6475] mt-1">
                          Amount: ₹{inv.total.toLocaleString('en-IN')} • Method: {inv.paymentMethod || 'Online Gateway'}
                        </div>
                        {inv.demoTransactionId && (
                          <div className="text-[10px] text-[#70798A] font-mono mt-0.5">
                            Txn: {inv.demoTransactionId}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {inv.balanceDue > 0 && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsPaymentDemoOpen(true);
                            }}
                            className="px-3 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                          >
                            Pay Demo
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#172033] rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                        >
                          View Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* My Assigned Workouts */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-4 shadow-sm">
              <div className="border-b border-[#E2E8F0] pb-3 flex justify-between items-center">
                <h4 className="font-bold text-sm text-[#172033]">Personalized Workout Programming</h4>
                <span className="text-xs font-mono font-bold text-[#1D4ED8]">Assigned by Head Coach</span>
              </div>

              <div className="space-y-4">
                {workouts.filter(w => w.memberId === currentMemberRecord.id).map(wo => (
                  <div key={wo.id} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-[#172033] text-sm">{wo.title}</h5>
                        <p className="text-xs text-[#5B6475]">{wo.focus}</p>
                      </div>
                      <span className="text-xs font-mono text-[#70798A]">Updated {wo.updatedAt}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                      {wo.exercises.map((ex, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-lg border border-[#E2E8F0] flex justify-between items-center shadow-xs">
                          <span className="font-semibold text-[#172033]">{ex.name}</span>
                          <span className="font-mono text-[#1D4ED8] font-bold">{ex.sets} × {ex.reps} {ex.weight ? `(${ex.weight})` : ''}</span>
                        </div>
                      ))}
                    </div>

                    {wo.coachNotes && (
                      <div className="p-2.5 bg-white rounded-lg text-xs text-[#5B6475] border border-[#E2E8F0]">
                        <strong className="text-[#172033] block text-[11px] mb-0.5">Coach's Instructions:</strong>
                        {wo.coachNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 5: DEMO PAYMENT HISTORY (FEATURE 3)
        ========================================================================= */}
        {permissions.canViewFinances && activeTab === 'billing' && (
          <div className="space-y-6">
            
            {/* Header & KPI Summary */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#172033]">Demo Payment History & Transaction Ledger</h3>
                <p className="text-xs text-[#5B6475]">
                  Search, filter, and inspect simulated payment transactions. Clearly disclaimed as demonstration records.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPaymentDemoOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Simulate New Payment</span>
                </button>
              </div>
            </div>

            {/* Summary KPI Cards for Demo Collections */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
                <span className="text-xs text-[#5B6475] font-semibold uppercase font-mono">Simulated Collections (Total)</span>
                <div className="text-2xl font-bold text-[#15803D] mt-1 font-mono">
                  ₹{metrics.paymentsCollected.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-[#70798A] mt-0.5">*Simulated demo collections only</div>
              </div>

              <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
                <span className="text-xs text-[#B45309] font-bold uppercase font-mono">Pending Demo Invoices</span>
                <div className="text-2xl font-bold text-[#B45309] mt-1 font-mono">
                  {invoices.filter(i => i.status === 'PENDING' || i.status === 'Partial').length}
                </div>
                <div className="text-[10px] text-[#70798A] mt-0.5">Awaiting simulated clearance</div>
              </div>

              <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
                <span className="text-xs text-[#B91C1C] font-bold uppercase font-mono">Simulated Failed Payments</span>
                <div className="text-2xl font-bold text-[#B91C1C] mt-1 font-mono">
                  {invoices.filter(i => i.status === 'DEMO PAYMENT FAILED').length}
                </div>
                <div className="text-[10px] text-[#70798A] mt-0.5">Demonstrates rejection response</div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#70798A]" />
                  <input
                    type="text"
                    placeholder="Search by Txn ID, Member Name, or Invoice..."
                    value={invoiceSearchQuery}
                    onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#172033] placeholder-[#70798A] focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#70798A]">Status:</span>
                  <select
                    value={invoiceStatusFilter}
                    onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#172033] focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="DEMO PAID">DEMO PAID</option>
                    <option value="PENDING">PENDING</option>
                    <option value="DEMO PAYMENT FAILED">DEMO PAYMENT FAILED</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#70798A]">Method:</span>
                  <select
                    value={invoiceMethodFilter}
                    onChange={(e) => setInvoiceMethodFilter(e.target.value)}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#172033] focus:outline-none"
                  >
                    <option value="All">All Methods</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Online Gateway">Online Gateway</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8FAFC] text-[#5B6475] uppercase font-mono text-[10px] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-4 font-bold">Demo Txn ID</th>
                    <th className="py-3 px-4 font-bold">Member Name</th>
                    <th className="py-3 px-4 font-bold">Plan Details</th>
                    <th className="py-3 px-4 font-bold">Amount (₹)</th>
                    <th className="py-3 px-4 font-bold">Method</th>
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-xs text-[#70798A]">
                        No demo payment records found matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#172033]">
                          {inv.demoTransactionId || `DEMO-TXN-${inv.id.replace('DEMO-INV-', '')}`}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#172033]">{inv.memberName}</div>
                          <div className="text-[10px] text-[#70798A] font-mono">{inv.memberId}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#172033]">{inv.planName || inv.items[0]?.description}</div>
                          <div className="text-[10px] text-[#70798A] font-mono">Invoice #{inv.id}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#172033]">
                          ₹{inv.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[#172033] font-medium font-mono text-[10px]">
                            {inv.paymentMethod || 'Online Gateway'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#5B6475]">{inv.date}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            inv.status === 'DEMO PAID' || inv.status === 'Paid' ? 'bg-emerald-50 text-[#15803D] border border-emerald-200' :
                            inv.status === 'PENDING' || inv.status === 'Partial' ? 'bg-amber-50 text-[#B45309] border border-amber-200' :
                            'bg-rose-50 text-[#B91C1C] border border-rose-200'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#172033] rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 6: MEMBERSHIP PLANS & EDITABLE DEMO PRICING (FEATURE 2)
        ========================================================================= */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#172033]">Membership Plans & Interactive Pricing Demo</h3>
                <p className="text-xs text-[#5B6475]">
                  Realistic prices in Indian Rupees (₹). Click "Edit Plan" to demonstrate custom pricing for the gym owner.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPaymentDemoOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Simulate Plan Checkout</span>
                </button>
              </div>
            </div>

            {/* 4 Plans Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map(plan => (
                <div key={plan.id} className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between relative group hover:border-blue-300 transition-all">
                  
                  {plan.id === 'plan-12m' && (
                    <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#1D4ED8] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      Best Value Demo
                    </span>
                  )}

                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono font-semibold text-[#5B6475] uppercase">{plan.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#1D4ED8] border border-blue-200">
                        {plan.durationMonths} Months
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#172033]">{plan.name}</h4>
                    
                    <div className="mt-3">
                      <span className="text-2xl font-bold text-[#172033] font-mono">₹{plan.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-[#70798A] block mt-0.5">+ 18% GST (₹{Math.round(plan.price * 0.18).toLocaleString('en-IN')})</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-2">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#5B6475]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingPlan({ ...plan });
                        setIsEditPlanModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#172033] text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#5B6475]" />
                      <span>Edit Price</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedInvoice(null);
                        setIsPaymentDemoOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Simulate ↗
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 7: GYM FACILITY GALLERY & REAL PHOTOGRAPHY (FEATURE 5)
        ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#172033]">Gym Facility & Equipment Showcase Gallery</h3>
                <p className="text-xs text-[#5B6475]">
                  High-fidelity facility assets, commercial lifting zones, and recovery suites ready for client presentation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_GALLERY_ITEMS.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedGalleryItem(item)}
                  className="group bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 text-[#172033] text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-sm text-[#172033] group-hover:text-[#1D4ED8] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#5B6475] line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 8: TRAINER ROSTER & PRESET PHOTO SELECTOR (FEATURE 5)
        ========================================================================= */}
        {activeTab === 'trainers' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#172033]">Certified Head Trainers & Coach Profiles</h3>
              <p className="text-xs text-[#5B6475]">
                Complete profiles with qualifications, specialties, and demo photo preset replacement options.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainers.map(tr => (
                <div key={tr.id} className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm flex flex-col sm:flex-row gap-5 items-start">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-200 bg-slate-100 shrink-0 shadow-sm relative group">
                    <img src={tr.photoUrl} alt={tr.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-base text-[#172033]">{tr.name}</h4>
                        <span className="text-xs font-semibold text-[#1D4ED8] block">{tr.specialisation}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-[#5B6475]">
                        {tr.experienceYears} Yrs Exp
                      </span>
                    </div>

                    <p className="text-xs text-[#5B6475]">
                      {tr.bio}
                    </p>

                    {tr.certifications && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tr.certifications.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono text-[#172033]">
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 text-[11px] text-[#70798A] font-mono border-t border-[#E2E8F0]">
                      Active Demo Clients: <strong className="text-[#172033]">{tr.assignedMemberIds.length} Members</strong> • Contact: {tr.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 9: MEMBERS MANAGEMENT TABLE (FEATURE 4)
        ========================================================================= */}
        {permissions.canManageMembers && activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#172033]">Member Administration & Roster</h3>
                <p className="text-xs text-[#5B6475]">
                  Add, edit, remove, and simulate membership renewals with instant expiry updates.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMemberModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Sample Member</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#70798A]" />
                  <input
                    type="text"
                    placeholder="Search by name, mobile, or Member ID..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#172033] placeholder-[#70798A] focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#70798A]">Filter Status:</span>
                <select
                  value={memberStatusFilter}
                  onChange={(e) => setMemberStatusFilter(e.target.value)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#172033] focus:outline-none"
                >
                  <option value="All">All Statuses ({members.length})</option>
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Unpaid">Unpaid Dues</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8FAFC] text-[#5B6475] uppercase font-mono text-[10px] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-4 font-bold">Member Info</th>
                    <th className="py-3 px-4 font-bold">Contact</th>
                    <th className="py-3 px-4 font-bold">Plan & Duration</th>
                    <th className="py-3 px-4 font-bold">Expiry Date</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 text-right font-bold">Manage & Renew</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#70798A]">
                        No members found matching "{memberSearchQuery}".
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map(m => (
                      <tr key={m.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img src={m.photoUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-[#E2E8F0]" />
                            <div>
                              <div className="font-bold text-[#172033]">{m.fullName}</div>
                              <div className="text-[10px] font-mono text-[#70798A]">{m.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#5B6475]">{m.mobile}</td>
                        <td className="py-3.5 px-4">
                          <div className="text-[#172033] font-semibold">{m.planName}</div>
                          <div className="text-[10px] text-[#70798A]">Branch: {m.branch}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-[#172033]">
                          {m.expiryDate}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.status === 'Active' ? 'bg-emerald-50 text-[#15803D] border border-emerald-200' :
                            m.status === 'Expiring Soon' ? 'bg-amber-50 text-[#B45309] border border-amber-200' :
                            m.status === 'Unpaid' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                            'bg-rose-50 text-[#B91C1C] border border-rose-200'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSimulateRenewal(m, 3)}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#1D4ED8] border border-blue-200 rounded text-[11px] font-bold cursor-pointer"
                              title="Simulate 3-Month Renewal"
                            >
                              Renew +3M
                            </button>
                            <button
                              onClick={() => setSelectedMemberForDrawer(m)}
                              className="px-2.5 py-1 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#172033] rounded text-[11px] font-semibold shadow-xs cursor-pointer"
                            >
                              Profile
                            </button>
                            <button
                              onClick={() => setMemberToEdit(m)}
                              className="p-1 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#5B6475] rounded text-xs cursor-pointer"
                              title="Edit Member"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(m)}
                              className="p-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-[#B91C1C] rounded text-xs cursor-pointer"
                              title="Delete Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          INTERACTIVE DEMO PAYMENT MODAL (FEATURE 2)
      ========================================================================= */}
      <DemoPaymentModal
        isOpen={isPaymentDemoOpen}
        onClose={() => setIsPaymentDemoOpen(false)}
        member={currentMemberRecord}
        plans={plans}
        initialInvoice={selectedInvoice}
        onSimulateSuccess={(updatedInv, updatedMember) => {
          setInvoices(prev => [updatedInv, ...prev.filter(i => i.id !== updatedInv.id)]);
          setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
          addToast('success', 'Demo Payment Cleared', `Transaction ${updatedInv.demoTransactionId} marked as DEMO PAID.`);
        }}
        onSimulateFailure={(failedInv) => {
          setInvoices(prev => [failedInv, ...prev.filter(i => i.id !== failedInv.id)]);
          addToast('error', 'Payment Simulation Failed', 'Simulated failure recorded as DEMO PAYMENT FAILED.');
        }}
      />

      {/* ================= EDIT PLAN MODAL ================= */}
      {isEditPlanModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl text-[#172033] shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsEditPlanModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#70798A] hover:text-[#172033]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#172033] mb-4">
              Edit Demo Plan: {editingPlan.name}
            </h3>

            <form onSubmit={handleSavePlanPrice} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Plan Name</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Price in Indian Rupees (₹)</label>
                <input
                  type="number"
                  min={500}
                  step={100}
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033] font-mono text-sm focus:outline-none focus:border-[#1D4ED8]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Duration (Months)</label>
                <input
                  type="number"
                  min={1}
                  max={36}
                  value={editingPlan.durationMonths}
                  onChange={(e) => setEditingPlan({ ...editingPlan, durationMonths: Number(e.target.value) })}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033] font-mono focus:outline-none focus:border-[#1D4ED8]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsEditPlanModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#5B6475] hover:text-[#172033]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Update Plan in Demo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT MEMBER MODAL ================= */}
      {memberToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl text-[#172033] shadow-2xl p-6 relative">
            <button 
              onClick={() => setMemberToEdit(null)}
              className="absolute top-4 right-4 p-1 text-[#70798A] hover:text-[#172033]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#172033] mb-4">
              Edit Sample Member: {memberToEdit.fullName}
            </h3>

            <form onSubmit={handleSaveMemberEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={memberToEdit.fullName}
                  onChange={(e) => setMemberToEdit({ ...memberToEdit, fullName: e.target.value })}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Mobile Number</label>
                <input
                  type="text"
                  value={memberToEdit.mobile}
                  onChange={(e) => setMemberToEdit({ ...memberToEdit, mobile: e.target.value })}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Membership Plan</label>
                <select
                  value={memberToEdit.planId}
                  onChange={(e) => {
                    const selPlan = plans.find(p => p.id === e.target.value);
                    setMemberToEdit({
                      ...memberToEdit,
                      planId: e.target.value,
                      planName: selPlan?.name || memberToEdit.planName
                    });
                  }}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033]"
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Expiry Date</label>
                <input
                  type="date"
                  value={memberToEdit.expiryDate}
                  onChange={(e) => setMemberToEdit({ ...memberToEdit, expiryDate: e.target.value })}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033]"
                />
              </div>

              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Status</label>
                <select
                  value={memberToEdit.status}
                  onChange={(e) => setMemberToEdit({ ...memberToEdit, status: e.target.value as any })}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033]"
                >
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setMemberToEdit(null)}
                  className="px-4 py-2 text-xs text-[#5B6475]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= GALLERY LIGHTBOX MODAL (FEATURE 5) ================= */}
      {selectedGalleryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setSelectedGalleryItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/60 text-white hover:bg-black z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img 
              src={selectedGalleryItem.image} 
              alt={selectedGalleryItem.title} 
              className="w-full max-h-96 object-cover" 
            />

            <div className="p-6 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D4ED8] border border-blue-200 text-xs font-bold uppercase tracking-wider">
                {selectedGalleryItem.category}
              </span>
              <h3 className="text-xl font-bold text-[#172033]">{selectedGalleryItem.title}</h3>
              <p className="text-xs text-[#5B6475]">{selectedGalleryItem.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRMATION DIALOG MODAL (FEATURE 6) ================= */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-[#B91C1C] flex items-center justify-center border border-rose-200">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <h4 className="font-bold text-base text-[#172033]">{confirmDialog.title}</h4>
              <p className="text-xs text-[#5B6475] mt-1">{confirmDialog.message}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-semibold text-[#5B6475] hover:text-[#172033] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOAST NOTIFICATIONS (FEATURE 6) ================= */}
      <div className="fixed bottom-6 left-6 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === 'success' ? 'bg-white border-emerald-300 text-[#172033]' :
              toast.type === 'error' ? 'bg-white border-rose-300 text-[#172033]' :
              'bg-white border-blue-300 text-[#172033]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-[#15803D] mt-0.5 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#B91C1C] mt-0.5 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#1D4ED8] mt-0.5 shrink-0" />}
              <div>
                <span className="font-bold text-xs block text-[#172033]">{toast.title}</span>
                <span className="text-[11px] text-[#5B6475]">{toast.message}</span>
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#70798A] hover:text-[#172033] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Member Profile Drawer Modal */}
      {selectedMemberForDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl text-[#172033] shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedMemberForDrawer(null)}
              className="absolute top-4 right-4 p-1 text-[#70798A] hover:text-[#172033]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedMemberForDrawer.photoUrl}
                alt=""
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 shadow-sm"
              />
              <div>
                <h3 className="text-xl font-bold text-[#172033]">{selectedMemberForDrawer.fullName}</h3>
                <span className="text-xs font-mono text-[#5B6475]">{selectedMemberForDrawer.id} • {selectedMemberForDrawer.branch}</span>
                <div className="mt-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedMemberForDrawer.status === 'Active' ? 'bg-emerald-50 text-[#15803D] border border-emerald-200' :
                    selectedMemberForDrawer.status === 'Expiring Soon' ? 'bg-amber-50 text-[#B45309] border border-amber-200' :
                    'bg-rose-50 text-[#B91C1C] border border-rose-200'
                  }`}>
                    {selectedMemberForDrawer.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[#70798A] block font-semibold">Mobile</span>
                  <span className="font-mono text-[#172033]">{selectedMemberForDrawer.mobile}</span>
                </div>
                <div>
                  <span className="text-[#70798A] block font-semibold">Email</span>
                  <span className="text-[#172033]">{selectedMemberForDrawer.email || '—'}</span>
                </div>
                <div>
                  <span className="text-[#70798A] block font-semibold">Plan</span>
                  <span className="font-bold text-[#1D4ED8]">{selectedMemberForDrawer.planName}</span>
                </div>
                <div>
                  <span className="text-[#70798A] block font-semibold">Expiry Date</span>
                  <span className="font-mono text-[#172033]">{selectedMemberForDrawer.expiryDate}</span>
                </div>
              </div>

              {selectedMemberForDrawer.emergencyContact && (
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[#70798A] block font-semibold mb-1">Emergency Contact</span>
                  <div className="text-[#172033]">
                    {selectedMemberForDrawer.emergencyContact.name} ({selectedMemberForDrawer.emergencyContact.relationship}) — {selectedMemberForDrawer.emergencyContact.phone}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-end gap-2">
              <button
                onClick={() => {
                  handleSimulateRenewal(selectedMemberForDrawer, 3);
                  setSelectedMemberForDrawer(null);
                }}
                className="px-4 py-2 bg-blue-50 text-[#1D4ED8] border border-blue-200 hover:bg-blue-100 font-bold text-xs rounded-xl cursor-pointer"
              >
                Simulate 3M Renewal
              </button>
              <button
                onClick={() => setSelectedMemberForDrawer(null)}
                className="px-5 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Supporting Modals */}
      <BiometricModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        members={members}
        onLogEntry={(log) => setBiometricLogs(prev => [log, ...prev])}
        deviceOnline={deviceOnline}
        setDeviceOnline={setDeviceOnline}
      />

      <InvoiceModal
        isOpen={!!selectedInvoice && !isPaymentDemoOpen}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
        onRecordPayment={async (invoiceId, amount, method, ref) => {
          setInvoices(prev => prev.map(inv => inv.id === invoiceId ? {
            ...inv,
            status: 'DEMO PAID',
            amountPaid: inv.total,
            balanceDue: 0,
            paymentMethod: method,
            paymentReference: ref
          } : inv));
          setSelectedInvoice(null);
          addToast('success', 'Payment Recorded (Demo)', `Invoice ${invoiceId} marked as DEMO PAID.`);
        }}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSaveMember={(newMember) => {
          setMembers(prev => [newMember, ...prev]);
          addToast('success', 'Member Registered', `Added ${newMember.fullName} (${newMember.id}) to demo roster.`);
        }}
        existingMembers={members}
        plans={plans}
      />


      {/* Trainer Workout Plan Creation Modal */}
      {isWorkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl text-[#172033] shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsWorkoutModalOpen(false)}
              className="absolute top-5 right-5 text-[#70798A] hover:text-[#172033]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#172033] uppercase font-archivo-wide mb-4">
              Program Workout For Assigned Client
            </h3>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const exercises = workoutForm.exercisesText.split('\n').filter(Boolean).map(line => ({
                  name: line.trim(),
                  sets: '3',
                  reps: '10'
                }));
                const newWo: WorkoutPlan = {
                  id: `WO-2026-${Math.floor(100 + Math.random() * 900)}`,
                  memberId: workoutForm.memberId,
                  memberName: members.find(m => m.id === workoutForm.memberId)?.fullName || 'Member',
                  trainerId: currentUser.trainerId || 'TR-ALEX',
                  trainerName: currentUser.name,
                  title: workoutForm.title,
                  focus: workoutForm.focus,
                  exercises,
                  updatedAt: new Date().toISOString().split('T')[0],
                  status: 'Active',
                  coachNotes: workoutForm.coachNotes
                };
                setWorkouts(prev => [newWo, ...prev]);
                setIsWorkoutModalOpen(false);
                addToast('success', 'Workout Programmed', `Assigned "${workoutForm.title}" to ${newWo.memberName}.`);
              }} 
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Select Client</label>
                <select
                  value={workoutForm.memberId}
                  onChange={(e) => setWorkoutForm({...workoutForm, memberId: e.target.value})}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Workout Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Posterior Chain & Deadlift Specialization"
                  value={workoutForm.title}
                  onChange={(e) => setWorkoutForm({...workoutForm, title: e.target.value})}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Focus Area</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Progressive overload on compound barbell lifts"
                  value={workoutForm.focus}
                  onChange={(e) => setWorkoutForm({...workoutForm, focus: e.target.value})}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Exercises (1 per line)</label>
                <textarea
                  rows={4}
                  value={workoutForm.exercisesText}
                  onChange={(e) => setWorkoutForm({...workoutForm, exercisesText: e.target.value})}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033] font-mono text-[11px] focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-[#5B6475] mb-1 font-semibold">Coach Notes & Biomechanics Cues</label>
                <input
                  type="text"
                  placeholder="e.g. Ensure full hip lockout and bracing before unrack"
                  value={workoutForm.coachNotes}
                  onChange={(e) => setWorkoutForm({...workoutForm, coachNotes: e.target.value})}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWorkoutModalOpen(false)}
                  className="px-4 py-2 text-[#5B6475] hover:text-[#172033] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Assign to Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
