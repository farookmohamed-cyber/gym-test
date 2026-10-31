import React, { useState, useEffect } from 'react';
import { WFitLanding } from './components/WFitLanding';
import { WFitCrm } from './components/WFitCrm';
import { LoginModal } from './components/LoginModal';
import { 
  INITIAL_PLANS, 
  INITIAL_MEMBERS, 
  INITIAL_INVOICES, 
  INITIAL_LEADS, 
  INITIAL_BIOMETRIC_LOGS, 
  INITIAL_PT_SESSIONS, 
  INITIAL_RENEWAL_TASKS, 
  INITIAL_AUDIT_LOGS 
} from './mockData';
import { Dumbbell, X, CheckCircle2, Shield, Lock, LogIn } from 'lucide-react';
import { UserAccount } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'crm'>('landing');
  
  // Authenticated State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Modals
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinSubmitted, setJoinSubmitted] = useState(false);

  const [joinFormData, setJoinFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    preferredProgram: 'Strength Training',
    preferredTime: 'Morning (06:00 - 10:00)',
    goals: ''
  });

  // Verify persistent session on load
  useEffect(() => {
    const savedToken = localStorage.getItem('wfit_auth_token');
    if (savedToken) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setCurrentUser(data.user);
        setAuthToken(savedToken);
      })
      .catch(() => {
        localStorage.removeItem('wfit_auth_token');
        setCurrentUser(null);
        setAuthToken(null);
      });
    }
  }, []);

  const handleOpenCrm = () => {
    if (currentUser && authToken) {
      setCurrentView('crm');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: UserAccount, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    setCurrentView('crm');
  };

  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.removeItem('wfit_auth_token');
    setCurrentUser(null);
    setAuthToken(null);
    setCurrentView('landing');
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinSubmitted(true);
    setTimeout(() => {
      setJoinSubmitted(false);
      setIsJoinModalOpen(false);
    }, 2400);
  };

  return (
    <div className={`relative min-h-screen ${currentView === 'landing' ? 'bg-[#080808] text-[#F5F5F5]' : 'bg-[#FFFFFF] text-[#172033]'}`}>
      
      {/* Floating Mode Switcher Badge */}
      <aside 
        aria-label="Platform View Switcher" 
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-1.5 p-1.5 rounded-full backdrop-blur-md shadow-2xl transition-all ${
          currentView === 'landing'
            ? 'bg-neutral-900/95 border border-white/20'
            : 'bg-white/95 border border-[#E2E8F0] shadow-xl'
        }`}
      >
        <button
          onClick={() => setCurrentView('landing')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            currentView === 'landing' 
              ? 'bg-white text-black shadow-md' 
              : 'text-[#5B6475] hover:text-[#172033]'
          }`}
        >
          WFIT Gym Club
        </button>

        <button
          onClick={handleOpenCrm}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            currentView === 'crm' 
              ? 'bg-[#1D4ED8] text-white shadow-md font-bold' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          {currentUser ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#BFFF00] animate-pulse" />
              <span>CRM ({currentUser.role.split(' ')[0]})</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-[#C6FF00]" />
              <span>Sign In to CRM</span>
            </>
          )}
        </button>
      </aside>

      {/* Main View Router */}
      {currentView === 'landing' ? (
        <WFitLanding 
          onOpenCrm={handleOpenCrm}
          onJoinClick={() => setIsJoinModalOpen(true)}
          onExplorePrograms={() => {
            const el = document.getElementById('features-programs');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      ) : (
        currentUser && authToken ? (
          <WFitCrm 
            onBackToLanding={() => setCurrentView('landing')}
            currentUser={currentUser}
            authToken={authToken}
            onLogout={handleLogout}
            onSwitchDemoAccount={(account) => {
              setCurrentUser(account);
              if (!authToken) {
                setAuthToken('demo-token-' + account.id);
              }
            }}
            initialPlans={INITIAL_PLANS}
            initialMembers={INITIAL_MEMBERS}
            initialInvoices={INITIAL_INVOICES}
            initialLeads={INITIAL_LEADS}
            initialLogs={INITIAL_BIOMETRIC_LOGS}
            initialPTSessions={INITIAL_PT_SESSIONS}
            initialRenewals={INITIAL_RENEWAL_TASKS}
            initialAuditLogs={INITIAL_AUDIT_LOGS}
          />
        ) : (
          <WFitLanding 
            onOpenCrm={handleOpenCrm}
            onJoinClick={() => setIsJoinModalOpen(true)}
          />
        )
      )}

      {/* Login & Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Join WFIT / Assessment Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0f0f0f] border border-white/20 rounded-2xl text-white shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {joinSubmitted ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#C6FF00] mx-auto" />
                <h3 className="text-xl font-bold text-white uppercase font-archivo-wide">Session Reserved</h3>
                <p className="text-xs text-white/70 max-w-xs mx-auto">
                  Welcome to WFIT. Our head strength coach will contact you at {joinFormData.mobile || 'your phone'} to finalize your initial assessment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-[#C6FF00]" />
                    <span className="font-archivo-brand text-lg tracking-wider uppercase">WFIT GYM</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white/80 mt-1">Start Your Fitness Journey</h3>
                  <p className="text-xs text-white/50">Complimentary 1-on-1 Movement Screen & Club Access Tour</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/70 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={joinFormData.name}
                      onChange={(e) => setJoinFormData({...joinFormData, name: e.target.value})}
                      className="w-full bg-neutral-900 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6FF00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/70 mb-1">Mobile Contact *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={joinFormData.mobile}
                      onChange={(e) => setJoinFormData({...joinFormData, mobile: e.target.value})}
                      className="w-full bg-neutral-900 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6FF00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/70 mb-1">Primary Discipline</label>
                    <select
                      value={joinFormData.preferredProgram}
                      onChange={(e) => setJoinFormData({...joinFormData, preferredProgram: e.target.value})}
                      className="w-full bg-neutral-900 border border-white/20 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#C6FF00]"
                    >
                      <option value="Strength Training">Strength & Free Weights</option>
                      <option value="Cardio & Endurance">Cardio & Conditioning</option>
                      <option value="Personal Coaching">1-on-1 Personal Coaching</option>
                      <option value="Mobility & Recovery">Mobility & Longevity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-white/70 mb-1">Preferred Slot</label>
                    <select
                      value={joinFormData.preferredTime}
                      onChange={(e) => setJoinFormData({...joinFormData, preferredTime: e.target.value})}
                      className="w-full bg-neutral-900 border border-white/20 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#C6FF00]"
                    >
                      <option value="Early Bird (06:00 - 08:00)">Early Bird (06:00 - 08:00)</option>
                      <option value="Morning (08:00 - 11:00)">Morning (08:00 - 11:00)</option>
                      <option value="Afternoon (12:00 - 16:00)">Afternoon (12:00 - 16:00)</option>
                      <option value="Evening (17:00 - 21:00)">Evening (17:00 - 21:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/70 mb-1">Specific Goals / Injury History</label>
                  <textarea
                    rows={2}
                    placeholder="Hypertrophy, athletic conditioning, fat loss, or return to training..."
                    value={joinFormData.goals}
                    onChange={(e) => setJoinFormData({...joinFormData, goals: e.target.value})}
                    className="w-full bg-neutral-900 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C6FF00]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#C6FF00] hover:bg-[#b5ee00] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer mt-2"
                >
                  Confirm Free Assessment & Pass
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
