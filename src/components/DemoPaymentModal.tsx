import React, { useState } from 'react';
import { MembershipPlan, Member, Invoice, PaymentMethod, PaymentStatus } from '../types';
import { 
  X, CreditCard, ShieldCheck, CheckCircle2, XCircle, AlertCircle, 
  Loader2, DollarSign, Smartphone, Banknote, Globe, Printer, ArrowLeft, RefreshCw 
} from 'lucide-react';

interface DemoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  plans: MembershipPlan[];
  initialInvoice?: Invoice | null;
  onSimulateSuccess: (updatedInvoice: Invoice, updatedMember: Member) => void;
  onSimulateFailure?: (failedInvoice: Invoice) => void;
}

export const DemoPaymentModal: React.FC<DemoPaymentModalProps> = ({
  isOpen,
  onClose,
  member,
  plans,
  initialInvoice,
  onSimulateSuccess,
  onSimulateFailure
}) => {
  // Step 1: 'SELECT_PLAN' | 'INVOICE_CONFIRM' | 'METHOD_SELECT' | 'CONFIRM_SIMULATION' | 'SUCCESS_RECEIPT' | 'FAILED_VIEW'
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    initialInvoice?.planId || member.planId || plans[0]?.id || 'plan-1m'
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    initialInvoice?.paymentMethod || 'UPI'
  );
  const [currentStep, setCurrentStep] = useState<
    'INVOICE_REVIEW' | 'CONFIRM_SIMULATION' | 'SUCCESS_RECEIPT' | 'FAILED_VIEW'
  >(initialInvoice ? 'INVOICE_REVIEW' : 'INVOICE_REVIEW');

  const [isSimulating, setIsSimulating] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<{
    receiptNumber: string;
    demoTxnId: string;
    invoiceId: string;
    planName: string;
    amount: number;
    paymentMethod: PaymentMethod;
    paidAt: string;
    memberName: string;
    memberId: string;
    newExpiryDate: string;
  } | null>(null);

  const [failureReason, setFailureReason] = useState<string>(
    'Simulated Gateway Response: Insufficient test balance / User simulation trigger.'
  );

  if (!isOpen) return null;

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[0];
  const planPrice = currentPlan.price;
  const tax = Math.round(planPrice * 0.18);
  const totalAmount = planPrice + tax;

  const demoInvoiceId = initialInvoice?.id || `DEMO-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  // Handler: Simulate Successful Payment
  const handleSimulateSuccess = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const now = new Date();
      const paidTimestamp = now.toISOString().replace('T', ' ').substring(0, 19);
      const demoTxnId = `DEMO-TXN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const receiptNo = `DEMO-REC-${Math.floor(10000 + Math.random() * 90000)}`;

      // Calculate new expiry date based on plan
      const currentExpiry = new Date(member.expiryDate);
      const baseDate = currentExpiry > now ? currentExpiry : now;
      baseDate.setMonth(baseDate.getMonth() + currentPlan.durationMonths);
      const newExpiryDate = baseDate.toISOString().split('T')[0];

      const updatedInvoice: Invoice = {
        id: demoInvoiceId,
        demoTransactionId: demoTxnId,
        memberId: member.id,
        memberName: member.fullName,
        planId: currentPlan.id,
        planName: currentPlan.name,
        date: now.toISOString().split('T')[0],
        dueDate: now.toISOString().split('T')[0],
        items: [
          { description: `${currentPlan.name} (${currentPlan.durationMonths} Months Access)`, amount: planPrice }
        ],
        subtotal: planPrice,
        discount: 0,
        tax,
        total: totalAmount,
        amountPaid: totalAmount,
        balanceDue: 0,
        status: 'DEMO PAID',
        paymentMethod: selectedMethod,
        paymentReference: `${selectedMethod.toUpperCase()}-${demoTxnId}`,
        branch: member.branch || 'Downtown Flagship',
        paidAt: paidTimestamp
      };

      const updatedMember: Member = {
        ...member,
        status: 'Active',
        planId: currentPlan.id,
        planName: currentPlan.name,
        expiryDate: newExpiryDate
      };

      setGeneratedReceipt({
        receiptNumber: receiptNo,
        demoTxnId,
        invoiceId: demoInvoiceId,
        planName: currentPlan.name,
        amount: totalAmount,
        paymentMethod: selectedMethod,
        paidAt: paidTimestamp,
        memberName: member.fullName,
        memberId: member.id,
        newExpiryDate
      });

      setIsSimulating(false);
      setCurrentStep('SUCCESS_RECEIPT');
      onSimulateSuccess(updatedInvoice, updatedMember);
    }, 600);
  };

  // Handler: Simulate Failed Payment
  const handleSimulateFailure = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const demoTxnId = `DEMO-TXN-FAIL-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();

      const failedInvoice: Invoice = {
        id: demoInvoiceId,
        demoTransactionId: demoTxnId,
        memberId: member.id,
        memberName: member.fullName,
        planId: currentPlan.id,
        planName: currentPlan.name,
        date: now.toISOString().split('T')[0],
        dueDate: now.toISOString().split('T')[0],
        items: [
          { description: `${currentPlan.name} (${currentPlan.durationMonths} Months)`, amount: planPrice }
        ],
        subtotal: planPrice,
        discount: 0,
        tax,
        total: totalAmount,
        amountPaid: 0,
        balanceDue: totalAmount,
        status: 'DEMO PAYMENT FAILED',
        paymentMethod: selectedMethod,
        paymentReference: `FAIL-${demoTxnId}`,
        branch: member.branch || 'Downtown Flagship',
        demoFailureReason: 'Simulated Card Decline: Transaction declined by demonstration test switch'
      };

      setFailureReason('Simulated Payment Gateway Decline: Bank simulator returned code 4002 (Test simulation triggered by presenter).');
      setIsSimulating(false);
      setCurrentStep('FAILED_VIEW');

      if (onSimulateFailure) {
        onSimulateFailure(failedInvoice);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl text-[#172033] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Top Prominent Safety Disclaimer Banner */}
        <div className="bg-amber-500 text-black px-4 py-1.5 text-center text-xs font-bold font-mono tracking-wider uppercase flex items-center justify-center gap-2">
          <span>⚠️ DEMO MODE ONLY — NO REAL MONEY TRANSFERRED</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline font-normal">No Real Banking Or Payment Gateway Connected</span>
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1D4ED8] flex items-center justify-center border border-blue-200 font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#172033] block">
                Interactive Payment Demonstration Flow
              </span>
              <span className="text-[11px] text-[#5B6475]">
                Client & Gym Owner Showcase Simulator
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-[#70798A] hover:text-[#172033] transition-colors p-1"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================================
            STEP 1: INVOICE & PLAN SELECTION
        ========================================================================= */}
        {currentStep === 'INVOICE_REVIEW' && (
          <div className="p-6 space-y-5">
            
            {/* Member & Plan Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#5B6475] font-semibold">Select Membership Plan To Simulate:</span>
                <span className="text-[#70798A] font-mono">Member: {member.fullName} ({member.id})</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {plans.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPlanId === p.id
                        ? 'bg-blue-50/80 border-[#1D4ED8] ring-1 ring-[#1D4ED8]'
                        : 'bg-white border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[#172033]">{p.name}</span>
                      <span className="text-[10px] font-mono text-[#5B6475]">{p.durationMonths} Mo</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-[#1D4ED8]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Demo Invoice Sheet */}
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-2 text-[11px] font-mono text-[#5B6475]">
                <span>INVOICE #{demoInvoiceId}</span>
                <span>STATUS: <strong className="text-amber-600">DEMO PENDING</strong></span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between font-semibold text-[#172033]">
                  <span>{currentPlan.name} Subscription ({currentPlan.durationMonths} Months)</span>
                  <span className="font-mono">₹{planPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#5B6475]">
                  <span>Gym Facility Access & Locker Key Amenities</span>
                  <span className="text-[#15803D] font-medium">Included</span>
                </div>
                <div className="flex justify-between text-[#5B6475]">
                  <span>GST Tax (18% Statutory Rate)</span>
                  <span className="font-mono">₹{tax.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-2 flex justify-between items-center text-sm font-bold text-[#172033]">
                <span>Total Demo Amount Due:</span>
                <span className="font-mono text-lg text-[#1D4ED8]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#5B6475] uppercase tracking-wider font-mono">
                Select Simulated Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'UPI' || selectedMethod === 'UPI/GPay'
                      ? 'bg-blue-50 border-[#1D4ED8] text-[#1D4ED8] font-bold ring-1 ring-[#1D4ED8]'
                      : 'bg-white border-[#E2E8F0] text-[#5B6475] hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / GPay Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('Online Gateway')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'Online Gateway' || selectedMethod === 'Card'
                      ? 'bg-blue-50 border-[#1D4ED8] text-[#1D4ED8] font-bold ring-1 ring-[#1D4ED8]'
                      : 'bg-white border-[#E2E8F0] text-[#5B6475] hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Online Gateway</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('Cash')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'Cash'
                      ? 'bg-blue-50 border-[#1D4ED8] text-[#1D4ED8] font-bold ring-1 ring-[#1D4ED8]'
                      : 'bg-white border-[#E2E8F0] text-[#5B6475] hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Cash Desk Entry</span>
                </button>
              </div>
            </div>

            {/* Advance to Confirmation Step */}
            <div className="pt-2 flex justify-end gap-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-[#5B6475] hover:text-[#172033] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep('CONFIRM_SIMULATION')}
                className="px-6 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Proceed to Payment Simulation →
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            STEP 2: SIMULATION CONTROLS SCREEN (SUCCESS vs FAILURE BUTTONS)
        ========================================================================= */}
        {currentStep === 'CONFIRM_SIMULATION' && (
          <div className="p-6 space-y-6">
            
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#1D4ED8] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Ready for Client Demonstration</span>
              </div>
              <p className="text-[#5B6475]">
                You are about to simulate a transaction of <strong className="text-[#172033]">₹{totalAmount.toLocaleString('en-IN')}</strong> for <strong>{member.fullName}</strong> via <strong>{selectedMethod}</strong>.
              </p>
              <div className="text-[11px] font-mono text-[#5B6475] bg-white p-2 rounded border border-blue-100">
                Simulated Transaction ID: <strong className="text-[#172033]">DEMO-TXN-2026-PENDING</strong>
              </div>
            </div>

            {/* Simulation Triggers (Clearly marked as requested) */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-[#5B6475] uppercase tracking-wider font-mono">
                Select Simulation Outcome For Presentation:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Button 1: Simulate Successful Payment */}
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={handleSimulateSuccess}
                  className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Simulating Network...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simulate Successful Payment</span>
                    </>
                  )}
                </button>

                {/* Button 2: Simulate Failed Payment */}
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={handleSimulateFailure}
                  className="p-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Simulating Network...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Simulate Failed Payment</span>
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Back / Cancel Button */}
            <div className="pt-2 flex justify-between items-center border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setCurrentStep('INVOICE_REVIEW')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#5B6475] hover:text-[#172033] font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Invoice</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 text-xs text-[#70798A] hover:text-[#172033]"
              >
                Cancel Demo
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            STEP 3: SUCCESSFUL SIMULATION & GENERATED RECEIPT
        ========================================================================= */}
        {currentStep === 'SUCCESS_RECEIPT' && generatedReceipt && (
          <div className="p-6 space-y-6 text-center">
            
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-[#15803D] text-xs font-bold uppercase tracking-wider mb-2">
                STATUS: DEMO PAID
              </div>
              <h3 className="text-xl font-bold text-[#172033] uppercase font-archivo-wide">
                Simulated Payment Verified
              </h3>
              <p className="text-xs text-[#5B6475] mt-1 font-mono">
                Simulated Txn ID: {generatedReceipt.demoTxnId}
              </p>
            </div>

            {/* Printable Digital Demo Receipt */}
            <div className="p-5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-left text-xs space-y-2.5 relative shadow-xs">
              <div className="border-b border-[#E2E8F0] pb-2 flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#172033] text-sm block">WFIT GYM DEMO RECEIPT</span>
                  <span className="text-[10px] text-[#70798A] font-mono">GSTIN: 33ABCDE1234F1Z5 (Demo)</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#172033]">{generatedReceipt.receiptNumber}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[#5B6475]">
                <div>Member: <strong className="text-[#172033]">{generatedReceipt.memberName}</strong></div>
                <div className="font-mono">ID: <strong className="text-[#172033]">{generatedReceipt.memberId}</strong></div>
                <div>Plan: <strong className="text-[#172033]">{generatedReceipt.planName}</strong></div>
                <div>Method: <strong className="text-[#172033]">{generatedReceipt.paymentMethod}</strong></div>
                <div>Timestamp: <span className="font-mono text-[#172033]">{generatedReceipt.paidAt}</span></div>
                <div>New Expiry: <span className="font-mono font-bold text-[#15803D]">{generatedReceipt.newExpiryDate}</span></div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-2 flex justify-between items-center font-bold text-[#15803D] text-sm">
                <span>Amount Cleared:</span>
                <span className="font-mono text-base">₹{generatedReceipt.amount.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 text-center text-[10px] text-[#70798A] font-mono border-t border-dashed border-[#CBD5E1]">
                *** DEMO ONLY — NO REAL MONEY TRANSFERRED ***
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#172033] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#5B6475]" />
                <span>Print / Save Demo Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
              >
                Done & Return to Dashboard
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            STEP 4: FAILED SIMULATION VIEW & RETRY
        ========================================================================= */}
        {currentStep === 'FAILED_VIEW' && (
          <div className="p-6 space-y-6 text-center">
            
            <div className="w-14 h-14 rounded-full bg-rose-50 text-[#B91C1C] border border-rose-200 flex items-center justify-center mx-auto shadow-sm">
              <XCircle className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-rose-100 text-[#B91C1C] text-xs font-bold uppercase tracking-wider mb-2">
                STATUS: DEMO PAYMENT FAILED
              </div>
              <h3 className="text-xl font-bold text-[#172033] uppercase font-archivo-wide">
                Simulated Transaction Declined
              </h3>
              <p className="text-xs text-[#5B6475] mt-1">
                The demonstration transaction was rejected as programmed by the failure trigger.
              </p>
            </div>

            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl text-left text-xs space-y-1.5 text-[#B91C1C]">
              <span className="font-bold block">Simulation Response Details:</span>
              <p className="text-[#5B6475]">{failureReason}</p>
              <div className="text-[11px] font-mono text-[#70798A] pt-1">
                Invoice #{demoInvoiceId} remains marked as UNPAID in the demo state.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep('CONFIRM_SIMULATION')}
                className="flex-1 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Payment Demo</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#5B6475] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Demo
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
