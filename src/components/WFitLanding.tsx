import React, { useEffect, useRef, useState } from 'react';
import { 
  ArrowUpRight, ArrowDown, ChevronRight, Check, Dumbbell, ShieldCheck, 
  Phone, Mail, MapPin, Clock, ExternalLink, X, Award, Calendar, 
  CreditCard, Sparkles, Menu, Send, CheckCircle2, AlertCircle, Eye,
  ChevronDown, Layers, Users, Zap
} from 'lucide-react';
import { INITIAL_PLANS, INITIAL_TRAINERS, INITIAL_GALLERY_ITEMS, INITIAL_MEMBERS } from '../mockData';
import { MembershipPlan, Member, Invoice } from '../types';
import { DemoPaymentModal } from './DemoPaymentModal';

interface WFitLandingProps {
  onOpenCrm: () => void;
  onJoinClick?: () => void;
  onExplorePrograms?: () => void;
}

// Curated high-fidelity gym assets
const ASSETS = {
  heroEquipment: '/src/assets/images/hero_gym_equipment_1793378346007.jpg',
  featuredCableMachine: '/src/assets/images/featured_cable_machine_1793378346902.jpg',
  strengthFeature: '/src/assets/images/strength_training_feature_1793378347110.jpg',
  cardioFeature: '/src/assets/images/cardio_endurance_feature_1793378348449.jpg',
  coachingFeature: '/src/assets/images/personal_coaching_feature_1793378348515.jpg',
  gymInterior: '/src/assets/images/gym_interior_modern_1793378348489.jpg',
  dumbbellsTraining: '/src/assets/images/dumbbells_training_detail_1793378370129.jpg',
  communityAvatars: [
    'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/300f41b1-3de5-4153-afde-06e15e753ad0.webp',
    'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/bfff4cdf-4fda-4491-ada6-62f3b6236492.webp',
    'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/943b121e-fe72-479f-93ae-aa8cd1650f69.webp',
    'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/c673306f-2b81-4c3d-a7d2-3df61d481abb.webp',
    'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/2e4fcf11-d0fc-4f31-8f7a-dfe751777141.webp',
    'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/ab458fcd-4c2c-426f-8213-21cc3c7274be.webp',
    'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/c1fcd833-5ac9-41e9-9352-fead7e64fa24.webp',
    'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4c2b3307-e555-4633-949c-efd3b7e09d82.webp',
  ]
};

// Fitness Manifesto Statement:
const MANIFESTO_TEXT = "We believe real strength is built through consistency, not shortcuts. Every session is an opportunity to push boundaries, improve performance, and become stronger every day.";
const MANIFESTO_WORDS = MANIFESTO_TEXT.split(' ');

// Sample Client Testimonials (clearly labeled demo)
const SAMPLE_TESTIMONIALS = [
  {
    quote: "The equipment selection is unmatched. Calibrated competition plates, rock-solid racks, and trainers who understand biomechanics and injury prevention.",
    name: "Rohan Mehra",
    badge: "Powerlifting & Strength Member",
    duration: "Training 14 Months",
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  },
  {
    quote: "Switched from a crowded commercial gym. The metabolic conditioning zone and structured coaching kept my body fat down and energy levels high without overtraining.",
    name: "Priya Sharma",
    badge: "Cardio & Athletic Conditioning",
    duration: "Training 8 Months",
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
  },
  {
    quote: "Clean facility, disciplined atmosphere, and no waiting around for squat racks during peak morning hours. Exactly what serious professionals need.",
    name: "Vikramaditya Sengupta",
    badge: "Executive Strength Member",
    duration: "Training 2 Years",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  }
];

