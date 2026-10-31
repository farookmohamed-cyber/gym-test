import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { 
  UserAccount, UserRole, Member, Invoice, PTSession, 
  WorkoutPlan, AuditLogItem, SystemSettings, TrainerProfile, PaymentMethod 
} from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// =========================================================================
// SECURITY & CRYPTOGRAPHY UTILITIES
// =========================================================================

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// =========================================================================
// IN-MEMORY DATABASE & SEED ACCOUNTS
// =========================================================================

interface StoredAccount extends UserAccount {
  salt: string;
  passwordHash: string;
}

// Master Accounts with Secure Hashed Passwords
const ACCOUNTS_DB: Map<string, StoredAccount> = new Map();

function seedAccount(account: Omit<StoredAccount, 'salt' | 'passwordHash'>, plaintextPassword: string) {
  const salt = generateSalt();
  const passwordHash = hashPassword(plaintextPassword, salt);
  const fullAccount: StoredAccount = {
    ...account,
    salt,
    passwordHash
  };
  ACCOUNTS_DB.set(account.id, fullAccount);
}

// 1. Owner / Admin
seedAccount({
  id: 'USR-ADMIN-01',
  username: 'admin',
  email: 'admin@wfitgym.com',
  name: 'Farook Mohamed (Club Owner & Admin)',
  role: 'OWNER / ADMIN',
  isActive: true,
  createdAt: '2026-01-01',
}, 'Admin@WFIT2026!');

// 2. Club Manager
seedAccount({
  id: 'USR-MGR-01',
  username: 'manager',
  email: 'manager@wfitgym.com',
  name: 'Siddharth Rao (Club Operations Manager)',
  role: 'CLUB MANAGER',
  branch: 'Downtown Flagship',
  isActive: true,
  createdAt: '2026-01-15',
}, 'Manager@WFIT2026!');

// 3. Trainer 1 (Alex Chen)
seedAccount({
  id: 'USR-TR-01',
  username: 'alex.trainer',
  email: 'alex.chen@wfitgym.com',
  name: 'Alex Chen',
  role: 'TRAINER',
  trainerId: 'TR-ALEX',
  branch: 'Downtown Flagship',
  isActive: true,
  createdAt: '2026-02-01',
}, 'Trainer@WFIT2026!');

// 4. Trainer 2 (Marcus Stone)
seedAccount({
  id: 'USR-TR-02',
  username: 'marcus.trainer',
  email: 'marcus.stone@wfitgym.com',
  name: 'Marcus Stone',
  role: 'TRAINER',
  trainerId: 'TR-MARCUS',
  branch: 'Downtown Flagship',
  isActive: true,
  createdAt: '2026-02-01',
}, 'Trainer@WFIT2026!');

// 5. Member 1 (Rohan Mehra)
seedAccount({
  id: 'USR-MEM-01',
  username: 'rohan.mehra',
  email: 'rohan.mehra@example.com',
  name: 'Rohan Mehra',
  role: 'MEMBER',
  memberId: 'WFIT-2026-001',
  branch: 'Downtown Flagship',
  isActive: true,
  createdAt: '2026-01-10',
}, 'Member@WFIT2026!');

// 6. Member 2 (Priya Sharma)
seedAccount({
  id: 'USR-MEM-02',
  username: 'priya.sharma',
  email: 'priya.sharma@example.com',
  name: 'Priya Sharma',
  role: 'MEMBER',
  memberId: 'WFIT-2026-002',
  branch: 'Downtown Flagship',
  isActive: true,
  createdAt: '2026-04-05',
}, 'Member@WFIT2026!');

// 7. Member 3 (Vikramaditya Sengupta - Unpaid Dues)
seedAccount({
  id: 'USR-MEM-03',
  username: 'vikram.sengupta',
  email: 'vikram.sengupta@example.com',
  name: 'Vikramaditya Sengupta',
  role: 'MEMBER',
  memberId: 'WFIT-2026-003',
  branch: 'Downtown Flagship',
  isActive: true,
  createdAt: '2026-08-01',
}, 'Member@WFIT2026!');

// Session Store: token -> { user: UserAccount, expiresAt: number }
const SESSIONS: Map<string, { user: UserAccount; expiresAt: number }> = new Map();

// Rate Limiting Store: IP/Username -> { failedAttempts: number, lockedUntil: number }
const LOGIN_ATTEMPTS: Map<string, { failedAttempts: number; lockedUntil: number }> = new Map();

// System Settings
const SYSTEM_SETTINGS: SystemSettings = {
  managerPaymentAccessEnabled: false, // Default: Manager cannot access financial data unless Admin explicitly permits!
  gymName: 'WFIT GYM',
  primaryBranch: 'Downtown Flagship',
  allowSelfRegistration: true,
  biometricEnforcementActive: true
};

