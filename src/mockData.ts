import { 
  MembershipPlan, Member, Invoice, Lead, BiometricLog, PTSession, 
  RenewalTask, AuditLogItem, TrainerProfile, UserAccount 
} from './types';

export const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 'plan-1m',
    name: 'Monthly Plan',
    durationMonths: 1,
    price: 2999,
    registrationFee: 500,
    taxPercent: 18,
    features: ['Access to main gym floor', 'Locker & shower amenities', 'Fitness movement screen', 'Biometric turnstile access']
  },
  {
    id: 'plan-3m',
    name: 'Quarterly Plan',
    durationMonths: 3,
    price: 7499,
    registrationFee: 500,
    taxPercent: 18,
    features: ['All monthly features', '1 complimentary PT consultation', 'Personalized macronutrient guide', 'Locker bag tag']
  },
  {
    id: 'plan-6m',
    name: 'Half-Yearly Plan',
    durationMonths: 6,
    price: 13499,
    registrationFee: 0,
    taxPercent: 18,
    features: ['All quarterly features', 'Zero registration fee', '2 Guest workout passes/month', 'Freeze membership up to 15 days']
  },
  {
    id: 'plan-12m',
    name: 'Annual Pass',
    durationMonths: 12,
    price: 22999,
    registrationFee: 0,
    taxPercent: 18,
    features: ['Full gym & recovery access', 'Unlimited sauna & steam suite', '4 Guest passes/month', '30 days freeze option', 'Quarterly InBody composition test']
  }
];