export const WFitLanding: React.FC<WFitLandingProps> = ({ 
  onOpenCrm, 
  onJoinClick,
  onExplorePrograms 
}) => {
  // Navigation active tab
  const [activeNav, setActiveNav] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Nav items matching user specifications
  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'About Us', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Trainers', id: 'trainers' },
    { label: 'Membership', id: 'membership' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Contact Us', id: 'contact' },
    { label: 'Enquiry', id: 'enquiry' }
  ];

  // Statistics counters
  const [count500, setCount500] = useState(500);
  const [count10Years, setCount10Years] = useState(10);
  const [manifestoProgress, setManifestoProgress] = useState(0);
  const [equipmentScrollOffset, setEquipmentScrollOffset] = useState(0);
  const [trustInView, setTrustInView] = useState(false);

  // Gallery Lightbox Modal
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<typeof INITIAL_GALLERY_ITEMS[0] | null>(null);
  const [galleryFilter, setGalleryFilter] = useState('All');

  // Interactive Demo Payment Modal trigger from landing page
  const [isDemoPaymentModalOpen, setIsDemoPaymentModalOpen] = useState(false);
  const [selectedPlanForDemo, setSelectedPlanForDemo] = useState<MembershipPlan>(INITIAL_PLANS[1] || INITIAL_PLANS[0]);
  const [demoMember] = useState<Member>(INITIAL_MEMBERS[0]);

  // Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    plan: 'Quarterly Strength (₹7,499)',
    message: ''
  });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);

  // Section Refs for scroll tracking
  const heroRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setEquipmentScrollOffset(scrollY * 0.10);

      // Manifesto word-by-word reveal
      if (manifestoRef.current) {
        const rect = manifestoRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const startOffset = windowHeight * 0.85;
        const endOffset = windowHeight * 0.15;
        const totalDist = startOffset - endOffset;
        const currentPos = startOffset - rect.top;
        const prog = Math.max(0, Math.min(1, currentPos / totalDist));
        setManifestoProgress(prog);
      }

      // Community trust panel in view
      if (communityRef.current) {
        const rect = communityRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          setTrustInView(true);
        }
      }

      // Update active nav based on scroll position
      const sections = navItems.map(item => document.getElementById(item.id));
      const currentScrollPos = window.scrollY + 200;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= currentScrollPos) {
          setActiveNav(navItems[i].label);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string, label: string) => {
    setActiveNav(label);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenDemoPaymentForPlan = (plan: MembershipPlan) => {
    setSelectedPlanForDemo(plan);
    setIsDemoPaymentModalOpen(true);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryError(null);

    if (!enquiryForm.fullName.trim()) {
      setEnquiryError('Please enter your full name.');
      return;
    }
    if (!enquiryForm.phone.trim() || enquiryForm.phone.length < 8) {
      setEnquiryError('Please provide a valid contact telephone number.');
      return;
    }
    if (!enquiryForm.email.trim() || !enquiryForm.email.includes('@')) {
      setEnquiryError('Please enter a valid email address.');
      return;
    }

    // Show clear demo confirmation
    setEnquirySubmitted(true);
  };

  const filteredGallery = galleryFilter === 'All'
    ? INITIAL_GALLERY_ITEMS
    : INITIAL_GALLERY_ITEMS.filter(item => item.category.toLowerCase().includes(galleryFilter.toLowerCase()));

  return (
    <div className="w-full bg-[#080808] text-[#F5F5F5] select-none font-sans overflow-x-hidden">
      
      {/* =========================================================================
          GLOBAL STICKY / FLOATING NAVIGATION HEADER
          Monochrome frosted-glass bar with all 8 pages + CRM entry
      ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#080808]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Emblem */}
          <button 
            onClick={() => handleNavClick('hero', 'Home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#C6FF00] group-hover:scale-105 transition-transform">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-archivo-brand text-lg font-bold tracking-wider text-white uppercase leading-none">
                WFIT GYM
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#C6FF00] uppercase mt-0.5">
                ATHLETIC CLUB
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav aria-label="Website Navigation" className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 text-xs">
            {navItems.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.id, item.label)}
                  className={`px-3.5 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-white text-black font-semibold shadow-sm' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('enquiry', 'Enquiry')}
              className="px-4 py-2 rounded-full border border-white/20 text-white hover:border-[#C6FF00] hover:text-[#C6FF00] text-xs font-semibold tracking-wide transition-all cursor-pointer"
            >
              Membership Enquiry
            </button>

            <button
              onClick={onOpenCrm}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              title="Launch Member & Staff Management Portal"
            >
              <span className="w-2 h-2 rounded-full bg-[#BFFF00] animate-pulse" />
              <span>CRM Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenCrm}
              className="px-3 py-1.5 rounded-full bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#BFFF00]" />
              <span>CRM</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 border border-white/15 text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-1 pb-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.id, item.label)}
                className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeNav === item.label
                    ? 'bg-white/15 text-[#C6FF00] font-bold'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 mt-1 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('enquiry', 'Enquiry')}
                className="w-full py-2.5 rounded-lg border border-[#C6FF00] text-[#C6FF00] text-xs font-bold text-center"
              >
                Book Consultation / Enquiry
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          PAGE 1: HOME (HERO SECTION)
          Background: #DADADA, Ink: #111111, Accent: #C6FF00
          Cleaned: "EST. 2019" & "PERFORMANCE FIRST" completely removed!
      ========================================================================= */}
      <section 
        ref={heroRef}
        id="hero"
        className="relative w-full overflow-hidden bg-[#DADADA] text-[#111111] pt-20"
        style={{
          minHeight: 'calc(938 * var(--u))',
          height: 'auto',
        }}
      >
        {/* Realistic Gym Equipment Studio Composition */}
        <div 
          className="equipment-photo-container absolute pointer-events-none z-10 hidden md:block"
          style={{
            left: 'calc(290 * var(--u))',
            top: `calc((-10 + ${equipmentScrollOffset * 0.25}) * var(--u))`,
            width: 'calc(860 * var(--u))',
            height: 'calc(960 * var(--u))',
          }}
        >
          <img 
            src={ASSETS.heroEquipment}
            alt="WFIT Gym premium commercial equipment featuring commercial treadmill, cable crossover station, Olympic barbell, and dumbbells"
            className="w-full h-full object-contain equipment-blend-mask"
            style={{
              filter: 'grayscale(100%) contrast(108%) brightness(0.97)',
            }}
          />
        </div>

        {/* Top Floating Motto Badge */}
        <div 
          className="absolute z-20 hidden md:flex items-center text-black/80 font-mono tracking-wider uppercase text-[calc(12*var(--u))]"
          style={{
            left: 'calc(57 * var(--u))',
            top: 'calc(90 * var(--u))',
          }}
        >
          <span className="flex items-center gap-2 bg-black/5 px-3 py-1 rounded-full border border-black/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#080808]" />
            TRAIN SMART / LIVE STRONG
          </span>
        </div>

        {/* Hero Top Right CTA */}
        <div
          className="absolute z-20 hidden md:flex items-center gap-3"
          style={{
            right: 'calc(57 * var(--u))',
            top: 'calc(85 * var(--u))',
          }}
        >
          <button 
            onClick={() => handleNavClick('membership', 'Membership')}
            className="flex items-center justify-center gap-2 bg-[#080808] text-white rounded-full font-semibold transition-all hover:bg-black px-5 py-2.5 shadow-md text-xs border border-white/10 cursor-pointer"
          >
            <span>Explore Memberships</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C6FF00]" />
          </button>
        </div>

        {/* HERO OVERSIZED TYPOGRAPHY: TRAIN STRONG */}
        {/* "EST. 2019" REMOVED AS REQUESTED */}
        <div 
          className="absolute z-20"
          style={{
            left: 'calc(57 * var(--u))',
            top: 'calc(220 * var(--u))',
          }}
        >
          <div className="relative font-archivo-title text-[calc(92*var(--u))] text-[#080808] uppercase select-none leading-[0.86]">
            <div className="tracking-[-0.055em]">TRAIN</div>
            <div className="relative tracking-[-0.055em]">
              STRONG
            </div>
          </div>
        </div>

        {/* ABOUT WFIT INTRODUCTION BLOCK */}
        <div 
          className="absolute z-20 max-w-[calc(340*var(--u))]"
          style={{
            left: 'calc(57 * var(--u))',
            top: 'calc(430 * var(--u))',
          }}
        >
          <div className="flex items-center gap-2 text-[calc(12*var(--u))] font-semibold text-black/70 uppercase tracking-wider mb-[calc(10*var(--u))]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#080808]" />
            <span>ABOUT WFIT GYM</span>
          </div>

          <p className="text-[calc(14.5*var(--u))] leading-[1.45] text-black/85 font-normal">
            Welcome to WFIT GYM. A premier strength and athletic training facility engineered for dedicated athletes and disciplined fitness enthusiasts.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('about', 'About Us')}
              className="flex items-center justify-center gap-2 bg-[#080808] text-white rounded-full font-medium transition-all hover:bg-black px-6 h-11 text-xs cursor-pointer shadow-md"
            >
              <span>Our Philosophy</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C6FF00]" />
            </button>

            <button 
              onClick={() => handleNavClick('services', 'Services')}
              className="flex items-center justify-center gap-1.5 bg-white/70 hover:bg-white text-black rounded-full font-medium transition-all px-4 h-11 text-xs cursor-pointer border border-black/15 shadow-sm"
            >
              <span>Facilities</span>
            </button>
          </div>
        </div>

        {/* WFIT BRAND PLATE OVER EQUIPMENT */}
        <div 
          className="absolute z-20 hidden md:flex items-center justify-between px-[calc(26*var(--u))] bg-[#080808]/75 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl text-white"
          style={{
            left: 'calc(532 * var(--u))',
            top: 'calc(444 * var(--u))',
            width: 'calc(364 * var(--u))',
            height: 'calc(73 * var(--u))',
          }}
        >
          <div className="flex items-center gap-[calc(14*var(--u))]">
            <div className="w-[calc(28*var(--u))] h-[calc(28*var(--u))] flex items-center justify-center bg-white/10 rounded-lg border border-white/20 text-[#C6FF00]">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-archivo-brand text-[calc(22*var(--u))] tracking-[0.15em] font-bold text-white uppercase">
                WFIT GYM
              </span>
              <span className="text-[calc(9*var(--u))] font-mono tracking-widest text-[#C6FF00] uppercase -mt-1">
                STRENGTH & CONDITIONING
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-white/70 uppercase block">OLYMPIC FLEET</span>
            <span className="text-xs font-mono font-bold text-[#C6FF00]">2026 CALIBRATED</span>
          </div>
        </div>

        {/* FITNESS COMMUNITY & TRAINING CARDS (LOWER-LEFT HERO) */}
        <div 
          className="absolute z-20 hidden md:grid grid-cols-2 gap-[calc(10*var(--u))] p-[calc(8*var(--u))] bg-[#cdcdcd] rounded-2xl shadow-sm border border-black/5"
          style={{
            left: 'calc(57 * var(--u))',
            top: 'calc(693 * var(--u))',
            width: 'calc(356 * var(--u))',
            height: 'calc(208 * var(--u))',
          }}
        >
          {/* Card A: Community */}
          <div className="bg-[#121212] text-white rounded-xl p-[calc(12*var(--u))] flex flex-col justify-between">
            <div>
              <div className="font-archivo-title text-[calc(28*var(--u))] font-bold text-white tracking-tight leading-none flex items-center gap-1">
                <span>{count500}+</span>
                <span className="text-[calc(14*var(--u))] text-[#C6FF00] font-sans font-bold">+</span>
              </div>
              <div className="text-[calc(11*var(--u))] text-white/70 font-medium tracking-tight mt-[calc(2*var(--u))]">
                Active Fitness Community
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 my-[calc(6*var(--u))] text-[calc(8.5*var(--u))] text-white/55 font-mono uppercase tracking-wider">
              <span>· Strength</span>
              <span>· Cardio</span>
              <span>· Mobility</span>
              <span>· Functional</span>
              <span>· Nutrition</span>
              <span>· Coaching</span>
            </div>

            <button 
              onClick={() => handleNavClick('services', 'Services')}
              className="w-full bg-white text-black rounded-lg py-[calc(4*var(--u))] text-[calc(10.5*var(--u))] font-semibold flex items-center justify-center gap-1 hover:bg-[#C6FF00] transition-colors cursor-pointer"
            >
              <span>Explore Facilities</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card B: Training */}
          <div 
            className="relative rounded-xl overflow-hidden bg-black text-white p-[calc(10*var(--u))] flex flex-col justify-between shadow-md"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.3) 65%), url(${ASSETS.dumbbellsTraining})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="border-b border-white/20 pb-[calc(4*var(--u))] flex items-center justify-between text-[calc(9*var(--u))] text-white/80 font-mono uppercase tracking-wider">
              <span>TRAINING</span>
              <span className="text-[#C6FF00]">PROGRESSION</span>
            </div>

            <div className="mt-auto">
              <div className="text-[calc(10.5*var(--u))] text-white font-medium leading-[1.3]">
                Train consistently. Progress with confidence.
              </div>
              <div className="text-[calc(9*var(--u))] text-white/50 font-mono mt-1">
                Verified Coaching Standards
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FEATURED EQUIPMENT CARD */}
        <div 
          className="absolute z-20 hidden md:flex flex-col group cursor-pointer"
          onClick={() => handleNavClick('gallery', 'Gallery')}
          style={{
            right: 'calc(57 * var(--u))',
            top: 'calc(536 * var(--u))',
            width: 'calc(236 * var(--u))',
          }}
        >
          <div className="flex items-center justify-between text-[calc(11.5*var(--u))] font-medium text-black/70 mb-[calc(8*var(--u))]">
            <span className="font-semibold text-black uppercase font-mono text-[calc(10.5*var(--u))]">FEATURED FACILITY</span>
            <span className="font-mono text-black/50">[2026]</span>
          </div>

          <div 
            className="relative rounded-2xl overflow-hidden bg-black shadow-xl border border-black/10"
            style={{ height: 'calc(196 * var(--u))' }}
          >
            <div 
              className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-108"
              style={{
                backgroundImage: `url(${ASSETS.featuredCableMachine})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(100%) contrast(110%)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-[calc(12*var(--u))]">
              <div className="flex justify-between items-start">
                <span className="text-[calc(10*var(--u))] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  Cable Crossover Station
                </span>
                <div className="w-[calc(32*var(--u))] h-[calc(32*var(--u))] rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#C6FF00] group-hover:text-black">
                  <ArrowUpRight className="w-[calc(16*var(--u))] h-[calc(16*var(--u))]" />
                </div>
              </div>
              <div className="w-full h-[calc(3*var(--u))] bg-white/25 rounded-full overflow-hidden">
                <div className="h-full bg-[#C6FF00]" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE HERO VIEWPORT */}
        <div className="md:hidden flex flex-col px-5 pt-8 pb-10 gap-6">
          <div>
            <div className="font-archivo-title text-5xl text-[#080808] uppercase leading-none">
              TRAIN <br />
              STRONG
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-black/70 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#080808]" />
                <span>ABOUT WFIT GYM</span>
              </div>
              <p className="text-sm text-black/85 font-normal leading-relaxed">
                Welcome to WFIT GYM. Build strength, improve performance, and become your strongest self with certified coaching and commercial equipment.
              </p>
              
              <div className="flex flex-wrap gap-2.5 mt-4">
                <button 
                  onClick={() => handleNavClick('membership', 'Membership')}
                  className="flex items-center justify-center gap-2 bg-[#080808] text-white rounded-full font-medium px-5 py-2.5 text-xs cursor-pointer shadow-md"
                >
                  <span>View Membership Plans</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C6FF00]" />
                </button>
                <button 
                  onClick={() => handleNavClick('enquiry', 'Enquiry')}
                  className="px-4 py-2.5 rounded-full border border-black/20 text-black text-xs font-medium"
                >
                  Book Free Tour
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Equipment Hero Image */}
          <div className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-neutral-900 border border-black/10 shadow-lg">
            <img 
              src={ASSETS.heroEquipment}
              alt="WFIT Commercial Gym Equipment"
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(100%) contrast(106%)' }}
            />
            <div className="absolute inset-x-3 bottom-3 bg-[#080808]/85 backdrop-blur-md border border-white/20 rounded-xl p-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#C6FF00]" />
                <span className="font-archivo-brand text-sm tracking-wider font-bold uppercase">WFIT GYM</span>
              </div>
              <span className="text-[10px] font-mono text-[#C6FF00]">2026 CALIBRATED</span>
            </div>
          </div>

          {/* Mobile Stats Summary */}
          <div className="grid grid-cols-2 gap-3 bg-[#cdcdcd] p-3 rounded-xl">
            <div className="bg-[#121212] text-white rounded-lg p-3">
              <div className="font-archivo-title text-2xl font-bold flex items-center gap-1">
                <span>500+</span>
                <span className="text-xs text-[#C6FF00]">+</span>
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">Active Members</div>
              <button 
                onClick={() => handleNavClick('services', 'Services')}
                className="mt-2.5 w-full bg-white text-black rounded py-1 text-[11px] font-semibold"
              >
                Facilities
              </button>
            </div>
            
            <div 
              className="rounded-lg p-3 text-white flex flex-col justify-end bg-black"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(8,8,8,0.92), transparent), url(${ASSETS.dumbbellsTraining})`,
                backgroundSize: 'cover',
              }}
            >
              <div className="text-[10px] font-mono text-[#C6FF00] uppercase">TRAIN DAILY</div>
              <div className="text-[11px] text-white font-medium leading-tight mt-1">Consistency first.</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PAGE 2: ABOUT US SECTION (`#about`)
          Introduction, Mission & Vision, Training Philosophy, Why Choose WFIT
      ========================================================================= */}
      <section 
        id="about" 
        ref={manifestoRef}
        className="w-full bg-[#080808] border-t border-white/10 py-24 px-6 md:px-12 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto space-y-20">
          
          {/* Scroll Manifesto Statement */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C6FF00]" />
              <span>ABOUT WFIT GYM & CORE PHILOSOPHY</span>
            </div>

            <h2 className="font-archivo-wide text-2xl sm:text-4xl md:text-5xl leading-tight font-medium tracking-tight">
              {MANIFESTO_WORDS.map((word, idx) => {
                const totalWords = MANIFESTO_WORDS.length;
                const wordRatio = idx / totalWords;
                const diff = (manifestoProgress - wordRatio) * totalWords;
                
                let color = '#555555';
                if (diff >= 2.5) {
                  color = '#F5F5F5';
                } else if (diff > 0) {
                  const t = diff / 2.5;
                  const r = Math.round(85 + (245 - 85) * t);
                  const g = Math.round(85 + (245 - 85) * t);
                  const b = Math.round(85 + (245 - 85) * t);
                  color = `rgb(${r}, ${g}, ${b})`;
                }

                return (
                  <span key={idx} className="inline-block transition-colors duration-150 mr-[0.25em]" style={{ color }}>
                    {word}
                  </span>
                );
              })}
            </h2>

            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Expert coaching. Calibrated commercial equipment. A stronger, more capable version of yourself.
            </p>
          </div>

          {/* Mission & Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 space-y-4 hover:border-white/25 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C6FF00]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-archivo-wide text-xl font-bold uppercase text-white tracking-wide">
                Our Mission
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                To provide a focused, distraction-free environment where members cultivate physical strength, cardiovascular endurance, and athletic longevity through science-grounded training methods.
              </p>
            </div>

            <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 space-y-4 hover:border-white/25 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C6FF00]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-archivo-wide text-xl font-bold uppercase text-white tracking-wide">
                Our Vision
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                To be the benchmark fitness institution recognized for verified coach credentials, immaculate equipment maintenance, and an inclusive athletic culture that values steady progression over fleeting fitness trends.
              </p>
            </div>
          </div>

          {/* Training Philosophy & Why Choose WFIT */}
          <div className="border-t border-white/10 pt-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono text-[#C6FF00] uppercase tracking-widest block mb-2">
                THE WFIT DIFFERENCE
              </span>
              <h3 className="font-archivo-title text-2xl sm:text-3xl text-white uppercase tracking-tight">
                Why Choose WFIT GYM
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-2">
                Four core operational standards that separate WFIT from ordinary gyms.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-5 space-y-3">
                <span className="text-xs font-mono text-[#C6FF00] font-bold">01 // FLOOR DISCIPLINE</span>
                <h4 className="font-bold text-white text-base">Uncluttered Squat & Deadlift Zones</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Generously spaced power racks and deadlift platforms. No waiting 30 minutes for a barbell station during peak hours.
                </p>
              </div>

              <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-5 space-y-3">
                <span className="text-xs font-mono text-[#C6FF00] font-bold">02 // COACHING INTEGRITY</span>
                <h4 className="font-bold text-white text-base">Certified Biomechanics Specialists</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Every personal trainer holds accredited certifications (CSCS, NASM, ISSA) and focuses on safe joint mechanics.
                </p>
              </div>

              <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-5 space-y-3">
                <span className="text-xs font-mono text-[#C6FF00] font-bold">03 // PRECISION FLEET</span>
                <h4 className="font-bold text-white text-base">Calibrated Plates & Custom Machinery</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Calibrated steel plates, rubber dumbbells up to 60 kg, dual-adjustable pulleys, and smooth commercial cardio ergometers.
                </p>
              </div>

              <div className="bg-[#0e0e0e] border border-white/10 rounded-xl p-5 space-y-3">
                <span className="text-xs font-mono text-[#C6FF00] font-bold">04 // CONNECTED PROGRESS</span>
                <h4 className="font-bold text-white text-base">Integrated Member CRM & Tracking</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Members log workouts, verify attendance, and monitor body composition through WFIT’s dedicated portal.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          PAGE 3: SERVICES SECTION (`#services`)
          Strength, Personal Coaching, Cardio, Functional Fitness, Guidance
      ========================================================================= */}
      <section id="services" className="w-full bg-[#080808] border-t border-white/10 py-24 px-6 md:px-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-4">
            <div>
              <span className="text-xs font-mono text-[#C6FF00] uppercase tracking-widest block mb-2">
                02. COMPREHENSIVE TRAINING OFFERINGS
              </span>
              <h2 className="font-archivo-title text-3xl sm:text-4xl text-white tracking-tight uppercase">
                SERVICES & DISCIPLINES
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-md">
              Specialized training programs designed to support beginner fundamentals through advanced competitive athletic preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Service 1: Strength Training */}
            <div className="group bg-[#121212] rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all flex flex-col shadow-xl">
              <div className="relative h-60 overflow-hidden bg-neutral-900">
                <img 
                  src={ASSETS.strengthFeature} 
                  alt="Strength Training" 
                  className="w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/75 px-3 py-1 rounded-full text-[11px] font-mono text-white uppercase border border-white/15">
                  SERVICE 01
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <h3 className="font-archivo-wide text-xl font-bold uppercase text-white">Strength Training</h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
                    Heavy compound lifting, Olympic weightlifting platforms, competition barbells, and comprehensive free-weight selection for raw strength.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-white/60 font-mono">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> 5 Power Racks & Deadlift Platforms</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Dumbbells up to 60 kg</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Calibrated Steel Competition Plates</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleNavClick('enquiry', 'Enquiry')}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#C6FF00] hover:text-black text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enquire About Strength</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Service 2: Personal Training */}
            <div className="group bg-[#121212] rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all flex flex-col shadow-xl">
              <div className="relative h-60 overflow-hidden bg-neutral-900">
                <img 
                  src={ASSETS.coachingFeature} 
                  alt="Personal Coaching" 
                  className="w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/75 px-3 py-1 rounded-full text-[11px] font-mono text-white uppercase border border-white/15">
                  SERVICE 02
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <h3 className="font-archivo-wide text-xl font-bold uppercase text-white">1-on-1 Personal Coaching</h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
                    Direct instruction from certified strength coaches. Includes custom periodized routines, real-time form correction, and dietary accountability.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-white/60 font-mono">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Movement Screening & Posture Check</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Custom Weekly Progression Splits</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Bi-weekly Body Composition Scans</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleNavClick('trainers', 'Trainers')}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#C6FF00] hover:text-black text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Coach Roster</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Service 3: Cardio & Conditioning */}
            <div className="group bg-[#121212] rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all flex flex-col shadow-xl">
              <div className="relative h-60 overflow-hidden bg-neutral-900">
                <img 
                  src={ASSETS.cardioFeature} 
                  alt="Cardio & Endurance" 
                  className="w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/75 px-3 py-1 rounded-full text-[11px] font-mono text-white uppercase border border-white/15">
                  SERVICE 03
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <h3 className="font-archivo-wide text-xl font-bold uppercase text-white">Cardio & Metabolic Conditioning</h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
                    Build aerobic capacity and athletic work capacity with commercial curved runners, rowers, assault bikes, and dedicated interval circuits.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-white/60 font-mono">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Non-Motorized Curved Treadmills</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Concept2 Rowing & SkiErg Stations</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#C6FF00]" /> Heart Rate Zone Guidance</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleNavClick('enquiry', 'Enquiry')}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#C6FF00] hover:text-black text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enquire About Conditioning</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Two Additional Supporting Disciplines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C6FF00] shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#C6FF00] uppercase">SERVICE 04</span>
                <h4 className="font-archivo-wide text-lg font-bold text-white uppercase">Functional Fitness & Turf Training</h4>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  Dedicated 25-meter indoor sprint turf, sled pushes, kettlebells, battle ropes, and plyometric boxes for high-speed athletic conditioning.
                </p>
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C6FF00] shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#C6FF00] uppercase">SERVICE 05</span>
                <h4 className="font-archivo-wide text-lg font-bold text-white uppercase">General Fitness Guidance & Movement Screen</h4>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  Complimentary initial movement screening for all new members to identify joint imbalances, assess mobility, and recommend safe training starts.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          PAGE 4: TRAINERS SECTION (`#trainers`)
          Profiles, Photographs, Specializations, Experience, Direct Inquiry
      ========================================================================= */}
      <section id="trainers" className="w-full bg-[#080808] border-t border-white/10 py-24 px-6 md:px-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-4">
            <div>
              <span className="text-xs font-mono text-[#C6FF00] uppercase tracking-widest block mb-2">
                03. EXPERT COACHING STAFF
              </span>
              <h2 className="font-archivo-title text-3xl sm:text-4xl text-white tracking-tight uppercase">
                CERTIFIED TRAINERS
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-md">
              Every WFIT trainer is a full-time, credentialed professional dedicated to safe biomechanics and measurable member progress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_TRAINERS.map((trainer) => (
              <div 
                key={trainer.id}
                className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all group"
              >
                <div>
                  {/* Photo with overlay */}
                  <div className="relative h-64 overflow-hidden bg-neutral-900">
                    <img 
                      src={trainer.photoUrl} 
                      alt={trainer.name}
                      className="w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4">
                      <div>
                        <span className="text-[10px] font-mono text-[#C6FF00] uppercase block">
                          {trainer.experienceYears} Years Exp.
                        </span>
                        <h4 className="font-archivo-wide text-lg font-bold text-white uppercase">
                          {trainer.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] text-white/50 uppercase font-mono block">Specialisation</span>
                      <p className="text-xs text-white/90 font-medium mt-0.5 line-clamp-2">
                        {trainer.specialisation}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <span className="text-[10px] text-white/50 uppercase font-mono block">Certifications</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {trainer.certifications?.map((cert, cIdx) => (
                          <span key={cIdx} className="text-[9.5px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/80">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed pt-1">
                      {trainer.bio}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      setEnquiryForm(prev => ({
                        ...prev,
                        message: `I would like to inquire about personal coaching with Coach ${trainer.name}.`
                      }));
                      handleNavClick('enquiry', 'Enquiry');
                    }}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-[#C6FF00] hover:text-black text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Consult Coach</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          PAGE 5: MEMBERSHIP SECTION (`#membership`)
          Monthly, Quarterly, Half-Yearly, Annual + ACTIVE DEMO PAYMENT TRIGGER
      ========================================================================= */}
      <section id="membership" className="w-full bg-[#080808] border-t border-white/10 py-24 px-6 md:px-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono text-[#C6FF00] uppercase tracking-widest block">
              04. TRANSPARENT MEMBERSHIP TIERS
            </span>
            <h2 className="font-archivo-title text-3xl sm:text-5xl text-white tracking-tight uppercase">
              MEMBERSHIP PLANS & RATES
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              All plans include complete gym floor access, locker facilities, and complimentary movement screenings. Select any plan to experience the full interactive demo payment flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_PLANS.map((plan) => {
              const isPopular = plan.id === 'plan-3m';
              const isAnnual = plan.id === 'plan-12m';

              return (
                <div 
                  key={plan.id}
                  className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                    isPopular 
                      ? 'bg-gradient-to-b from-[#181818] to-[#101010] border-2 border-[#C6FF00] shadow-2xl scale-102' 
                      : 'bg-[#121212] border border-white/12 hover:border-white/30'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C6FF00] text-black text-[10px] font-mono font-bold uppercase px-3 py-0.5 rounded-full shadow-md">
                      MOST POPULAR
                    </div>
                  )}

                  {isAnnual && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-mono font-bold uppercase px-3 py-0.5 rounded-full shadow-md">
                      BEST VALUE
                    </div>
                  )}

                  <div>
                    <div className="border-b border-white/10 pb-4">
                      <h3 className="font-archivo-wide text-lg font-bold text-white uppercase">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-white/60 mt-1">
                        {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'} Access
                      </p>
                    </div>

                    {/* Price in ₹ */}
                    <div className="py-5">
                      <div className="flex items-baseline gap-1">
                        <span className="font-archivo-title text-4xl font-bold text-white">
                          ₹{plan.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-white/50 block mt-1">
                        {plan.durationMonths > 1 
                          ? `(Approx ₹${Math.round(plan.price / plan.durationMonths).toLocaleString('en-IN')}/mo)` 
                          : 'Monthly recurring commitment'}
                      </span>
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-2.5 pt-2 border-t border-white/10">
                      <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                        Included Privileges:
                      </span>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-white/80">
                          <Check className="w-3.5 h-3.5 text-[#C6FF00] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-8 space-y-2.5">
                    {/* Primary Button: Trigger Interactive Payment Demo */}
                    <button
                      onClick={() => handleOpenDemoPaymentForPlan(plan)}
                      className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                        isPopular
                          ? 'bg-[#C6FF00] hover:bg-[#b5ee00] text-black'
                          : 'bg-white hover:bg-white/90 text-black'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Select & Test Demo Payment</span>
                    </button>

                    {/* Secondary Button: Enquire */}
                    <button
                      onClick={() => {
                        setEnquiryForm(prev => ({
                          ...prev,
                          plan: `${plan.name} (₹${plan.price.toLocaleString('en-IN')})`
                        }));
                        handleNavClick('enquiry', 'Enquiry');
                      }}
                      className="w-full py-2 rounded-xl border border-white/15 hover:border-white/30 text-white/80 hover:text-white text-xs font-medium transition-all text-center"
                    >
                      Enquire About This Plan
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Interactive Demo Payment Notice Banner */}
          <div className="bg-[#121212] border border-[#1D4ED8]/40 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-[#60A5FA] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-white/80">
                <strong>Client Presentation Mode:</strong> Clicking "Select & Test Demo Payment" opens an interactive simulation with Cash, UPI QR, and Online Card modes, generating official test receipts without real financial charges.
              </p>
            </div>
            <button
              onClick={() => handleOpenDemoPaymentForPlan(INITIAL_PLANS[1])}
              className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold rounded-lg shrink-0 cursor-pointer text-xs"
            >
              Launch Demo Checkout →
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          PAGE 6: GALLERY SECTION (`#gallery`)
          Interiors, equipment, workout areas + High-res Modal Lightbox
      ========================================================================= */}
      <section id="gallery" className="w-full bg-[#080808] border-t border-white/10 py-24 px-6 md:px-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-4">
            <div>
              <span className="text-xs font-mono text-[#C6FF00] uppercase tracking-widest block mb-2">
                05. FACILITY TOUR & PHOTOGRAPHS
              </span>
              <h2 className="font-archivo-title text-3xl sm:text-4xl text-white tracking-tight uppercase">
                GYM INTERIORS & EQUIPMENT GALLERY
              </h2>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {['All', 'Strength', 'Functional', 'Cardio', 'Interior'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setGalleryFilter(filter)}
                  className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    galleryFilter === filter 
                      ? 'bg-white text-black font-bold border-white' 
                      : 'border-white/20 text-white/70 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedGalleryPhoto(item)}
                className="group relative h-72 rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-white/30 transition-all cursor-pointer shadow-lg"
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-106 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="self-start text-[10px] font-mono text-white/90 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm border border-white/15">
                    {item.category}
                  </span>

                  <div>
                    <h4 className="font-archivo-wide text-base font-bold text-white uppercase group-hover:text-[#C6FF00] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-white/70 mt-1 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-[#C6FF00]">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Click to view full photo</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          PAGE 7: TESTIMONIALS SECTION (Clearly Labeled Demo / Sample Content)
      ========================================================================= */}
      <section className="w-full bg-[#0a0a0a] border-t border-white/10 py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#60A5FA] text-xs font-mono uppercase">
              <span>SAMPLE CLIENT EXPERIENCES (DEMO DATA)</span>
            </div>
            <h3 className="font-archivo-title text-2xl sm:text-3xl text-white uppercase tracking-tight">
              COMMUNITY VOICES
            </h3>
            <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto">
              Sample feedback illustrating member satisfaction with coaching standards, equipment hygiene, and atmosphere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_TESTIMONIALS.map((t, idx) => (
              <div 
                key={idx}
                className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-5"
              >
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic">
                  "{t.quote}"
                </p>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <img 
                    src={t.avatar} 
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover filter grayscale contrast-110 border border-white/20" 
                  />
                  <div>
                    <h5 className="font-bold text-white text-xs">{t.name}</h5>
                    <div className="text-[10px] text-white/50 font-mono">{t.badge}</div>
                    <div className="text-[9.5px] text-[#C6FF00] font-mono">{t.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          PAGE 8: CONTACT US SECTION (`#contact`)
          Address, Phone, Email, Hours, Location Map (Placeholders marked clearly)
      ========================================================================= */}
      <section id="contact" className="w-full bg-[#080808] border-t border-white/10 py-24 px-6 md:px-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-4">
            <div>
              <span className="text-xs font-mono text-[#C6FF00] uppercase tracking-widest block mb-2">
                06. LOCATION & HOURS
              </span>
              <h2 className="font-archivo-title text-3xl sm:text-4xl text-white tracking-tight uppercase">
                CONTACT WFIT GYM
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-md">
              Visit our facility for an on-site equipment walkthrough. Verified contact details and operating schedule below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Contact Information (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Address Card */}
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C6FF00]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/50 uppercase">Gym Location</span>
                    <h4 className="font-bold text-white text-sm">Main Facility Address</h4>
                  </div>
                </div>
                
                <div className="space-y-1 text-xs text-white/80 pl-1">
                  <p className="font-medium text-white">WFIT Gym Club Premises</p>
                  <p className="text-amber-400 bg-amber-400/10 px-2 py-1 rounded font-mono text-[11px] inline-block mt-1">
                    [Client Address Placeholder: To be updated with confirmed physical street address]
                  </p>
                  <p className="text-white/60 mt-1">Commercial Fitness Zone, City, State - PIN</p>
                </div>
              </div>

              {/* Phone & Email Card */}
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C6FF00] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/50 uppercase">Telephone Desk</span>
                    <p className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded font-mono text-xs inline-block mt-0.5">
                      [Client Phone Placeholder: +91 98XXX XXXXX]
                    </p>
                    <p className="text-[11px] text-white/50 mt-1">Available during open hours for walk-in inquiries.</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C6FF00] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/50 uppercase">Official Email</span>
                    <p className="text-xs font-mono text-white font-semibold">
                      admin@wfitgym.com
                    </p>
                    <a 
                      href="mailto:admin@wfitgym.com"
                      className="text-[11px] text-[#C6FF00] hover:underline font-mono inline-block mt-0.5"
                    >
                      Send direct email inquiry →
                    </a>
                  </div>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#C6FF00]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/50 uppercase">Schedule</span>
                    <h4 className="font-bold text-white text-sm">Operating Club Hours</h4>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono text-white/80 pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Monday – Saturday</span>
                    <span className="font-bold text-white">06:00 AM – 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Sunday (Recovery/Open)</span>
                    <span className="font-bold text-white">07:00 AM – 02:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-[#C6FF00]">
                    <span>Public Holidays</span>
                    <span>Special Morning Slots</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Location Map Card (7 cols) */}
            <div className="lg:col-span-7 bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              
              {/* Map Canvas Placeholder */}
              <div className="relative h-80 sm:h-96 w-full bg-[#181818] flex items-center justify-center p-6 text-center overflow-hidden">
                {/* Subtle map grid background */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                />

                <div className="relative z-10 max-w-md space-y-3 p-6 bg-black/80 backdrop-blur-md rounded-2xl border border-white/15 text-white">
                  <div className="w-12 h-12 rounded-full bg-[#C6FF00]/20 text-[#C6FF00] flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="font-archivo-wide text-base font-bold uppercase">
                    Interactive Location Map
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    [Google Maps Embed to be linked to verified physical location once client provides official gym address coordinates]
                  </p>
                  <a
                    href="https://maps.google.com/?q=gym+fitness"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-[#C6FF00] transition-colors"
                  >
                    <span>Open Maps Search</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Bottom Quick Directions Info */}
              <div className="p-5 bg-[#0f0f0f] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
                <span>Free On-Site Member Parking & Valet Available</span>
                <span className="font-mono text-[#C6FF00]">Near Main City Transit Hub</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          PAGE 9: ENQUIRY SECTION (`#enquiry`)
          Validated Inquiry Form with Clear Demo Submission Confirmation
      ========================================================================= */}
      <section id="enquiry" className="w-full bg-[#080808] border-t border-white/10 py-24 px-6 md:px-12 scroll-mt-20">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-[#C6FF00] uppercase tracking-widest block">
              07. CONNECT WITH WFIT
            </span>
            <h2 className="font-archivo-title text-3xl sm:text-4xl text-white tracking-tight uppercase">
              MEMBERSHIP & TRAINING ENQUIRY
            </h2>
            <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto">
              Ready to begin? Submit your details below to schedule an assessment or reserve a complimentary club walkthrough.
            </p>
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
            
            {enquiryError && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{enquiryError}</span>
              </div>
            )}

            <form onSubmit={handleEnquirySubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={enquiryForm.fullName}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, fullName: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6FF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6FF00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6FF00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                    Interested Membership Plan *
                  </label>
                  <select
                    value={enquiryForm.plan}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, plan: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#C6FF00]"
                  >
                    <option value="Monthly Strength (₹2,999)">Monthly Strength (₹2,999)</option>
                    <option value="Quarterly Strength (₹7,499)">Quarterly Strength (₹7,499) — Most Popular</option>
                    <option value="Half-Yearly Athletic (₹13,499)">Half-Yearly Athletic (₹13,499)</option>
                    <option value="Annual Performance (₹22,999)">Annual Performance (₹22,999) — Best Value</option>
                    <option value="1-on-1 Personal Coaching Consultation">1-on-1 Personal Coaching Consultation</option>
                    <option value="Complimentary Movement Screening & Tour">Complimentary Movement Screening & Tour</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-1.5">
                  Message / Specific Fitness Goals (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details regarding training background, target goals, or questions..."
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6FF00]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[11px] font-mono text-white/50 text-left">
                  Notice: Demo submission mode. No external telemarketing or spam.
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#C6FF00] hover:bg-[#b5ee00] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Demo Enquiry</span>
                </button>
              </div>

            </form>

          </div>

        </div>
      </section>

      {/* =========================================================================
          PAGE 10: PROFESSIONAL FOOTER
          Cleaned: "EST. 2019" REMOVED! Includes full nav links, services, contact, copyright
      ========================================================================= */}
      <footer className="w-full bg-[#050505] border-t border-white/10 pt-16 pb-12 px-6 md:px-12 text-xs text-white/60">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Col 1 & 2: Gym Identity & Description */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#C6FF00]">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <span className="font-archivo-brand text-xl font-bold tracking-wider text-white uppercase">
                  WFIT GYM
                </span>
              </div>
              
              <p className="text-white/70 text-xs leading-relaxed max-w-sm">
                WFIT GYM is a modern strength and athletic conditioning facility built for dedicated lifters, athletes, and fitness enthusiasts. Equipped with calibrated barbells, competition racks, and certified coaches.
              </p>

              <div className="pt-2 text-[11px] font-mono text-white/40">
                [Social Media Links: Instagram / YouTube / Facebook profiles to be connected upon client deployment]
              </div>
            </div>

            {/* Col 3: Quick Navigation */}
            <div className="space-y-3">
              <h5 className="font-mono text-white uppercase text-xs tracking-wider font-bold">Quick Navigation</h5>
              <ul className="space-y-2 text-xs">
                {navItems.map(item => (
                  <li key={item.label}>
                    <button 
                      onClick={() => handleNavClick(item.id, item.label)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Services */}
            <div className="space-y-3">
              <h5 className="font-mono text-white uppercase text-xs tracking-wider font-bold">Core Disciplines</h5>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => handleNavClick('services', 'Services')} className="hover:text-white">Strength Training</button></li>
                <li><button onClick={() => handleNavClick('services', 'Services')} className="hover:text-white">1-on-1 Personal Coaching</button></li>
                <li><button onClick={() => handleNavClick('services', 'Services')} className="hover:text-white">Cardio Conditioning</button></li>
                <li><button onClick={() => handleNavClick('services', 'Services')} className="hover:text-white">Functional Turf Training</button></li>
                <li><button onClick={() => handleNavClick('services', 'Services')} className="hover:text-white">Movement Screening</button></li>
              </ul>
            </div>

            {/* Col 5: Contact Info */}
            <div className="space-y-3">
              <h5 className="font-mono text-white uppercase text-xs tracking-wider font-bold">Contact & Access</h5>
              <div className="space-y-2 text-xs text-white/70">
                <p>WFIT Gym Club Premises</p>
                <p className="text-amber-400 font-mono text-[11px]">[Address to be finalized]</p>
                <p>admin@wfitgym.com</p>
                <p className="font-mono">Mon-Sat: 06:00 - 22:00</p>
                <p className="font-mono">Sun: 07:00 - 14:00</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenCrm}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-[11px] font-bold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BFFF00]" />
                  <span>Staff & CRM Login</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Strip */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
            <span>© 2026 WFIT GYM. All rights reserved.</span>
            <span className="font-mono">Demonstration Version Ready for Client Presentation</span>
          </div>

        </div>
      </footer>

      {/* =========================================================================
          MODAL 1: GALLERY LIGHTBOX MODAL
      ========================================================================= */}
      {selectedGalleryPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative max-w-4xl w-full bg-[#121212] border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedGalleryPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-[460px] sm:h-[520px] w-full bg-black">
              <img 
                src={selectedGalleryPhoto.image} 
                alt={selectedGalleryPhoto.title}
                className="w-full h-full object-contain" 
              />
            </div>

            <div className="p-6 bg-[#121212] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#C6FF00] uppercase block">
                  {selectedGalleryPhoto.category}
                </span>
                <h3 className="font-archivo-wide text-lg font-bold text-white uppercase mt-0.5">
                  {selectedGalleryPhoto.title}
                </h3>
                <p className="text-xs text-white/70 mt-1 max-w-lg">
                  {selectedGalleryPhoto.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedGalleryPhoto(null)}
                className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#C6FF00] transition-colors"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ENQUIRY SUBMISSION CONFIRMATION MODAL
      ========================================================================= */}
      {enquirySubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="max-w-md w-full bg-[#121212] border border-[#C6FF00]/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-[#C6FF00]/20 text-[#C6FF00] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-archivo-wide text-xl font-bold uppercase text-white">
              DEMO INQUIRY SUBMISSION CONFIRMED
            </h3>

            <p className="text-xs text-white/80 leading-relaxed">
              Thank you, <strong className="text-white">{enquiryForm.fullName}</strong>! In this client demonstration version, your inquiry for <strong className="text-[#C6FF00]">{enquiryForm.plan}</strong> has been validated and recorded in the demo system.
            </p>

            <div className="bg-neutral-900 border border-white/10 rounded-xl p-3 text-[11px] font-mono text-white/60 text-left space-y-1">
              <div>• Phone: <span className="text-white">{enquiryForm.phone}</span></div>
              <div>• Email: <span className="text-white">{enquiryForm.email}</span></div>
              <div>• Status: <span className="text-[#C6FF00]">Simulated Lead Generated</span></div>
            </div>

            <p className="text-[10px] text-white/50 italic">
              Notice: This is a demo version. No real external SMS or emails are dispatched.
            </p>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  setEnquirySubmitted(false);
                  setEnquiryForm({
                    fullName: '',
                    phone: '',
                    email: '',
                    plan: 'Quarterly Strength (₹7,499)',
                    message: ''
                  });
                }}
                className="w-full py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-[#C6FF00] transition-colors"
              >
                Close Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: INTERACTIVE DEMO PAYMENT MODAL (TRIGGERED FROM PUBLIC MEMBERSHIP)
      ========================================================================= */}
      <DemoPaymentModal
        isOpen={isDemoPaymentModalOpen}
        onClose={() => setIsDemoPaymentModalOpen(false)}
        member={demoMember}
        plans={INITIAL_PLANS}
        initialInvoice={{
          id: `DEMO-INV-${Math.floor(1000 + Math.random() * 9000)}`,
          memberId: demoMember.id,
          memberName: demoMember.fullName,
          planId: selectedPlanForDemo.id,
          planName: selectedPlanForDemo.name,
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          items: [
            {
              description: `${selectedPlanForDemo.name} (${selectedPlanForDemo.durationMonths} Months Access)`,
              amount: selectedPlanForDemo.price
            }
          ],
          subtotal: Math.round(selectedPlanForDemo.price / 1.18),
          discount: 0,
          tax: Math.round(selectedPlanForDemo.price - (selectedPlanForDemo.price / 1.18)),
          total: selectedPlanForDemo.price,
          amountPaid: 0,
          balanceDue: selectedPlanForDemo.price,
          status: 'PENDING',
          paymentMethod: 'UPI',
          paymentReference: `DEMO-REF-${Math.floor(100000 + Math.random() * 900000)}`,
          branch: 'Downtown Flagship'
        }}
        onSimulateSuccess={(updatedInvoice) => {
          // Keep receipt open inside modal for client inspection
        }}
      />

    </div>
  );
};
