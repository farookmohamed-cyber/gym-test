import React, { useState } from 'react';
import { Member, MembershipPlan } from '../types';
import { X, UserPlus, AlertCircle } from 'lucide-react';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMember: (member: Member) => void;
  existingMembers: Member[];
  plans: MembershipPlan[];
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSaveMember,
  existingMembers,
  plans
}) => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1998-05-15');
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || 'plan-1m');
  const [branch, setBranch] = useState('Downtown Flagship');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [biometricEnrolled, setBiometricEnrolled] = useState(true);
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Duplicate mobile check as mandated by Acceptance Test #1
    const cleanMobile = mobile.replace(/\s+/g, '').replace(/-/g, '');
    const isDuplicate = existingMembers.some(m => {
      const existingClean = m.mobile.replace(/\s+/g, '').replace(/-/g, '');
      return existingClean === cleanMobile;
    });

    if (isDuplicate) {
      setErrorMessage(`Duplicate profile detected: Mobile number "${mobile}" is already registered to an existing member. Use renewal or edit profile instead of creating a duplicate person.`);
      return;
    }

    const plan = plans.find(p => p.id === selectedPlanId) || plans[0];
    const startDate = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + plan.durationMonths);
    const expiryDate = expiry.toISOString().split('T')[0];

    const newMemberId = `WFIT-2026-${String(existingMembers.length + 101).padStart(3, '0')}`;

    const newMember: Member = {
      id: newMemberId,
      fullName,
      mobile,
      email: email || undefined,
      dateOfBirth,
      photoUrl,
      registrationDate: startDate,
      branch,
      status: 'Active',
      planId: plan.id,
      planName: plan.name,
      startDate,
      expiryDate,
      emergencyContact: emergencyName ? {
        name: emergencyName,
        relationship: emergencyRelation || 'Family',
        phone: emergencyPhone || mobile
      } : undefined,
      biometricEnrolled,
      biometricDeviceId: biometricEnrolled ? 'DEV-FP-MAIN-01' : undefined,
      notes: notes || undefined
    };

    onSaveMember(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl text-[#172033] shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1D4ED8]">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[#172033]">Register New Gym Member</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#70798A] hover:text-[#172033] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification if duplicate */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-[#B91C1C]">
            <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Validation Rule Triggered</strong>
              {errorMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Photo & Basic Info */}
          <div className="flex gap-4 items-center p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-[#E2E8F0]">
              <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Client Photo URL / Webcam Preset</label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Mobile Number *</label>
              <input
                type="text"
                placeholder="+91 98765 00000"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="client@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>
          </div>

          {/* Membership Plan Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Membership Plan *</label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{p.price.toLocaleString('en-IN')} ({p.durationMonths} mo)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Home Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              >
                <option value="Downtown Flagship">Downtown Flagship</option>
                <option value="West End Wing">West End Wing</option>
                <option value="North Studio">North Studio</option>
              </select>
            </div>
          </div>

          {/* Biometric Integration Enrollment */}
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#172033]">Enroll in Biometric Access Controller</div>
              <div className="text-[11px] text-[#5B6475]">Generate secure template hash on Turnstile Device DEV-FP-MAIN-01</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={biometricEnrolled}
                onChange={(e) => setBiometricEnrolled(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1D4ED8]" />
            </label>
          </div>

          {/* Emergency Contact */}
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
            <span className="text-[11px] font-bold text-[#5B6475] uppercase tracking-wider block">
              Emergency Contact & Consent
            </span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Contact Name"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              />
              <input
                type="text"
                placeholder="Relationship"
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
                className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              />
              <input
                type="text"
                placeholder="Emergency Mobile"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#5B6475] hover:text-[#172033] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Complete Registration & Issue ID
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