export const INITIAL_MEMBERS: Member[] = [
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
    planName: 'Annual Pass',
    startDate: '2026-01-10',
    expiryDate: '2027-01-10',
    assignedTrainerId: 'TR-ALEX',
    assignedTrainerName: 'Alex Chen',
    emergencyContact: {
      name: 'Sunita Mehra',
      relationship: 'Mother',
      phone: '+91 98765 11111'
    },
    fitnessGoals: 'Increase strength in back squat & Olympic barbell lifting.',
    biometricEnrolled: true,
    biometricDeviceId: 'DEV-FP-MAIN-01',
    notes: 'Sample active client with 100% attendance consistency.'
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
    planName: 'Half-Yearly Plan',
    startDate: '2026-05-06',
    expiryDate: '2026-11-06',
    assignedTrainerId: 'TR-ALEX',
    assignedTrainerName: 'Alex Chen',
    emergencyContact: {
      name: 'Arjun Sharma',
      relationship: 'Spouse',
      phone: '+91 98111 99887'
    },
    fitnessGoals: 'Functional posterior chain power & conditioning.',
    biometricEnrolled: true,
    biometricDeviceId: 'DEV-FP-MAIN-01',
    notes: 'Follow-up renewal required within 7 days.'
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
    planName: 'Quarterly Plan',
    startDate: '2026-08-01',
    expiryDate: '2026-11-01',
    assignedTrainerId: 'TR-MARCUS',
    assignedTrainerName: 'Marcus Stone',
    emergencyContact: {
      name: 'Debashree Sengupta',
      relationship: 'Sister',
      phone: '+91 99200 11223'
    },
    fitnessGoals: 'Fat loss & high intensity interval conditioning.',
    biometricEnrolled: true,
    biometricDeviceId: 'DEV-FP-MAIN-01',
    notes: 'Outstanding balance pending settlement. Turnstile blocked until simulated payment.'
  },
  {
    id: 'WFIT-2026-004',
    fullName: 'Ananya Deshmukh',
    mobile: '+91 98333 77889',
    email: 'ananya.d@example.com',
    dateOfBirth: '1996-09-15',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
    registrationDate: '2025-10-15',
    branch: 'Downtown Flagship',
    status: 'Expired',
    planId: 'plan-12m',
    planName: 'Annual Pass',
    startDate: '2025-10-15',
    expiryDate: '2026-10-15',
    assignedTrainerId: 'TR-ELENA',
    assignedTrainerName: 'Elena Rostova',
    emergencyContact: {
      name: 'Ramesh Deshmukh',
      relationship: 'Father',
      phone: '+91 98333 11223'
    },
    fitnessGoals: 'Mobility, core rehabilitation & endurance.',
    biometricEnrolled: true,
    biometricDeviceId: 'DEV-FP-MAIN-01',
    notes: 'Membership expired 15 days ago. Ready for renewal simulation.'
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
    planName: 'Monthly Plan',
    startDate: '2026-10-28',
    expiryDate: '2026-11-28',
    assignedTrainerId: 'TR-VIKRAM',
    assignedTrainerName: 'Vikram Rathore',
    emergencyContact: {
      name: 'Maya Oberoi',
      relationship: 'Spouse',
      phone: '+91 97654 99000'
    },
    fitnessGoals: 'Boxing conditioning & core strength.',
    biometricEnrolled: true,
    biometricDeviceId: 'DEV-FP-MAIN-01',
    notes: 'New monthly member enrolled yesterday.'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'DEMO-INV-2026-001',
    demoTransactionId: 'DEMO-TXN-2026-8812',
    memberId: 'WFIT-2026-001',
    memberName: 'Rohan Mehra',
    planId: 'plan-12m',
    planName: 'Annual Pass',
    date: '2026-10-30',
    dueDate: '2026-10-30',
    items: [
      { description: 'Annual Pass (12 Months)', amount: 22999 }
    ],
    subtotal: 22999,
    discount: 1000,
    discountReason: 'Demo Festival Discount',
    tax: 3959.82,
    total: 25958.82,
    amountPaid: 25958.82,
    balanceDue: 0,
    status: 'DEMO PAID',
    paymentMethod: 'UPI',
    paymentReference: 'DEMO-UPI-993821049281',
    branch: 'Downtown Flagship',
    paidAt: '2026-10-30 09:15:00'
  },
  {
    id: 'DEMO-INV-2026-002',
    demoTransactionId: 'DEMO-TXN-2026-9041',
    memberId: 'WFIT-2026-003',
    memberName: 'Vikramaditya Sengupta',
    planId: 'plan-3m',
    planName: 'Quarterly Plan',
    date: '2026-10-25',
    dueDate: '2026-10-29',
    items: [
      { description: 'Quarterly Plan (3 Months)', amount: 7499 },
      { description: 'Registration & Smart RFID Tag', amount: 500 }
    ],
    subtotal: 7999,
    discount: 0,
    tax: 1439.82,
    total: 9438.82,
    amountPaid: 5000,
    balanceDue: 4438.82,
    status: 'PENDING',
    paymentMethod: 'Cash',
    paymentReference: 'DEMO-CASH-REC-0491',
    branch: 'Downtown Flagship'
  },
  {
    id: 'DEMO-INV-2026-003',
    demoTransactionId: 'DEMO-TXN-2026-1120',
    memberId: 'WFIT-2026-004',
    memberName: 'Ananya Deshmukh',
    planId: 'plan-3m',
    planName: 'Quarterly Plan',
    date: '2026-10-29',
    dueDate: '2026-10-29',
    items: [
      { description: 'Quarterly Membership Renewal', amount: 7499 }
    ],
    subtotal: 7499,
    discount: 0,
    tax: 1349.82,
    total: 8848.82,
    amountPaid: 0,
    balanceDue: 8848.82,
    status: 'DEMO PAYMENT FAILED',
    paymentMethod: 'Online Gateway',
    paymentReference: 'DEMO-GW-FAIL-302',
    branch: 'Downtown Flagship',
    demoFailureReason: 'Simulated Card Decline: Insufficient Funds (Demo Simulation)'
  },
  {
    id: 'DEMO-INV-2026-004',
    demoTransactionId: 'DEMO-TXN-2026-4409',
    memberId: 'WFIT-2026-005',
    memberName: 'Kabir Oberoi',
    planId: 'plan-1m',
    planName: 'Monthly Plan',
    date: '2026-10-28',
    dueDate: '2026-10-28',
    items: [
      { description: 'Monthly Plan (1 Month)', amount: 2999 },
      { description: 'One-time Registration Fee', amount: 500 }
    ],
    subtotal: 3499,
    discount: 0,
    tax: 629.82,
    total: 4128.82,
    amountPaid: 4128.82,
    balanceDue: 0,
    status: 'DEMO PAID',
    paymentMethod: 'Online Gateway',
    paymentReference: 'DEMO-POS-7740192',
    branch: 'Downtown Flagship',
    paidAt: '2026-10-28 14:20:00'
  }
];