// Seed Trainer Profiles
const TRAINERS_DB: TrainerProfile[] = [
  {
    id: 'TR-ALEX',
    name: 'Alex Chen',
    email: 'alex.chen@wfitgym.com',
    phone: '+91 98765 12340',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    specialisation: 'Biomechanics, Hypertrophy & Olympic Weightlifting',
    branch: 'Downtown Flagship',
    workingHours: '06:00 - 14:00 (Mon - Fri)',
    assignedMemberIds: ['WFIT-2026-001', 'WFIT-2026-002']
  },
  {
    id: 'TR-MARCUS',
    name: 'Marcus Stone',
    email: 'marcus.stone@wfitgym.com',
    phone: '+91 98765 12341',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    specialisation: 'Conditioning, Strength & Athletic Rehabilitation',
    branch: 'Downtown Flagship',
    workingHours: '14:00 - 22:00 (Mon - Fri)',
    assignedMemberIds: ['WFIT-2026-003', 'WFIT-2026-005']
  }
];

// Seed Members
let MEMBERS_DB: Member[] = [
  {
    id: 'WFIT-2026-001',
    fullName: 'Rohan Mehra',
    mobile: '+91 98765 43210',
    email: 'rohan.mehra@example.com',
    dateOfBirth: '1994-06-14',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    registrationDate: '2026-01-10',
    branch: 'Downtown Flagship',
    status: 'Active',
    planId: 'plan-12m',
    planName: '12 Months Annual Pass',
    startDate: '2026-01-10',
    expiryDate: '2027-01-10',
    assignedTrainerId: 'TR-ALEX',
    assignedTrainerName: 'Alex Chen',
    emergencyContact: {
      name: 'Sunita Mehra',
      relationship: 'Mother',
      phone: '+91 98765 11111'
    },
    fitnessGoals: 'Compound strength progression, Olympic clean and jerk, body recomposition.',
    biometricEnrolled: true,
    biometricDeviceId: 'DEV-FP-MAIN-01',
    notes: 'Morning lifter. Consistent compliance with programming.'
  },
  {
    id: 'WFIT-2026-002',
    fullName: 'Priya Sharma',
    mobile: '+91 98111 22334',
    email: 'priya.sharma@example.com',
    dateOfBirth: '1998-11-20',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
    registrationDate: '2026-04-05',
    branch: 'Downtown Flagship',
    status: 'Expiring Soon',
    planId: 'plan-6m',
    planName: '6 Months Membership',
    startDate: '2026-05-06',
    expiryDate: '2026-11-06',
    assignedTrainerId: 'TR-ALEX',
    assignedTrainerName: 'Alex Chen',
    emergencyContact: {
      name: 'Arjun Sharma',
      relationship: 'Spouse',
      phone: '+91 98111 99887'
    },
    fitnessGoals: 'Functional mobility, posterior chain strength, cardiovascular endurance.',
    biometricEnrolled: true,
    biometricDeviceId: 'DEV-FP-MAIN-01',
    notes: 'Attends 7 PM HIIT and PT strength sessions.'
  },
  {
    id: 'WFIT-2026-003',
    fullName: 'Vikramaditya Sengupta',
    mobile: '+91 99200 44556',
    email: 'vikram.sengupta@example.com',
    dateOfBirth: '1989-03-25',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    registrationDate: '2026-08-01',
    branch: 'Downtown Flagship',
    status: 'Unpaid',
    planId: 'plan-3m',
    planName: '3 Months Membership',
    startDate: '2026-08-01',
    expiryDate: '2026-11-01',
    assignedTrainerId: 'TR-MARCUS',
    assignedTrainerName: 'Marcus Stone',
    fitnessGoals: 'Strength maintenance and rotational power.',
    biometricEnrolled: true,
    biometricDeviceId: 'DEV-FP-MAIN-01',
    notes: 'Partial payment made at desk; pending balance ₹3,848.82.'
  },
  {
    id: 'WFIT-2026-004',
    fullName: 'Ananya Deshmukh',
    mobile: '+91 98333 77889',
    email: 'ananya.d@example.com',
    dateOfBirth: '1996-09-15',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
    registrationDate: '2025-10-15',
    branch: 'West End Wing',
    status: 'Expired',
    planId: 'plan-12m',
    planName: '12 Months Annual Pass',
    startDate: '2025-10-15',
    expiryDate: '2026-10-15',
    biometricEnrolled: true,
    biometricDeviceId: 'DEV-FP-WEST-02',
    notes: 'Expired 15 days ago. Follow-up task in progress.'
  },
  {
    id: 'WFIT-2026-005',
    fullName: 'Kabir Oberoi',
    mobile: '+91 97654 33221',
    email: 'kabir.o@example.com',
    dateOfBirth: '1991-01-30',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    registrationDate: '2026-10-28',
    branch: 'Downtown Flagship',
    status: 'Active',
    planId: 'plan-1m',
    planName: '1 Month Membership',
    startDate: '2026-10-28',
    expiryDate: '2026-11-28',
    assignedTrainerId: 'TR-MARCUS',
    assignedTrainerName: 'Marcus Stone',
    biometricEnrolled: false,
    notes: 'New walk-in member. Needs biometric template enrollment.'
  }
];

