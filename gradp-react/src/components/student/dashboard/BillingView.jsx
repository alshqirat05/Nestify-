import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  ShieldCheck,
  Landmark,
  CheckCircle2,
  Clock,
  Receipt,
  Lock,
  X
} from "lucide-react";
import api from "../../../utils/api";

export default function BillingView({ booking, isAr, viewportVariants }) {
  const [payments, setPayments] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [activePayment, setActivePayment] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const fetchPayments = async () => {
    setFetching(true);
    try {
      const response = await api.get("/payments/logs");
      if (response.success && response.data) {
        setPayments(response.data);
      }
    } catch (err) {
      console.error("Failed to load payment logs:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!activePayment) return;
    setProcessing(true);
    try {
      const fakeTransactionId =
        "TXN-" + Math.random().toString(36).substring(2, 11).toUpperCase();
      const response = await api.post(`/payments/${activePayment.id}/pay`, {
        transactionId: fakeTransactionId,
        paymentMethod: "visa",
        cardholderName: cardName,
        cardNumber: cardNumber,
        expiryDate: expiry,
        cvv: cvv,
        bankName: "Student Bank"
      });
      if (response.success) {
        alert(isAr ? "تمت عملية الدفع بنجاح!" : "Payment processed successfully!");
        setActivePayment(null);
        setCardName("");
        setCardNumber("");
        setExpiry("");
        setCvv("");
        fetchPayments();
      }
    } catch (err) {
      console.error("Payment submission failed:", err);
      alert(
        isAr
          ? "فشلت عملية الدفع. يرجى المحاولة لاحقاً."
          : "Payment failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  const pendingPayments = payments.filter((p) => {
    const s = (p.status || "").toLowerCase();
    return s === "pending" || s === "pending payment" || s === "pending_payment";
  });

  const completedPayments = payments.filter((p) => {
    const s = (p.status || "").toLowerCase();
    return s === "completed" || s === "paid" || s === "received";
  });

  const cardInputCls =
    "w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 ring-[#004A8D]/15 focus:border-[#004A8D] dark:focus:border-sky-500 text-slate-900 dark:text-white transition-all";

  return (
    <motion.div
      key="billing"
      variants={viewportVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 text-start"
    >
      {/* ترويسة الصفحة */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200/70 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
          <CreditCard size={20} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? "الفواتير والمدفوعات" : "Billing & Payments"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isAr
              ? "تابع التزاماتك المالية وسدد الإيجار الشهري بأمان"
              : "Manage your rent invoices and review your payment history"}
          </p>
        </div>
      </div>

      {fetching ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-[#004A8D] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-400">
            {isAr ? "جاري تحميل السجل المالي..." : "Loading financial records..."}
          </p>
        </div>
      ) : (
        <>
          {/* بطاقات ملخص المستحقات والضمان */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {booking &&
            (booking.status === "pending" || booking.status === "pending_approval") ? (
              <div className="p-5 rounded-xl border border-amber-200/80 dark:border-amber-500/20 bg-amber-50/40 dark:bg-amber-500/[0.06] flex flex-col justify-between min-h-[165px]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {isAr ? "الحجز بانتظار موافقة المالك" : "Booking Pending Approval"}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {isAr
                        ? "طلب الحجز والدفع الخاص بك قيد المراجعة من قبل المالك. ستتمكن من إتمام الدفع فور الموافقة."
                        : "Your booking request is awaiting landlord confirmation. Billing actions will unlock once approved."}
                    </p>
                  </div>
                </div>
              </div>
            ) : pendingPayments.length > 0 ? (
              pendingPayments.map((p) => {
                const isCash = (p.paymentMethod || "").toLowerCase() === "cash";
                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between min-h-[165px]"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300">
                          <Clock size={12} />
                          {isCash
                            ? isAr
                              ? "دفعة نقدية بانتظار التأكيد"
                              : "Pending Cash Confirmation"
                            : isAr
                              ? "فاتورة مستحقة الدفع"
                              : "Invoice Due"}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1.5 pt-1">
                        <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                          {parseFloat(p.amount).toFixed(2)}
                        </span>
                        <span className="text-xs font-bold text-[#004A8D] dark:text-sky-400">JOD</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {isCash
                          ? isAr
                            ? "يرجى تسليم المبلغ نقداً للمالك ليقوم بتأكيد استلام الدفعة عبر النظام."
                            : "Please hand the cash payment to the landlord so they can confirm receipt."
                          : isAr
                            ? `تاريخ الاستحقاق: ${new Date(p.dueDate).toLocaleDateString("ar-JO")}`
                            : `Due Date: ${new Date(p.dueDate).toLocaleDateString("en-US")}`}
                      </p>
                    </div>

                    {!isCash && (
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => setActivePayment(p)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                        >
                          {isAr ? "سداد الفاتورة الآن" : "Pay Invoice Now"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center gap-4 min-h-[165px]">
                <div className="w-12 h-12 rounded-xl bg-[#82BC00]/15 dark:bg-lime-500/15 flex items-center justify-center text-[#5a8200] dark:text-lime-400 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {isAr ? "جميع دفعاتك مسددة بالكامل" : "All Payments Up to Date"}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {isAr
                      ? "لا توجد أي فواتير أو مستحقات إيجار معلقة على عقدك الحالي."
                      : "There are no pending rent invoices on your active lease."}
                  </p>
                </div>
              </div>
            )}

            {/* بطاقة معلومات الحماية المالية */}
            <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between min-h-[165px]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#004A8D] dark:text-sky-400">
                  <ShieldCheck size={15} className="text-[#659400] dark:text-lime-400" />
                  <span>{isAr ? "حماية المدفوعات من Nestify" : "Nestify Payment Protection"}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  {isAr
                    ? "يتم توثيق جميع الدفعات الإلكترونية والنقدية وإصدار وصولات رسمية لحفظ حقوق الطالب والمالك طوال فترة العقد."
                    : "All electronic and cash payments are logged with official receipts to protect both students and property owners throughout the lease."}
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Landmark size={13} /> PCI-DSS Compliant
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock size={13} /> 256-Bit Encrypted
                </span>
              </div>
            </div>
          </div>

          {/* جدول سجل المدفوعات */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt size={16} className="text-[#004A8D] dark:text-sky-400" />
                <span>{isAr ? "سجل المعاملات والوصولات" : "Transaction & Receipt History"}</span>
              </h3>
              {completedPayments.length > 0 && (
                <span className="text-xs text-slate-500">
                  {isAr ? `${completedPayments.length} عملية` : `${completedPayments.length} records`}
                </span>
              )}
            </div>

            {completedPayments.length === 0 ? (
              <div className="p-10 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 text-center text-slate-500 text-xs font-medium">
                {isAr
                  ? "لا توجد معاملات مالية مكتملة لعرضها حالياً."
                  : "No completed payment transactions recorded yet."}
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-200/80 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200/70 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-start">{isAr ? "رقم المرجع" : "Reference ID"}</th>
                        <th className="px-4 py-3 text-start">{isAr ? "المبلغ" : "Amount"}</th>
                        <th className="px-4 py-3 text-start">{isAr ? "طريقة الدفع" : "Method"}</th>
                        <th className="px-4 py-3 text-start">{isAr ? "التاريخ" : "Date"}</th>
                        <th className="px-4 py-3 text-end">{isAr ? "الحالة" : "Status"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {completedPayments.map((p) => (
                        <tr
                          key={p.id}
                          className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="px-4 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                            {p.transaction_id || "TXN-AUTO"}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                            {parseFloat(p.amount).toFixed(2)} JOD
                          </td>
                          <td className="px-4 py-3.5 font-medium">
                            {(() => {
                              const mLower = (p.paymentMethod || "").toLowerCase();
                              const isCard =
                                mLower.includes("visa") ||
                                mLower.includes("card") ||
                                mLower.includes("credit");
                              return isCard
                                ? isAr
                                  ? "بطاقة ائتمان"
                                  : "Credit Card"
                                : mLower.includes("cash")
                                  ? isAr
                                    ? "نقدي"
                                    : "Cash"
                                  : p.paymentMethod || "Credit Card";
                            })()}
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                            {new Date(p.paymentDate || p.dueDate).toLocaleDateString(
                              isAr ? "ar-JO" : "en-US",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-end">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#82BC00]/15 dark:bg-lime-500/15 text-[#3f6212] dark:text-lime-300 text-[11px] font-semibold">
                              <CheckCircle2 size={11} />
                              {(p.status || "").toLowerCase() === "received"
                                ? isAr
                                  ? "مستلمة"
                                  : "Received"
                                : isAr
                                  ? "مدفوعة"
                                  : "Paid"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* نافذة الدفع الإلكتروني (Checkout Modal) */}
      <AnimatePresence>
        {activePayment && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePayment(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl text-start"
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {isAr ? "سداد فاتورة الإيجار" : "Complete Rent Payment"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isAr
                        ? `المبلغ المستحق: ${parseFloat(activePayment.amount).toFixed(2)} دينار أردني`
                        : `Amount due: ${parseFloat(activePayment.amount).toFixed(2)} JOD`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePayment(null)}
                    className="p-1.5 rounded-lg !bg-slate-100 dark:!bg-slate-800 !text-slate-500 hover:!text-slate-800 dark:hover:!text-white transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* معاينة البطاقة البنكية */}
                <div
                  dir="ltr"
                  className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-[#003366] to-[#004A8D] text-white shadow-md relative overflow-hidden space-y-5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs tracking-wider uppercase text-[#a3e635]">
                      Nestify Pay
                    </span>
                    <CreditCard size={18} className="text-white/80" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-white/60 mb-1">
                      Card Number
                    </div>
                    <div className="font-mono text-base tracking-widest">
                      {cardNumber
                        ? cardNumber.replace(/(\d{4})/g, "$1 ").trim()
                        : "•••• •••• •••• ••••"}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-white/60">
                        Card Holder
                      </div>
                      <div className="font-semibold truncate max-w-[170px]">
                        {cardName || "STUDENT NAME"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-white/60">
                        Expires
                      </div>
                      <div className="font-semibold font-mono">{expiry || "MM/YY"}</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProcessPayment} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {isAr ? "الاسم على البطاقة" : "Cardholder Name"}
                    </label>
                    <input
                      required
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="AHMAD AL-ALI"
                      className={cardInputCls}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {isAr ? "رقم البطاقة" : "Card Number"}
                    </label>
                    <input
                      required
                      type="text"
                      maxLength="16"
                      dir="ltr"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="4000 1234 5678 9010"
                      className={cardInputCls}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {isAr ? "تاريخ الانتهاء" : "Expiry Date"}
                      </label>
                      <input
                        required
                        type="text"
                        maxLength="5"
                        dir="ltr"
                        value={expiry}
                        placeholder="MM/YY"
                        onChange={(e) => {
                          let val = e.target.value;
                          if (val.length === 2 && !val.includes("/")) val += "/";
                          setExpiry(val);
                        }}
                        className={cardInputCls}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {isAr ? "رمز الأمان (CVV)" : "CVV"}
                      </label>
                      <input
                        required
                        type="password"
                        maxLength="3"
                        dir="ltr"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        placeholder="•••"
                        className={cardInputCls}
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActivePayment(null)}
                      className="flex-1 py-2.5 rounded-xl border !border-slate-200 dark:!border-slate-700 !bg-transparent font-semibold text-xs !text-slate-600 dark:!text-slate-300 hover:!bg-slate-50 dark:hover:!bg-slate-800 transition-all cursor-pointer"
                    >
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-[1.5] py-2.5 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white font-semibold text-xs shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {processing && (
                        <div className="w-3.5 h-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                      )}
                      <span>
                        {isAr
                          ? `دفع ${parseFloat(activePayment.amount).toFixed(2)} JOD`
                          : `Pay ${parseFloat(activePayment.amount).toFixed(2)} JOD`}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