export const INITIAL_TRAINERS: TrainerProfile[] = [
  {
    id: 'TR-ALEX',
    name: 'Alex Chen',
    email: 'alex.chen@wfitgym.com',
    phone: '+91 98201 10001',
    photoUrl: '/src/assets/images/personal_coaching_feature_1793378348515.jpg',
    specialisation: 'Olympic Weightlifting, Hypertrophy & Barbell Strength',
    branch: 'Downtown Flagship',
    workingHours: '06:00 - 14:00 (Mon - Fri)',
    experienceYears: 8,
    certifications: ['CSCS (NSCA)', 'USA Weightlifting Level 2', 'Precision Nutrition L1'],
    bio: 'Former collegiate powerlifting competitor specializing in biomechanically sound squat, bench, and deadlift progressions for longevity and high performance.',
    assignedMemberIds: ['WFIT-2026-001', 'WFIT-2026-002']
  },
  {
    id: 'TR-MARCUS',
    name: 'Marcus Stone',
    email: 'marcus.stone@wfitgym.com',
    phone: '+91 98201 10002',
    photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&auto=format&fit=crop&q=80',
    specialisation: 'Bodybuilding, Functional Hypertrophy & Strength Protocols',
    branch: 'Downtown Flagship',
    workingHours: '12:00 - 20:00 (Mon - Fri)',
    experienceYears: 6,
    certifications: ['ISSA Master Trainer', 'EXOS Performance Specialist'],
    bio: 'Dedicated to helping athletes build dense lean muscle through progressive overload, volume periodization, and customized hypertrophy splits.',
    assignedMemberIds: ['WFIT-2026-003']
  },
  {
    id: 'TR-ELENA',
    name: 'Elena Rostova',
    email: 'elena.rostova@wfitgym.com',
    phone: '+91 98201 10003',
    photoUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&auto=format&fit=crop&q=80',
    specialisation: 'Mobility, Injury Rehabilitation & Athletic Longevity',
    branch: 'Downtown Flagship',
    workingHours: '07:00 - 15:00 (Tue - Sat)',
    experienceYears: 7,
    certifications: ['ACE Certified Personal Trainer', 'FRC Mobility Specialist'],
    bio: 'Integrates active joint mobility, functional kinetic chains, and restorative strength work to keep athletes injury-free and performing at peak capacity.',
    assignedMemberIds: ['WFIT-2026-004']
  },
  {
    id: 'TR-VIKRAM',
    name: 'Vikram Rathore',
    email: 'vikram.rathore@wfitgym.com',
    phone: '+91 98201 10004',
    photoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
    specialisation: 'Boxing Conditioning, Sprint Mechanics & Metabolic Conditioning',
    branch: 'Downtown Flagship',
    workingHours: '14:00 - 22:00 (Mon - Fri)',
    experienceYears: 5,
    certifications: ['NASM-CPT', 'Level 2 Boxing Coach'],
    bio: 'Combines fight conditioning, pad work, agility drills, and anaerobic intervals for rapid metabolic conditioning and explosive power.',
    assignedMemberIds: ['WFIT-2026-005']
  }
];