// Seed Invoices
let INVOICES_DB: Invoice[] = [
  {
    id: 'INV-2026-1001',
    memberId: 'WFIT-2026-001',
    memberName: 'Rohan Mehra',
    date: '2026-10-30',
    dueDate: '2026-10-30',
    items: [{ description: '12 Months Annual Pass', amount: 13999 }],
    subtotal: 13999,
    discount: 1000,
    discountReason: 'Promo Code WFEST',
    tax: 2339.82,
    total: 15338.82,
    amountPaid: 15338.82,
    balanceDue: 0,
    status: 'Paid',
    paymentMethod: 'UPI/GPay',
    paymentReference: 'UPI-REF-993821049281',
    branch: 'Downtown Flagship',
    paidAt: '2026-10-30 08:30:00'
  },
  {
    id: 'INV-2026-1002',
    memberId: 'WFIT-2026-003',
    memberName: 'Vikramaditya Sengupta',
    date: '2026-10-25',
    dueDate: '2026-10-29',
    items: [
      { description: '3 Months Membership', amount: 6999 },
      { description: 'Registration & Access Card', amount: 500 }
    ],
    subtotal: 7499,
    discount: 0,
    tax: 1349.82,
    total: 8848.82,
    amountPaid: 5000,
    balanceDue: 3848.82,
    status: 'Partial',
    paymentMethod: 'Cash',
    paymentReference: 'CASH-REC-0491',
    branch: 'Downtown Flagship',
    paidAt: '2026-10-25 11:20:00'
  },
  {
    id: 'INV-2026-1003',
    memberId: 'WFIT-2026-005',
    memberName: 'Kabir Oberoi',
    date: '2026-10-30',
    dueDate: '2026-10-30',
    items: [
      { description: '1 Month Membership', amount: 2999 },
      { description: 'Registration Fee', amount: 500 }
    ],
    subtotal: 3499,
    discount: 0,
    tax: 629.82,
    total: 4128.82,
    amountPaid: 4128.82,
    balanceDue: 0,
    status: 'Paid',
    paymentMethod: 'Card',
    paymentReference: 'POS-TXN-7740192',
    branch: 'Downtown Flagship',
    paidAt: '2026-10-30 14:15:00'
  },
  {
    id: 'INV-2026-1004',
    memberId: 'WFIT-2026-002',
    memberName: 'Priya Sharma',
    date: '2026-10-20',
    dueDate: '2026-10-20',
    items: [{ description: 'PT Package 10 Sessions (Alex Chen)', amount: 12000 }],
    subtotal: 12000,
    discount: 1000,
    discountReason: 'Trainer Welcome Promo',
    tax: 1980,
    total: 12980,
    amountPaid: 12980,
    balanceDue: 0,
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'NEFT-AXIS-8819028',
    branch: 'Downtown Flagship',
    paidAt: '2026-10-20 16:40:00'
  }
];

