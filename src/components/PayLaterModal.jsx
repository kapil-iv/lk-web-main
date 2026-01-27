import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, ShieldCheck } from "lucide-react";

export function PayLaterModal({
  open,
  onClose,
  title = "Partial Payment Info",
  totalAmount = 0,
  advanceAmountValue = 0,
}) {
  const amount = Number(totalAmount) || 0;
  const percentage = Number(advanceAmountValue) || 0;
  const advanceAmount = Math.round((amount * percentage) / 100);
  const remaining = amount - advanceAmount;

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden shadow-2xl z-10"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
              <Info size={20} className="text-blue-600 shrink-0" />
              <p className="text-[11px] font-bold text-blue-800 leading-tight uppercase tracking-tight">
                Pay ₹{advanceAmount} now to secure your slot. The rest ₹{remaining} can be paid at the venue.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Payable</span>
                <span className="text-lg font-black text-gray-900">₹{amount}</span>
              </div>
              <div className="h-[1px] bg-gray-100 w-full border-dashed border-b" />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-blue-600 uppercase">Advance ({percentage}%)</span>
                  <span className="text-xl font-black text-blue-600">₹{advanceAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-tight">Balance at Venue</span>
                  <span className="text-sm font-black text-gray-700">₹{remaining}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 active:scale-95 transition-all"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}