export const INITIAL_GALLERY_ITEMS = [
  {
    id: 'gal-1',
    title: 'Olympic Free Weights & Power Rig Zone',
    category: 'Strength Zone',
    image: '/src/assets/images/hero_gym_equipment_1793378346007.jpg',
    description: 'Competition Olympic barbells, calibrated steel weight plates, and custom commercial squat stations.'
  },
  {
    id: 'gal-2',
    title: 'Commercial Cable Crossover System',
    category: 'Functional Rig',
    image: '/src/assets/images/featured_cable_machine_1793378346902.jpg',
    description: 'Precision dual-pulley cable systems with ultra-smooth bearing travel and multiple attachment configurations.'
  },
  {
    id: 'gal-3',
    title: 'Free Weight Dumbbell Arsenal',
    category: 'Strength Zone',
    image: '/src/assets/images/dumbbells_training_detail_1793378370129.jpg',
    description: 'Full rubber-encased dumbbell pairs ranging from 2.5 kg up to 60 kg with knurled ergonomic handles.'
  },
  {
    id: 'gal-4',
    title: 'Commercial Conditioning & Cardio Deck',
    category: 'Cardio Deck',
    image: '/src/assets/images/cardio_endurance_feature_1793378348449.jpg',
    description: 'Slat-belt commercial treadmills, assault air bikes, and concept ski ergs with live telemetry monitoring.'
  },
  {
    id: 'gal-5',
    title: 'Private Coaching & Functional Turf',
    category: 'Coaching Zone',
    image: '/src/assets/images/personal_coaching_feature_1793378348515.jpg',
    description: 'High-density indoor sled turf, kettlebell wall, and dedicated 1-on-1 performance coaching pods.'
  },
  {
    id: 'gal-6',
    title: 'Main Lobby & Biometric Turnstiles',
    category: 'Facility & Lounge',
    image: '/src/assets/images/gym_interior_modern_1793378348489.jpg',
    description: 'ZKTECO facial recognition and optical fingerprint turnstiles with member check-in display.'
  }
];

export const DEMO_ACCOUNTS: UserAccount[] = [
  {
    id: 'USR-ADMIN-01',
    username: 'admin',
    email: 'admin@wfitgym.com',
    name: 'Farook Mohamed (Gym Owner / Admin)',
    role: 'OWNER / ADMIN',
    branch: 'Downtown Flagship',
    isActive: true,
    createdAt: '2026-01-01'
  },
  {
    id: 'USR-MGR-01',
    username: 'manager',
    email: 'manager@wfitgym.com',
    name: 'Siddharth Rao (Club Operations Manager)',
    role: 'CLUB MANAGER',
    branch: 'Downtown Flagship',
    isActive: true,
    createdAt: '2026-01-15'
  },
  {
    id: 'USR-TR-01',
    username: 'alex.trainer',
    email: 'alex.chen@wfitgym.com',
    name: 'Alex Chen (Head Strength Coach)',
    role: 'TRAINER',
    trainerId: 'TR-ALEX',
    branch: 'Downtown Flagship',
    isActive: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'USR-MEM-01',
    username: 'rohan.mehra',
    email: 'rohan.mehra@example.com',
    name: 'Rohan Mehra (Active Member)',
    role: 'MEMBER',
    memberId: 'WFIT-2026-001',
    branch: 'Downtown Flagship',
    isActive: true,
    createdAt: '2026-01-10'
  },
  {
    id: 'USR-MEM-02',
    username: 'vikram.sengupta',
    email: 'vikram.sengupta@example.com',
    name: 'Vikramaditya Sengupta (Pending Dues Demo Member)',
    role: 'MEMBER',
    memberId: 'WFIT-2026-003',
    branch: 'Downtown Flagship',
    isActive: true,
    createdAt: '2026-08-01'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'LEAD-2026-101',
    name: 'Sameer Kulkarni',
    mobile: '+91 98220 55667',
    email: 'sameer.k@example.com',
    source: 'Instagram',
    interestedProduct: 'Gym Membership',
    assignedExecutive: 'Sneha Rao (Front Office)',
    stage: 'Visit / trial scheduled',
    enquiryDate: '2026-10-28',
    lastContactDate: '2026-10-29',
    nextFollowUpDate: '2026-10-31',
    trialDate: '2026-10-31',
    notes: 'Interested in annual membership and morning free weights training.'
  },
  {
    id: 'LEAD-2026-102',
    name: 'Divya Nair',
    mobile: '+91 97440 11223',
    email: 'divya.nair@example.com',
    source: 'Walk-in',
    interestedProduct: 'Personal Training',
    assignedExecutive: 'Sneha Rao (Front Office)',
    stage: 'New enquiry',
    enquiryDate: '2026-10-30',
    lastContactDate: '2026-10-30',
    nextFollowUpDate: '2026-10-31',
    notes: 'Looking for 1-on-1 coaching for post-rehab posture and mobility.'
  }
];