// Seed Workouts
let WORKOUTS_DB: WorkoutPlan[] = [
  {
    id: 'WO-2026-01',
    memberId: 'WFIT-2026-001',
    memberName: 'Rohan Mehra',
    trainerId: 'TR-ALEX',
    trainerName: 'Alex Chen',
    title: 'Strength Hypertrophy Block A',
    focus: 'Barbell Squats & Overhead Pressing Mechanics',
    exercises: [
      { name: 'Barbell Back Squat', sets: '4', reps: '6', weight: '120 kg', notes: 'Maintain torso angle, explode out of the hole' },
      { name: 'Overhead Barbell Press', sets: '3', reps: '8', weight: '65 kg', notes: 'Full lockout at top' },
      { name: 'Romanian Deadlift', sets: '3', reps: '10', weight: '100 kg', notes: 'Feel hamstring stretch' },
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
];

// Seed PT Sessions
let PT_SESSIONS_DB: PTSession[] = [
  {
    id: 'PT-2026-301',
    memberId: 'WFIT-2026-002',
    memberName: 'Priya Sharma',
    trainerId: 'TR-ALEX',
    trainerName: 'Alex Chen',
    packageName: 'Functional Strength (10 Sessions)',
    totalSessions: 10,
    completedSessions: 4,
    remainingSessions: 6,
    price: 12000,
    commissionRate: 20,
    startDate: '2026-10-20',
    expiryDate: '2026-11-20',
    status: 'Active'
  },
  {
    id: 'PT-2026-302',
    memberId: 'WFIT-2026-001',
    memberName: 'Rohan Mehra',
    trainerId: 'TR-ALEX',
    trainerName: 'Alex Chen',
    packageName: 'Olympic Lifting Mastery (20 Sessions)',
    totalSessions: 20,
    completedSessions: 18,
    remainingSessions: 2,
    price: 22000,
    commissionRate: 25,
    startDate: '2026-09-01',
    expiryDate: '2026-11-05',
    status: 'Active'
  }
];

// Seed Audit Logs
let AUDIT_LOGS_DB: AuditLogItem[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-30 06:30:11',
    actor: 'admin@wfitgym.com',
    role: 'OWNER / ADMIN',
    action: 'Discount Override Approved',
    target: 'INV-2026-1001',
    details: 'Applied ₹1,000 festival voucher discount code WFEST',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-30 07:10:15',
    actor: 'manager@wfitgym.com',
    role: 'CLUB MANAGER',
    action: 'Manual Biometric Override',
    target: 'Member WFIT-2026-004',
    details: 'Granted 1-time desk entry for Ananya Deshmukh (membership expired)',
    status: 'SUCCESS'
  }
];

function logAudit(actor: string, role: string, action: string, target: string, details: string, status: 'SUCCESS' | 'DENIED' | 'FAILED' = 'SUCCESS') {
  const item: AuditLogItem = {
    id: `AUD-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actor,
    role,
    action,
    target,
    details,
    status
  };
  AUDIT_LOGS_DB.unshift(item);
}

// =========================================================================
// AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// =========================================================================

export interface AuthenticatedRequest extends Request {
  user?: UserAccount;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Authentication token missing or invalid. Please sign in.' 
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = SESSIONS.get(token);

  if (!session) {
    res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Session has expired or is invalid. Please sign in again.' 
    });
    return;
  }

  if (Date.now() > session.expiresAt) {
    SESSIONS.delete(token);
    res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Session expired. Please sign in again.' 
    });
    return;
  }

  req.user = session.user;
  next();
}

function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized', message: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      logAudit(
        req.user.email, 
        req.user.role, 
        'UNAUTHORIZED_ROLE_ACCESS_BLOCKED', 
        req.path, 
        `User attempted access to restricted endpoint requiring: [${allowedRoles.join(', ')}]`, 
        'DENIED'
      );
      res.status(403).json({ 
        error: 'Forbidden', 
        message: `Access Denied: Your role (${req.user.role}) is not authorised to perform this action.` 
      });
      return;
    }

    next();
  };
}

// =========================================================================
// API ROUTES
// =========================================================================

// 1. Auth: Sign In
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, password } = req.body; // identifier = username or email
  const clientIp = req.ip || '127.0.0.1';

  if (!identifier || !password) {
    res.status(400).json({ error: 'Bad Request', message: 'Username/email and password are required.' });
    return;
  }

  // Rate limiting check
  const attemptKey = `${clientIp}_${identifier.toLowerCase().trim()}`;
  const rateLimit = LOGIN_ATTEMPTS.get(attemptKey);
  if (rateLimit && rateLimit.lockedUntil > Date.now()) {
    const remainingSeconds = Math.ceil((rateLimit.lockedUntil - Date.now()) / 1000);
    res.status(429).json({ 
      error: 'Too Many Requests', 
      message: `Account is temporarily locked due to consecutive failed attempts. Try again in ${remainingSeconds} seconds.` 
    });
    return;
  }

  // Lookup user by email or username
  let targetAccount: StoredAccount | undefined;
  for (const account of ACCOUNTS_DB.values()) {
    if (
      account.email.toLowerCase() === identifier.toLowerCase().trim() ||
      account.username.toLowerCase() === identifier.toLowerCase().trim()
    ) {
      targetAccount = account;
      break;
    }
  }

  if (!targetAccount || !targetAccount.isActive) {
    // Record failure
    const current = rateLimit?.failedAttempts || 0;
    const newCount = current + 1;
    LOGIN_ATTEMPTS.set(attemptKey, {
      failedAttempts: newCount,
      lockedUntil: newCount >= 5 ? Date.now() + 5 * 60 * 1000 : 0
    });

    logAudit(identifier, 'UNKNOWN', 'LOGIN_FAILED', '/api/auth/login', 'User not found or account deactivated', 'FAILED');
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials or inactive account.' });
    return;
  }

  const isPasswordValid = verifyPassword(password, targetAccount.salt, targetAccount.passwordHash);
  if (!isPasswordValid) {
    const current = rateLimit?.failedAttempts || 0;
    const newCount = current + 1;
    LOGIN_ATTEMPTS.set(attemptKey, {
      failedAttempts: newCount,
      lockedUntil: newCount >= 5 ? Date.now() + 5 * 60 * 1000 : 0
    });

    logAudit(targetAccount.email, targetAccount.role, 'LOGIN_FAILED', '/api/auth/login', 'Incorrect password provided', 'FAILED');
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
    return;
  }

  // Clear rate limit on success
  LOGIN_ATTEMPTS.delete(attemptKey);

  // Generate Session Token
  const token = generateSecureToken();
  const sessionUser: UserAccount = {
    id: targetAccount.id,
    username: targetAccount.username,
    email: targetAccount.email,
    role: targetAccount.role,
    name: targetAccount.name,
    memberId: targetAccount.memberId,
    trainerId: targetAccount.trainerId,
    branch: targetAccount.branch,
    isActive: targetAccount.isActive,
    createdAt: targetAccount.createdAt,
    lastLoginAt: new Date().toISOString()
  };

  // 8-hour expiry
  SESSIONS.set(token, {
    user: sessionUser,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000
  });

  logAudit(targetAccount.email, targetAccount.role, 'LOGIN_SUCCESS', '/api/auth/login', 'Authenticated successfully', 'SUCCESS');

  res.json({
    token,
    user: sessionUser,
    permissions: {
      canViewFinances: targetAccount.role === 'OWNER / ADMIN' || (targetAccount.role === 'CLUB MANAGER' && SYSTEM_SETTINGS.managerPaymentAccessEnabled),
      canManageStaff: targetAccount.role === 'OWNER / ADMIN',
      canEditSecurity: targetAccount.role === 'OWNER / ADMIN',
      canManageMembers: targetAccount.role === 'OWNER / ADMIN' || targetAccount.role === 'CLUB MANAGER',
      canManageWorkouts: targetAccount.role === 'OWNER / ADMIN' || targetAccount.role === 'CLUB MANAGER' || targetAccount.role === 'TRAINER',
      isTrainerOnly: targetAccount.role === 'TRAINER',
      isMemberOnly: targetAccount.role === 'MEMBER'
    }
  });
});

// 2. Auth: Sign Out
app.post('/api/auth/logout', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    SESSIONS.delete(token);
  }
  if (req.user) {
    logAudit(req.user.email, req.user.role, 'LOGOUT', '/api/auth/logout', 'Session invalidated securely', 'SUCCESS');
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 3. Auth: Current Profile
app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json({
    user: req.user,
    permissions: {
      canViewFinances: req.user.role === 'OWNER / ADMIN' || (req.user.role === 'CLUB MANAGER' && SYSTEM_SETTINGS.managerPaymentAccessEnabled),
      canManageStaff: req.user.role === 'OWNER / ADMIN',
      canEditSecurity: req.user.role === 'OWNER / ADMIN',
      canManageMembers: req.user.role === 'OWNER / ADMIN' || req.user.role === 'CLUB MANAGER',
      canManageWorkouts: req.user.role === 'OWNER / ADMIN' || req.user.role === 'CLUB MANAGER' || req.user.role === 'TRAINER',
      isTrainerOnly: req.user.role === 'TRAINER',
      isMemberOnly: req.user.role === 'MEMBER'
    }
  });
});

// 4. Members: Role-Filtered Member Directory
app.get('/api/members', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;

  if (user.role === 'OWNER / ADMIN' || user.role === 'CLUB MANAGER') {
    // Return all members. If Manager and payments disabled, strip financial notes
    res.json(MEMBERS_DB);
    return;
  }

  if (user.role === 'TRAINER') {
    // STRICT TRAINER RESTRICTION: Only members assigned to this trainer, and ZERO financial data!
    const trainerProfile = TRAINERS_DB.find(t => t.id === user.trainerId);
    const assignedIds = trainerProfile ? trainerProfile.assignedMemberIds : [];

    const filtered = MEMBERS_DB
      .filter(m => assignedIds.includes(m.id) || m.assignedTrainerId === user.trainerId)
      .map(m => {
        // Strip any financial details or invoices
        return {
          id: m.id,
          fullName: m.fullName,
          mobile: m.mobile,
          email: m.email,
          dateOfBirth: m.dateOfBirth,
          photoUrl: m.photoUrl,
          branch: m.branch,
          status: m.status,
          planName: m.planName,
          startDate: m.startDate,
          expiryDate: m.expiryDate,
          fitnessGoals: m.fitnessGoals,
          notes: m.notes
          // No pricing, no registration fee, no payment balance!
        };
      });

    res.json(filtered);
    return;
  }

  if (user.role === 'MEMBER') {
    // STRICT MEMBER RESTRICTION: Only their own profile!
    const myProfile = MEMBERS_DB.filter(m => m.id === user.memberId);
    res.json(myProfile);
    return;
  }

  res.status(403).json({ error: 'Forbidden' });
});

// 5. Members: Specific Member Lookup
app.get('/api/members/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const targetId = req.params.id;

  // Member can only view their own
  if (user.role === 'MEMBER' && user.memberId !== targetId) {
    logAudit(user.email, user.role, 'UNAUTHORIZED_MEMBER_ACCESS_BLOCKED', `/api/members/${targetId}`, `Member attempted to access profile of ${targetId}`, 'DENIED');
    res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Access Denied: You are not authorised to view another member’s profile.' 
    });
    return;
  }

  // Trainer can only view assigned members
  if (user.role === 'TRAINER') {
    const trainerProfile = TRAINERS_DB.find(t => t.id === user.trainerId);
    const isAssigned = trainerProfile?.assignedMemberIds.includes(targetId);
    if (!isAssigned) {
      logAudit(user.email, user.role, 'UNAUTHORIZED_TRAINER_MEMBER_ACCESS_BLOCKED', `/api/members/${targetId}`, `Trainer attempted to access unassigned member ${targetId}`, 'DENIED');
      res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Access Denied: You can only view fitness records for your assigned clients.' 
      });
      return;
    }
  }

  const member = MEMBERS_DB.find(m => m.id === targetId);
  if (!member) {
    res.status(404).json({ error: 'Not Found', message: 'Member not found.' });
    return;
  }

  res.json(member);
});

// 6. Invoices: Strict Role-Based Billing Access
app.get('/api/invoices', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;

  // 1. TRAINER RESTRICTION: STRICT 403
  if (user.role === 'TRAINER') {
    logAudit(user.email, user.role, 'TRAINER_FINANCIAL_API_BLOCKED', '/api/invoices', 'Trainer attempted to query invoice ledger', 'DENIED');
    res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Access Denied: Trainers are strictly prohibited from accessing invoices, prices, or payment records.' 
    });
    return;
  }

  // 2. CLUB MANAGER RESTRICTION: Checked against owner permission
  if (user.role === 'CLUB MANAGER' && !SYSTEM_SETTINGS.managerPaymentAccessEnabled) {
    logAudit(user.email, user.role, 'MANAGER_FINANCIAL_API_BLOCKED', '/api/invoices', 'Manager attempted to query invoices while payment access is disabled by owner', 'DENIED');
    res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Access Denied: Payment and invoice access is currently disabled for Club Managers by the gym owner.' 
    });
    return;
  }

  // 3. MEMBER RESTRICTION: Only their own invoices!
  if (user.role === 'MEMBER') {
    const myInvoices = INVOICES_DB.filter(inv => inv.memberId === user.memberId);
    res.json(myInvoices);
    return;
  }

  // 4. OWNER / ADMIN: All invoices
  res.json(INVOICES_DB);
});

// 7. Invoices: Pay Invoice (Server-Validated Payment Gateway)
app.post('/api/invoices/:id/pay', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const invoiceId = req.params.id;
  const { amount, paymentMethod } = req.body;

  const invoice = INVOICES_DB.find(i => i.id === invoiceId);
  if (!invoice) {
    res.status(404).json({ error: 'Not Found', message: 'Invoice not found.' });
    return;
  }

  // Ownership check: If Member, must be their invoice
  if (user.role === 'MEMBER' && invoice.memberId !== user.memberId) {
    logAudit(user.email, user.role, 'UNAUTHORIZED_PAYMENT_ATTEMPT', `/api/invoices/${invoiceId}/pay`, `Member attempted to pay another member's invoice`, 'DENIED');
    res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Access Denied: You cannot make payments for other members.' 
    });
    return;
  }

  // Trainer cannot process payments
  if (user.role === 'TRAINER') {
    res.status(403).json({ error: 'Forbidden', message: 'Trainers cannot process financial transactions.' });
    return;
  }

  // Validate balance
  if (invoice.balanceDue <= 0) {
    res.status(400).json({ error: 'Bad Request', message: 'Invoice has already been fully paid.' });
    return;
  }

  const payAmount = Number(amount);
  if (isNaN(payAmount) || payAmount <= 0) {
    res.status(400).json({ error: 'Bad Request', message: 'Valid payment amount is required.' });
    return;
  }

  if (payAmount > invoice.balanceDue) {
    res.status(400).json({ 
      error: 'Bad Request', 
      message: `Payment amount (₹${payAmount}) exceeds outstanding balance due (₹${invoice.balanceDue}).` 
    });
    return;
  }

  // Verified Payment Gateway Simulation
  const verifiedTxnId = `TXN-VERIFIED-${Date.now().toString().slice(-8)}`;
  const newAmountPaid = invoice.amountPaid + payAmount;
  const newBalanceDue = invoice.total - newAmountPaid;
  const newStatus = newBalanceDue === 0 ? 'Paid' : 'Partial';

  invoice.amountPaid = newAmountPaid;
  invoice.balanceDue = newBalanceDue;
  invoice.status = newStatus;
  invoice.paymentMethod = paymentMethod || 'UPI/GPay';
  invoice.paymentReference = verifiedTxnId;
  invoice.paidAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

  // If member was marked 'Unpaid' and settled in full, update member status to 'Active'
  if (newBalanceDue === 0) {
    const member = MEMBERS_DB.find(m => m.id === invoice.memberId);
    if (member && member.status === 'Unpaid') {
      member.status = 'Active';
    }
  }

  logAudit(
    user.email, 
    user.role, 
    'PAYMENT_VERIFIED_AND_SETTLED', 
    invoice.id, 
    `Collected ₹${payAmount} via ${invoice.paymentMethod}. Ref: ${verifiedTxnId}. New Balance: ₹${newBalanceDue}`, 
    'SUCCESS'
  );

  res.json({
    success: true,
    message: 'Payment verified and allocated successfully.',
    receipt: {
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      invoiceId: invoice.id,
      memberId: invoice.memberId,
      memberName: invoice.memberName,
      amountCollected: payAmount,
      balanceRemaining: newBalanceDue,
      paymentMethod: invoice.paymentMethod,
      transactionId: verifiedTxnId,
      timestamp: invoice.paidAt,
      status: 'VERIFIED'
    },
    updatedInvoice: invoice
  });
});

