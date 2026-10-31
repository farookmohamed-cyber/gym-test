import React, { useState } from 'react';
import { Member, BiometricLog } from '../types';
import { Fingerprint, CheckCircle, XCircle, AlertTriangle, ShieldAlert, RefreshCw, X } from 'lucide-react';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onLogEntry: (log: BiometricLog) => void;
  deviceOnline: boolean;
  setDeviceOnline: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onClose,
  members,
  onLogEntry,
  deviceOnline,
  setDeviceOnline
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [scanType, setScanType] = useState<'Fingerprint' | 'Face ID'>('Fingerprint');
  const [scanResult, setScanResult] = useState<{
    status: 'IDLE' | 'GRANTED' | 'DENIED';
    message: string;
    details?: string;
  }>({ status: 'IDLE', message: 'Ready for scan...' });

  const [overrideActive, setOverrideActive] = useState(false);
  const [overrideStaffId, setOverrideStaffId] = useState('STAFF-DESK-01');
  const [overrideReason, setOverrideReason] = useState('Authorized one-time access for renewal consultation');

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    if (!deviceOnline) {
      setScanResult({
        status: 'DENIED',
        message: 'DEVICE OFFLINE',
        details: 'Biometric turnstile controller is disconnected. Local offline cache buffering enabled.'
      });
      return;
    }

    const member = members.find(m => m.id === selectedMemberId);
    if (!member) return;

    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    // Rule checks
    if (!member.biometricEnrolled) {
      setScanResult({
        status: 'DENIED',
        message: 'ACCESS DENIED: NOT ENROLLED',
        details: 'Member biometric credentials have not been enrolled on this turnstile.'
      });
      onLogEntry({
        id: `BIO-${Date.now()}`,
        timestamp,
        memberId: member.id,
        memberName: member.fullName,
        device: 'Turnstile Gate #1 (Main)',
        scanType,
        result: 'DENIED',
        denialReason: 'Biometrics not enrolled'
      });
      return;
    }

    if (member.status === 'Expired' || member.status === 'Suspended') {
      setScanResult({
        status: 'DENIED',
        message: 'ACCESS DENIED: MEMBERSHIP EXPIRED',
        details: `Membership expired on ${member.expiryDate}. Please renew subscription.`
      });
      onLogEntry({
        id: `BIO-${Date.now()}`,
        timestamp,
        memberId: member.id,
        memberName: member.fullName,
        device: 'Turnstile Gate #1 (Main)',
        scanType,
        result: 'DENIED',
        denialReason: `Membership status: ${member.status}`
      });
      return;
    }

    if (member.status === 'Unpaid') {
      setScanResult({
        status: 'DENIED',
        message: 'ACCESS DENIED: DUES OUTSTANDING',
        details: 'Outstanding invoice balance pending settlement. Turnstile blocked.'
      });
      onLogEntry({
        id: `BIO-${Date.now()}`,
        timestamp,
        memberId: member.id,
        memberName: member.fullName,
        device: 'Turnstile Gate #1 (Main)',
        scanType,
        result: 'DENIED',
        denialReason: 'Unpaid dues pending'
      });
      return;
    }

    // Granted
    setScanResult({
      status: 'GRANTED',
      message: 'ACCESS GRANTED: TURNSTILE UNLOCKED',
      details: `Welcome, ${member.fullName}! Valid till ${member.expiryDate}.`
    });

    onLogEntry({
      id: `BIO-${Date.now()}`,
      timestamp,
      memberId: member.id,
      memberName: member.fullName,
      device: 'Turnstile Gate #1 (Main)',
      scanType,
      result: 'GRANTED'
    });
  };

  const handleManualOverride = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find(m => m.id === selectedMemberId);
    if (!member) return;

    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    setScanResult({
      status: 'GRANTED',
      message: 'MANUAL OVERRIDE GRANTED',
      details: `Staff ${overrideStaffId} granted entry. Reason: ${overrideReason}`
    });

    onLogEntry({
      id: `BIO-OVR-${Date.now()}`,
      timestamp,
      memberId: member.id,
      memberName: member.fullName,
      device: 'Front Desk Access Console',
      scanType: 'Manual Override',
      result: 'GRANTED',
      staffOverrideId: overrideStaffId,
      staffReason: overrideReason
    });

    setOverrideActive(false);
  };

  const currentMember = members.find(m => m.id === selectedMemberId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl p-6 text-[#172033] shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-[#70798A] hover:text-[#172033] transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1D4ED8]">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#172033] tracking-tight">Biometric Turnstile Terminal Simulator</h3>
            <p className="text-xs text-[#5B6475]">Hardware test console for fingerprint & face access validation</p>
          </div>
        </div>

        {/* Device Status Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs mb-6">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${deviceOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="font-mono text-[#5B6475]">Device: Turnstile Gate #1 (ZKTECO / Suprema SDK)</span>
          </div>
          <button 
            onClick={() => setDeviceOnline(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-white hover:bg-slate-100 text-[#172033] border border-[#E2E8F0] font-mono text-[11px] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-[#5B6475]" />
            <span>{deviceOnline ? 'Simulate Device Offline' : 'Reconnect Device'}</span>
          </button>
        </div>

        {/* Member Selector */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-[#5B6475] mb-1.5 uppercase tracking-wider font-mono">
              Select Member To Scan
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => {
                setSelectedMemberId(e.target.value);
                setScanResult({ status: 'IDLE', message: 'Ready for scan...' });
              }}
              className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#172033] focus:outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8]"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.id} — {m.fullName} ({m.status}) {m.status === 'Unpaid' ? '• Dues Pending' : ''}
                </option>
              ))}
            </select>
          </div>

          {currentMember && (
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#70798A]">Plan:</span> <span className="font-semibold text-[#172033]">{currentMember.planName}</span>
                <span className="mx-2 text-[#CBD5E1]">|</span>
                <span className="text-[#70798A]">Expiry:</span> <span className="font-mono text-[#172033]">{currentMember.expiryDate}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                currentMember.status === 'Active' ? 'bg-emerald-50 text-[#15803D] border border-emerald-200' :
                currentMember.status === 'Expiring Soon' ? 'bg-amber-50 text-[#B45309] border border-amber-200' :
                currentMember.status === 'Unpaid' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                'bg-rose-50 text-[#B91C1C] border border-rose-200'
              }`}>
                {currentMember.status}
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setScanType('Fingerprint')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                scanType === 'Fingerprint' 
                  ? 'bg-blue-50 text-[#1D4ED8] border-blue-300 shadow-xs' 
                  : 'bg-white text-[#5B6475] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              Fingerprint Sensor
            </button>
            <button
              onClick={() => setScanType('Face ID')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                scanType === 'Face ID' 
                  ? 'bg-blue-50 text-[#1D4ED8] border-blue-300 shadow-xs' 
                  : 'bg-white text-[#5B6475] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              Face Recognition Camera
            </button>
          </div>
        </div>

        {/* Scan Result Visualizer */}
        <div className={`p-4 rounded-xl border mb-6 transition-all duration-300 text-center ${
          scanResult.status === 'GRANTED' ? 'bg-emerald-50 border-emerald-200 text-[#15803D]' :
          scanResult.status === 'DENIED' ? 'bg-rose-50 border-rose-200 text-[#B91C1C]' :
          'bg-[#F8FAFC] border-[#E2E8F0] text-[#5B6475]'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            {scanResult.status === 'GRANTED' && <CheckCircle className="w-5 h-5 text-[#15803D]" />}
            {scanResult.status === 'DENIED' && <XCircle className="w-5 h-5 text-[#B91C1C]" />}
            {scanResult.status === 'IDLE' && <Fingerprint className="w-5 h-5 text-[#70798A]" />}
            <span className="font-bold tracking-wider text-sm uppercase">{scanResult.message}</span>
          </div>
          {scanResult.details && (
            <p className="text-xs text-[#5B6475] mt-1 max-w-md mx-auto">{scanResult.details}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateScan}
            className="flex-1 py-3 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Fingerprint className="w-4 h-4" />
            <span>Simulate Hardware Scan</span>
          </button>

          <button
            onClick={() => setOverrideActive(true)}
            className="px-4 py-3 bg-white border border-[#E2E8F0] text-[#172033] hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShieldAlert className="w-4 h-4 text-[#B45309]" />
            <span>Manual Override</span>
          </button>
        </div>

        {/* Manual Override Sub-Form */}
        {overrideActive && (
          <form onSubmit={handleManualOverride} className="mt-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-[#B45309] text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Authorized Staff Override (Logged to Audit Trail)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-[#5B6475] mb-1 font-semibold">Staff ID / Key</label>
                <input
                  type="text"
                  value={overrideStaffId}
                  onChange={(e) => setOverrideStaffId(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#172033]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#5B6475] mb-1 font-semibold">Justification Reason</label>
                <input
                  type="text"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#172033]"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOverrideActive(false)}
                className="px-3 py-1.5 text-xs text-[#5B6475] hover:text-[#172033] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#B45309] hover:bg-amber-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Confirm Override Entry
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
