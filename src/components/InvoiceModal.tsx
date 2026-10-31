import React, { useState } from 'react';
import { Invoice, PaymentMethod } from '../types';
import { X, Printer, CheckCircle, CreditCard, DollarSign } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onRecordPayment: (invoiceId: string, amount: number, method: PaymentMethod, reference: string) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onRecordPayment
}) => {
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('UPI/GPay');
  const [payReference, setPayReference] = useState('');
  const [showPayForm, setShowPayForm] = useState(false);

  if (!isOpen || !invoice) return null;

  const handleCollect = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;
    onRecordPayment(invoice.id, payAmount, payMethod, payReference || `MANUAL-${Date.now().toString().slice(-6)}`);
    setShowPayForm(false);
    setPayAmount(0);
    setPayReference('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-2xl text-[#172033] shadow-2xl overflow-hidden my-8">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#5B6475] font-semibold">TAX INVOICE & RECEIPT</span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="font-mono text-xs font-bold text-[#172033]">{invoice.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-[#E2E8F0] text-xs font-semibold text-[#172033] transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#5B6475]" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#70798A] hover:text-[#172033] transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 space-y-6 bg-white text-[#172033]">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#E2E8F0] pb-6">
            <div>
              <div className="text-2xl font-bold tracking-tight text-[#172033] uppercase font-sans">
                WFIT GYM CLUB
              </div>
              <div className="text-xs text-[#5B6475] mt-1">
                {invoice.branch} • GSTIN: 33ABCDE1234F1Z5
              </div>
              <div className="text-xs text-[#70798A]">
                Support: ops@wfit.internal | +91 (80) 4123-9000
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                invoice.status === 'Paid' ? 'bg-emerald-50 text-[#15803D] border border-emerald-200' :
                invoice.status === 'Partial' ? 'bg-amber-50 text-[#B45309] border border-amber-200' :
                'bg-rose-50 text-[#B91C1C] border border-rose-200'
              }`}>
                {invoice.status}
              </span>
              <div className="text-xs text-[#5B6475] mt-2">
                Date: <span className="font-mono text-[#172033] font-semibold">{invoice.date}</span>
              </div>
              <div className="text-xs text-[#5B6475]">
                Due Date: <span className="font-mono text-[#172033] font-semibold">{invoice.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
            <div>
              <div className="text-[#70798A] uppercase font-mono text-[10px] tracking-wider mb-1 font-bold">
                BILLED TO MEMBER
              </div>
              <div className="font-bold text-sm text-[#172033]">{invoice.memberName}</div>
              <div className="text-[#5B6475] font-mono">ID: {invoice.memberId}</div>
            </div>
            <div>
              <div className="text-[#70798A] uppercase font-mono text-[10px] tracking-wider mb-1 font-bold">
                PAYMENT DETAILS
              </div>
              <div className="text-[#5B6475]">Method: <span className="text-[#172033] font-semibold">{invoice.paymentMethod || 'Pending'}</span></div>
              {invoice.paymentReference && (
                <div className="text-[#70798A] font-mono truncate">Ref: {invoice.paymentReference}</div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] text-[#5B6475] uppercase font-mono text-[10px] border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Description</th>
                  <th className="py-2.5 px-4 text-right font-bold">Taxable Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 font-semibold text-[#172033]">{item.description}</td>
                    <td className="py-3 px-4 text-right font-mono text-[#172033]">₹{item.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-[#5B6475]">
                <span>Subtotal:</span>
                <span className="font-mono text-[#172033] font-medium">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-[#15803D]">
                  <span>Discount ({invoice.discountReason || 'Authorized'}):</span>
                  <span className="font-mono font-semibold">-₹{invoice.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5B6475]">
                <span>GST (18% - CGST 9% + SGST 9%):</span>
                <span className="font-mono text-[#172033] font-medium">₹{invoice.tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-[#E2E8F0] pt-2 flex justify-between font-bold text-sm text-[#172033]">
                <span>Total Invoice Value:</span>
                <span className="font-mono">₹{invoice.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[#5B6475]">
                <span>Amount Paid:</span>
                <span className="font-mono text-[#15803D] font-bold">₹{invoice.amountPaid.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-[#E2E8F0] pt-2 flex justify-between font-bold text-sm text-[#B91C1C]">
                <span>Balance Outstanding Due:</span>
                <span className="font-mono">₹{invoice.balanceDue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Partial Payment Collection CTA */}
          {invoice.balanceDue > 0 && !showPayForm && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div className="text-xs text-[#B45309]">
                Outstanding dues of <strong className="font-bold">₹{invoice.balanceDue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong> pending on this invoice.
              </div>
              <button
                onClick={() => {
                  setPayAmount(invoice.balanceDue);
                  setShowPayForm(true);
                }}
                className="px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Collect Payment</span>
              </button>
            </div>
          )}

          {/* Payment Collection Form */}
          {showPayForm && (
            <form onSubmit={handleCollect} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                  Record Payment Collection
                </span>
                <button 
                  type="button" 
                  onClick={() => setShowPayForm(false)}
                  className="text-xs text-[#70798A] hover:text-[#172033] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#5B6475] mb-1 font-semibold">Amount to Collect (₹)</label>
                  <input
                    type="number"
                    max={invoice.balanceDue}
                    min={1}
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#172033] font-mono focus:outline-none focus:border-[#1D4ED8]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#5B6475] mb-1 font-semibold">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
                  >
                    <option value="UPI/GPay">UPI / GPay</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Credit/Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                    <option value="Online Gateway">Online Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#5B6475] mb-1 font-semibold">Transaction Ref #</label>
                  <input
                    type="text"
                    placeholder="e.g. UPI-9938102"
                    value={payReference}
                    onChange={(e) => setPayReference(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#172033] focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#15803D] hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Confirm & Allocate Payment
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