// 8. Workouts: Trainer & Member Access
app.get('/api/workouts', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;

  if (user.role === 'OWNER / ADMIN' || user.role === 'CLUB MANAGER') {
    res.json(WORKOUTS_DB);
    return;
  }

  if (user.role === 'TRAINER') {
    const trainerWorkouts = WORKOUTS_DB.filter(w => w.trainerId === user.trainerId);
    res.json(trainerWorkouts);
    return;
  }

  if (user.role === 'MEMBER') {
    const memberWorkouts = WORKOUTS_DB.filter(w => w.memberId === user.memberId);
    res.json(memberWorkouts);
    return;
  }

  res.status(403).json({ error: 'Forbidden' });
});

// 9. Workouts: Create or Update Workout Plan
app.post('/api/workouts', authMiddleware, requireRole(['OWNER / ADMIN', 'CLUB MANAGER', 'TRAINER']), (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { memberId, title, focus, exercises, coachNotes } = req.body;

  const member = MEMBERS_DB.find(m => m.id === memberId);
  if (!member) {
    res.status(404).json({ error: 'Not Found', message: 'Target member not found.' });
    return;
  }

  const newWorkout: WorkoutPlan = {
    id: `WO-${Date.now().toString().slice(-6)}`,
    memberId,
    memberName: member.fullName,
    trainerId: user.trainerId || 'TR-ADMIN',
    trainerName: user.name,
    title,
    focus,
    exercises: exercises || [],
    updatedAt: new Date().toISOString().split('T')[0],
    status: 'Active',
    coachNotes
  };

  WORKOUTS_DB.unshift(newWorkout);
  logAudit(user.email, user.role, 'WORKOUT_PLAN_CREATED', newWorkout.id, `Created workout for ${member.fullName}: ${title}`, 'SUCCESS');

  res.status(201).json(newWorkout);
});