export const INITIAL_BIOMETRIC_LOGS: BiometricLog[] = [
  {
    id: 'BIO-2026-8001',
    timestamp: '2026-10-30 06:15:22',
    memberId: 'WFIT-2026-001',
    memberName: 'Rohan Mehra',
    device: 'Turnstile Gate #1 (Main)',
    scanType: 'Fingerprint',
    result: 'GRANTED'
  },
  {
    id: 'BIO-2026-8002',
    timestamp: '2026-10-30 06:45:10',
    memberId: 'WFIT-2026-003',
    memberName: 'Vikramaditya Sengupta',
    device: 'Turnstile Gate #1 (Main)',
    scanType: 'Face ID',
    result: 'DENIED',
    denialReason: 'Outstanding invoice balance pending settlement'
  },
  {
    id: 'BIO-2026-8003',
    timestamp: '2026-10-30 07:12:05',
    memberId: 'WFIT-2026-005',
    memberName: 'Kabir Oberoi',
    device: 'Turnstile Gate #1 (Main)',
    scanType: 'Fingerprint',
    result: 'GRANTED'
  }
];

export const INITIAL_PT_SESSIONS: PTSession[] = [
  {
    id: 'PT-2026-301',
    memberId: 'WFIT-2026-002',
    memberName: 'Priya Sharma',
    trainerId: 'TR-ALEX',
    trainerName: 'Alex Chen',
    packageName: 'Functional Strength & Conditioning (10 Sessions)',
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
    trainerId: 'TR-MARCUS',
    trainerName: 'Marcus Stone',
    packageName: 'Hypertrophy Mastery (20 Sessions)',
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

export const INITIAL_RENEWAL_TASKS: RenewalTask[] = [
  {
    id: 'REN-2026-01',
    memberId: 'WFIT-2026-002',
    memberName: 'Priya Sharma',
    planName: 'Half-Yearly Plan',
    expiryDate: '2026-11-06',
    daysRemaining: 7,
    lastReminderSentDate: '2026-10-30',
    reminderType: '7 Days Before',
    status: 'Sent',
    assignedStaff: 'Sneha Rao'
  },
  {
    id: 'REN-2026-02',
    memberId: 'WFIT-2026-004',
    memberName: 'Ananya Deshmukh',
    planName: 'Annual Pass',
    expiryDate: '2026-10-15',
    daysRemaining: -15,
    lastReminderSentDate: '2026-10-25',
    reminderType: 'Overdue',
    status: 'Pending',
    assignedStaff: 'Rahul Varma'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-10-30 06:30:11',
    actor: 'admin@wfitgym.com',
    role: 'Owner / Admin',
    action: 'Discount Override Approved',
    target: 'DEMO-INV-2026-001',
    details: 'Applied ₹1,000 festival voucher discount code WFEST in demo session',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-902',
    timestamp: '2026-10-30 07:10:15',
    actor: 'manager@wfitgym.com',
    role: 'Club Manager',
    action: 'Manual Biometric Override',
    target: 'Member WFIT-2026-004',
    details: 'Granted 1-time desk entry for Ananya Deshmukh (membership expired)',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-903',
    timestamp: '2026-10-30 07:45:00',
    actor: 'scheduler@system.internal',
    role: 'Automated Daemon',
    action: 'Expiry Check & Notification Batch',
    target: 'Batch #2026-10-30-AM',
    details: 'Dispatched 7-day reminder to Priya Sharma via WhatsApp Business API (Simulated)',
    status: 'SUCCESS'
  }
];
