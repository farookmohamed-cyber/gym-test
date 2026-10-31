import React, { useState } from 'react';
import { Lead, LeadStage } from '../types';
import { X, UserCheck } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSaveLead: (lead: Lead) => void;
  onConvertToMember: (lead: Lead) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSaveLead,
  onConvertToMember
}) => {
  const isEditing = !!lead;

  const [name, setName] = useState(lead?.name || '');
  const [mobile, setMobile] = useState(lead?.mobile || '');
  const [email, setEmail] = useState(lead?.email || '');
  const [source, setSource] = useState<Lead['source']>(lead?.source || 'Walk-in');
  const [interestedProduct, setInterestedProduct] = useState<Lead['interestedProduct']>(lead?.interestedProduct || 'Gym Membership');
  const [stage, setStage] = useState<LeadStage>(lead?.stage || 'New enquiry');
  const [assignedExecutive, setAssignedExecutive] = useState(lead?.assignedExecutive || 'Sneha Rao (Front Office)');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(lead?.nextFollowUpDate || '2026-10-31');
  const [notes, setNotes] = useState(lead?.notes || '');
  const [lostReason, setLostReason] = useState(lead?.lostReason || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedLead: Lead = {
      id: lead?.id || `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`,
      name,
      mobile,
      email: email || undefined,
      source,
      interestedProduct,
      assignedExecutive,
      stage,
      enquiryDate: lead?.enquiryDate || new Date().toISOString().split('T')[0],
      lastContactDate: new Date().toISOString().split('T')[0],
      nextFollowUpDate,
      notes,
      lostReason: stage === 'Lost' ? lostReason : undefined,
      convertedMemberId: lead?.convertedMemberId
    };

    onSaveLead(updatedLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl text-[#172033] shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-[#172033]">
              {isEditing ? `Edit Enquiry: ${lead.id}` : 'Create New Enquiry / Lead'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#70798A] hover:text-[#172033] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Prospect Name *</label>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Enquiry Channel / Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              >
                <option value="Walk-in">Walk-in</option>
                <option value="Instagram">Instagram Ad / DM</option>
                <option value="WhatsApp">WhatsApp Inbound</option>
                <option value="Website">Website Form</option>
                <option value="Referral">Member Referral</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Interested Product</label>
              <select
                value={interestedProduct}
                onChange={(e) => setInterestedProduct(e.target.value as any)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              >
                <option value="Gym Membership">Gym Membership</option>
                <option value="Personal Training">Personal Training</option>
                <option value="Boxing">Boxing Ring / Coach</option>
                <option value="Group Classes">Group Classes / HIIT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Pipeline Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              >
                <option value="New enquiry">New enquiry</option>
                <option value="Contacted">Contacted</option>
                <option value="Visit / trial scheduled">Visit / trial scheduled</option>
                <option value="Visited / trial completed">Visited / trial completed</option>
                <option value="Follow-up pending">Follow-up pending</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Next Follow-up Date</label>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>
          </div>

          {stage === 'Lost' && (
            <div>
              <label className="block text-xs text-[#B91C1C] mb-1 font-semibold">Reason for Lost Lead</label>
              <input
                type="text"
                placeholder="e.g. Budget constraints, distance, joined competitor"
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                className="w-full bg-white border border-red-300 rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-[#5B6475] mb-1 font-semibold">Notes & Consultation History</label>
            <textarea
              rows={3}
              placeholder="Record prospect goals, trial feedback, preferences..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
            />
          </div>

          {/* Convert to Member quick action */}
          {isEditing && stage !== 'Converted' && (
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#172033]">Ready to close?</div>
                <div className="text-[11px] text-[#5B6475]">Convert lead to active Member without re-entering contact info.</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (lead) onConvertToMember(lead);
                  onClose();
                }}
                className="px-3.5 py-1.5 bg-[#15803D] hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Convert to Member</span>
              </button>
            </div>
          )}

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
              Save Lead Record
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