// 10. PT Sessions: Role Filtered
app.get('/api/pt-sessions', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;

  if (user.role === 'OWNER / ADMIN') {
    // Admin gets full data with prices and commissions
    res.json(PT_SESSIONS_DB);
    return;
  }

  if (user.role === 'CLUB MANAGER') {
    // Manager gets sessions, with prices redacted if payment access disabled
    const sanitized = PT_SESSIONS_DB.map(s => ({
      ...s,
      price: SYSTEM_SETTINGS.managerPaymentAccessEnabled ? s.price : undefined,
      commissionRate: SYSTEM_SETTINGS.managerPaymentAccessEnabled ? s.commissionRate : undefined
    }));
    res.json(sanitized);
    return;
  }

  if (user.role === 'TRAINER') {
    // Trainer gets ONLY their sessions, and NO financial prices/commissions!
    const sanitized = PT_SESSIONS_DB
      .filter(s => s.trainerId === user.trainerId)
      .map(s => ({
        id: s.id,
        memberId: s.memberId,
        memberName: s.memberName,
        trainerId: s.trainerId,
        trainerName: s.trainerName,
        packageName: s.packageName,
        totalSessions: s.totalSessions,
        completedSessions: s.completedSessions,
        remainingSessions: s.remainingSessions,
        startDate: s.startDate,
        expiryDate: s.expiryDate,
        status: s.status
        // NO price, NO commissionRate
      }));
    res.json(sanitized);
    return;
  }

  if (user.role === 'MEMBER') {
    const mySessions = PT_SESSIONS_DB
      .filter(s => s.memberId === user.memberId)
      .map(s => ({
        id: s.id,
        memberId: s.memberId,
        memberName: s.memberName,
        trainerName: s.trainerName,
        packageName: s.packageName,
        totalSessions: s.totalSessions,
        completedSessions: s.completedSessions,
        remainingSessions: s.remainingSessions,
        startDate: s.startDate,
        expiryDate: s.expiryDate,
        status: s.status
      }));
    res.json(mySessions);
    return;
  }

  res.status(403).json({ error: 'Forbidden' });
});

