import React, { useState } from 'react';
import { Dumbbell, Eye, EyeOff, Lock, User, AlertCircle, ShieldCheck, ArrowRight, Loader2, X, Sparkles } from 'lucide-react';
import { UserAccount } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount, token: string, permissions: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [identifier, setIdentifier] = useState('admin@wfitgym.com');
  const [password, setPassword] = useState('Admin@WFIT2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed. Please verify credentials.');
      }

      // Store in memory & localStorage for session persistence
      localStorage.setItem('wfit_auth_token', data.token);
      onLoginSuccess(data.user, data.token, data.permissions);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoLogin = async (demoUser: string, demoPass: string) => {
    setIdentifier(demoUser);
    setPassword(demoPass);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: demoUser, password: demoPass })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Demo authentication failed.');
      }

      localStorage.setItem('wfit_auth_token', data.token);
      onLoginSuccess(data.user, data.token, data.permissions);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl text-[#172033] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Demo Mode Ribbon */}
        <div className="bg-[#1D4ED8] text-white px-4 py-1.5 text-center text-[11px] font-bold font-mono tracking-wider uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INTERACTIVE CLIENT DEMO — SELECT ANY SAMPLE ROLE</span>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-4 p-1.5 rounded-full text-[#70798A] hover:text-[#172033] hover:bg-slate-100 transition-colors z-10"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header */}
        <div className="p-6 bg-[#F8FAFC] border-b border-[#E2E8F0] text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Dumbbell className="w-6 h-6 text-[#1D4ED8]" />
          </div>

          <h2 className="font-archivo-brand text-xl font-bold tracking-widest text-[#172033] uppercase">
            WFIT GYM CRM
          </h2>
          <p className="text-xs text-[#5B6475] mt-1 font-mono font-semibold">
            DEMO VERSION • ROLE-BASED DASHBOARDS
          </p>
        </div>

        {/* 1-Click Instant Demo Role Switcher */}
        <div className="p-5 border-b border-[#E2E8F0] bg-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B6475] mb-2.5 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
            <span>Click Any Role For Instant Demo Access:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleInstantDemoLogin('admin@wfitgym.com', 'Admin@WFIT2026!')}
              className="p-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200 text-left transition-all cursor-pointer shadow-xs group"
            >
              <div className="font-bold text-[#1D4ED8] flex items-center justify-between">
                <span>1. Owner / Admin</span>
                <span className="text-[10px] bg-blue-200/60 text-[#1D4ED8] px-1.5 py-0.2 rounded font-mono">Full Ops</span>
              </div>
              <div className="text-[10px] text-[#5B6475] font-mono mt-0.5 truncate">admin@wfitgym.com</div>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleInstantDemoLogin('manager@wfitgym.com', 'Manager@WFIT2026!')}
              className="p-2.5 rounded-xl bg-sky-50/60 hover:bg-sky-100/70 border border-sky-200 text-left transition-all cursor-pointer shadow-xs group"
            >
              <div className="font-bold text-sky-800 flex items-center justify-between">
                <span>2. Club Manager</span>
                <span className="text-[10px] bg-sky-200/60 text-sky-800 px-1.5 py-0.2 rounded font-mono">Members</span>
              </div>
              <div className="text-[10px] text-[#5B6475] font-mono mt-0.5 truncate">manager@wfitgym.com</div>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleInstantDemoLogin('alex.chen@wfitgym.com', 'Trainer@WFIT2026!')}
              className="p-2.5 rounded-xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-200 text-left transition-all cursor-pointer shadow-xs group"
            >
              <div className="font-bold text-purple-800 flex items-center justify-between">
                <span>3. Trainer (Coach)</span>
                <span className="text-[10px] bg-purple-200/60 text-purple-800 px-1.5 py-0.2 rounded font-mono">No Financials</span>
              </div>
              <div className="text-[10px] text-[#5B6475] font-mono mt-0.5 truncate">alex.chen@wfitgym.com</div>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleInstantDemoLogin('rohan.mehra@example.com', 'Member@WFIT2026!')}
              className="p-2.5 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200 text-left transition-all cursor-pointer shadow-xs group"
            >
              <div className="font-bold text-emerald-800 flex items-center justify-between">
                <span>4. Member Portal</span>
                <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-1.5 py-0.2 rounded font-mono">Payment Demo</span>
              </div>
              <div className="text-[10px] text-[#5B6475] font-mono mt-0.5 truncate">rohan.mehra@example.com</div>
            </button>
          </div>

          <div className="mt-2.5 text-center">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleInstantDemoLogin('vikram.sengupta@example.com', 'Member@WFIT2026!')}
              className="text-[11px] text-[#1D4ED8] hover:underline font-mono font-semibold"
            >
              Or Launch Member with Pending Dues (Vikramaditya Sengupta) →
            </button>
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-[#B91C1C]">
            <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Authentication Notice</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-xs font-semibold text-[#70798A] uppercase tracking-wider font-mono">
            Or Sign In With Custom Demo Password:
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5B6475] uppercase tracking-wider mb-1 font-mono">
              Demo Email / Identifier
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#70798A]" />
              <input
                type="text"
                required
                placeholder="e.g. admin@wfitgym.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5B6475] uppercase tracking-wider mb-1 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#70798A]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-10 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#70798A] hover:text-[#172033]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Demo Session...</span>
              </>
            ) : (
              <>
                <span>Enter Selected Demo Portal</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
