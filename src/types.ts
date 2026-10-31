export type UserRole = 'OWNER / ADMIN' | 'CLUB MANAGER' | 'TRAINER' | 'MEMBER';

export type MembershipStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'Unpaid' | 'Suspended';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  memberId?: string; // Bound Member ID for Member role
  trainerId?: string; // Bound Trainer ID for Trainer role
  branch?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface TrainerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  specialisation: string;
  branch: string;
  workingHours: string;
  experienceYears?: number;
  certifications?: string[];
  bio?: string;
  assignedMemberIds: string[];
}

export interface WorkoutExercise {
  name: string;
  sets: string;
  reps: string;
  weight?: string;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  title: string;
  focus: string;
  exercises: WorkoutExercise[];
  updatedAt: string;
  status: 'Active' | 'Completed' | 'Archived';
  coachNotes?: string;
}

export interface TrainingProgressRecord {
  id: string;
  memberId: string;
  date: string;
  weightKg?: number;
  squatKg?: number;
  benchKg?: number;
  deadliftKg?: number;
  notes: string;
  loggedBy: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  registrationFee: number;
  taxPercent: number; // e.g. 18% GST
  features: string[];
}

export interface Member {
  id: string; // e.g. WFIT-2026-001
  fullName: string;
  mobile: string;
  email?: string;
  dateOfBirth: string;
  photoUrl: string;
  registrationDate: string;
  branch: string;
  status: MembershipStatus;
  planId: string;
  planName: string;
  startDate: string;
  expiryDate: string;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  fitnessGoals?: string;
  biometricEnrolled: boolean;
  biometricDeviceId?: string;
  biometricTemplateHash?: string;
  notes?: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'UPI/GPay' | 'Card' | 'Bank Transfer' | 'Online Gateway';

export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid' | 'Refunded' | 'DEMO PAID' | 'DEMO PAYMENT FAILED' | 'PENDING';

export interface Invoice {
  id: string; // e.g. INV-2026-1001 or DEMO-INV-2026-1001
  demoTransactionId?: string;
  memberId: string;
  memberName: string;
  planId?: string;
  planName?: string;
  date: string;
  dueDate: string;
  items: {
    description: string;
    amount: number;
  }[];
  subtotal: number;
  discount: number;
  discountReason?: string;
  tax: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  branch: string;
  paidAt?: string;
  demoFailureReason?: string;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export type LeadStage = 
  | 'New enquiry'
  | 'Contacted'
  | 'Visit / trial scheduled'
  | 'Visited / trial completed'
  | 'Follow-up pending'
  | 'Converted'
  | 'Lost';

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  source: 'Walk-in' | 'Instagram' | 'WhatsApp' | 'Website' | 'Referral';
  interestedProduct: 'Gym Membership' | 'Personal Training' | 'Boxing' | 'Group Classes';
  assignedExecutive: string;
  stage: LeadStage;
  enquiryDate: string;
  lastContactDate: string;
  nextFollowUpDate: string;
  trialDate?: string;
  notes: string;
  lostReason?: string;
  convertedMemberId?: string;
}

export interface BiometricLog {
  id: string;
  timestamp: string;
  memberId: string;
  memberName: string;
  device: string;
  scanType: 'Fingerprint' | 'Face ID' | 'Manual Override';
  result: 'GRANTED' | 'DENIED';
  denialReason?: string;
  staffOverrideId?: string;
  staffReason?: string;
}

export interface PTSession {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  packageName: string;
  totalSessions: number;
  completedSessions: number;
  remainingSessions: number;
  price?: number; // Only returned to Admin / Authorized manager
  commissionRate?: number; // Only returned to Admin
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Completed' | 'Expired';
}

export interface RenewalTask {
  id: string;
  memberId: string;
  memberName: string;
  planName: string;
  expiryDate: string;
  daysRemaining: number;
  lastReminderSentDate?: string;
  reminderType?: '7 Days Before' | '3 Days Before' | '1 Day Before' | 'On Expiry' | 'Overdue';
  status: 'Pending' | 'Sent' | 'Failed' | 'Renewed';
  assignedStaff: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  details: string;
  ipAddress?: string;
  status?: 'SUCCESS' | 'DENIED' | 'FAILED';
}

export interface SystemSettings {
  managerPaymentAccessEnabled: boolean;
  gymName: string;
  primaryBranch: string;
  allowSelfRegistration: boolean;
  biometricEnforcementActive: boolean;
}