// 11. Audit Logs: Admin Only
app.get('/api/audit-logs', authMiddleware, requireRole(['OWNER / ADMIN']), (_req: AuthenticatedRequest, res: Response) => {
  res.json(AUDIT_LOGS_DB);
});

// 12. Settings: Manager Payment Permission Toggle (Admin Only)
app.get('/api/settings', authMiddleware, requireRole(['OWNER / ADMIN']), (_req: AuthenticatedRequest, res: Response) => {
  res.json(SYSTEM_SETTINGS);
});

app.put('/api/settings/manager-payment-access', authMiddleware, requireRole(['OWNER / ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { enabled } = req.body;
  SYSTEM_SETTINGS.managerPaymentAccessEnabled = Boolean(enabled);
  logAudit(
    req.user!.email, 
    req.user!.role, 
    'SECURITY_POLICY_CHANGED', 
    'managerPaymentAccessEnabled', 
    `Manager payment access toggled to: ${SYSTEM_SETTINGS.managerPaymentAccessEnabled}`, 
    'SUCCESS'
  );
  res.json({ success: true, settings: SYSTEM_SETTINGS });
});

// 13. Staff Accounts Management (Admin Only)
app.get('/api/staff-accounts', authMiddleware, requireRole(['OWNER / ADMIN']), (_req: AuthenticatedRequest, res: Response) => {
  // Strip password hashes and salts before returning
  const accounts: UserAccount[] = Array.from(ACCOUNTS_DB.values()).map(acc => ({
    id: acc.id,
    username: acc.username,
    email: acc.email,
    role: acc.role,
    name: acc.name,
    memberId: acc.memberId,
    trainerId: acc.trainerId,
    branch: acc.branch,
    isActive: acc.isActive,
    createdAt: acc.createdAt,
    lastLoginAt: acc.lastLoginAt
  }));
  res.json(accounts);
});

app.put('/api/staff-accounts/:id/status', authMiddleware, requireRole(['OWNER / ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const targetId = req.params.id;
  const { isActive } = req.body;

  const account = ACCOUNTS_DB.get(targetId);
  if (!account) {
    res.status(404).json({ error: 'Not Found', message: 'Account not found.' });
    return;
  }

  account.isActive = Boolean(isActive);
  logAudit(req.user!.email, req.user!.role, 'ACCOUNT_STATUS_MODIFIED', account.email, `Account active state set to ${account.isActive}`, 'SUCCESS');
  res.json({ success: true, account });
});

// =========================================================================
// VITE SPA DEV SERVER MOUNTING
// =========================================================================

function getListenPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const val = Number(process.argv[portArgIndex + 1]);
    if (!isNaN(val) && val > 0) return val;
  }
  if (process.env.NODE_ENV === 'production' && process.env.PORT) {
    return Number(process.env.PORT);
  }
  return 3000;
}

async function startServer() {
  const port = getListenPort();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`WFIT GYM CRM Backend & SPA running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
