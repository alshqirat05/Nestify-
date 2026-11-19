import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Landmark,
  TrendingUp,
  Receipt,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";
import api from "../../utils/api";

export default function LandlordFinancialsView({ isAr, viewportVariants }) {
  const [logs, setLogs] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get("/payments/logs");
        if (response.success && response.data) {
          setLogs(response.data);
        }
      } catch (err) {
        console.error("Failed to load landlord financial logs:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchLogs();
  }, []);

  const handleMarkPaid = async (paymentId) => {
    try {
      const generatedTxn =
        "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      const res = await api.post(`/payments/${paymentId}/pay`, {
        transactionId: generatedTxn,
        paymentMethod: "cash",
      });
      if (res.success) {
        setLogs((prev) =>
          prev.map((l) => {
            if (
              l.id === paymentId ||
              l.paymentID === paymentId ||
              l.payment_id === paymentId
            ) {
              return {
                ...l,
                status: "received",
                transaction_id: generatedTxn,
                transactionId: generatedTxn,
              };
            }
            return l;
          })
        );
      }
    } catch (err) {
      console.error("Failed to mark payment as paid:", err);
      alert(isAr ? "فشل تحديث حالة الدفع." : "Failed to mark payment as paid.");
    }
  };

  const completedTxns = logs.filter((l) => {
    const s = (l.status || "").toLowerCase();
    return s === "completed" || s === "paid" || s === "received";
  });
  const pendingTxns = logs.filter((l) => {
    const s = (l.status || "").toLowerCase();
    return s === "pending" || s === "pending payment" || s === "pending_payment";
  });

  const grossRevenue = completedTxns.reduce(
    (sum, l) => sum + parseFloat(l.amount || 0),
    0
  );
  const pendingRevenues = pendingTxns.reduce(
    (sum, l) => sum + parseFloat(l.amount || 0),
    0
  );
  const activeTenants = new Set(logs.map((l) => l.studentName)).size;

  const cardCls =
    "p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-4";

  return (
    <motion.div
      key="landlord-financials"
      variants={viewportVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      className="space-y-6 text-start"
    >
      {/* ── ترويسة الصفحة ── */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200/70 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
          <DollarSign size={20} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? "التقارير المالية والأرباح" : "Financials & Profits"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isAr
              ? "تابع العوائد المالية، الأرباح، وسجل التحصيلات النقدية من عقاراتك"
              : "Monitor rental payouts, gross earnings, and incoming tenant deposits"}
          </p>
        </div>
      </div>

      {fetching ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-8 h-8 border-3 border-[#004A8D] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-400">
            {isAr
              ? "جاري احتساب الدفاتر والميزانيات..."
              : "Calculating ledger metrics..."}
          </p>
        </div>
      ) : (
        <>
          {/* ── بطاقات الإحصائيات المالية ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* إجمالي الأرباح */}
            <div className={cardCls}>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-[#659400] dark:text-lime-400" />
                  <span>{isAr ? "إجمالي الأرباح" : "Net Profits"}</span>
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                  {grossRevenue.toFixed(2)}
                  <span className="text-xs font-semibold text-slate-500">JOD</span>
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#82BC00]/15 dark:bg-lime-500/15 flex items-center justify-center text-[#4d7c0f] dark:text-lime-400 shrink-0">
                <DollarSign size={20} />
              </div>
            </div>

            {/* مستحقات معلقة */}
            <div className={cardCls}>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-500" />
                  <span>{isAr ? "مستحقات معلقة" : "Pending Payouts"}</span>
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                  {pendingRevenues.toFixed(2)}
                  <span className="text-xs font-semibold text-slate-500">JOD</span>
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Landmark size={20} />
              </div>
            </div>

            {/* المستأجرين النشطين */}
            <div className={cardCls}>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Users size={13} className="text-[#004A8D] dark:text-sky-400" />
                  <span>{isAr ? "المستأجرين النشطين" : "Active Tenants"}</span>
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                  {activeTenants}
                  <span className="text-xs font-semibold text-slate-500">
                    {isAr ? "طلاب" : "Students"}
                  </span>
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/15 flex items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
                <Users size={20} />
              </div>
            </div>
          </div>

          {/* ── جدول سجل التحصيلات ── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt size={16} className="text-[#004A8D] dark:text-sky-400" />
                <span>
                  {isAr ? "تفاصيل التحصيلات والمعاملات" : "Income Transaction Ledger"}
                </span>
              </h3>
              {logs.length > 0 && (
                <span className="text-xs text-slate-500">
                  {isAr ? `${logs.length} عملية` : `${logs.length} records`}
                </span>
              )}
            </div>

            {logs.length === 0 ? (
              <div className="p-10 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 text-center text-slate-500 text-xs font-medium">
                {isAr
                  ? "لا توجد أي معاملات مسجلة لعقاراتك حالياً."
                  : "No rental transactions recorded on your properties."}
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-200/80 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200/70 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-start">
                          {isAr ? "المستأجر" : "Tenant"}
                        </th>
                        <th className="px-4 py-3 text-start">
                          {isAr ? "العقار" : "Property"}
                        </th>
                        <th className="px-4 py-3 text-start">
                          {isAr ? "المبلغ" : "Amount"}
                        </th>
                        <th className="px-4 py-3 text-start">
                          {isAr ? "طريقة الدفع" : "Method"}
                        </th>
                        <th className="px-4 py-3 text-start">
                          {isAr ? "رقم المرجع" : "Reference ID"}
                        </th>
                        <th className="px-4 py-3 text-end">
                          {isAr ? "الحالة" : "Status"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {logs.map((l) => {
                        const sLower = (l.status || "").toLowerCase();
                        const isCompleted =
                          sLower === "completed" ||
                          sLower === "paid" ||
                          sLower === "received";
                        const isReceived = sLower === "received";
                        const mLower = (l.paymentMethod || "").toLowerCase();
                        const isCard =
                          mLower.includes("visa") ||
                          mLower.includes("card") ||
                          mLower.includes("credit");
                        const methodText = isCard
                          ? isAr
                            ? "بطاقة ائتمان"
                            : "Credit Card"
                          : mLower.includes("cash")
                            ? isAr
                              ? "نقدي"
                              : "Cash"
                            : "—";

                        return (
                          <tr
                            key={l.id || l.paymentID}
                            className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                              {l.studentName || "Ahmad Student"}
                            </td>
                            <td className="px-4 py-3.5 font-medium text-slate-600 dark:text-slate-400">
                              {l.propertyTitle || "Property"}
                            </td>
                            <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                              {parseFloat(l.amount).toFixed(2)} JOD
                            </td>
                            <td className="px-4 py-3.5 font-medium">{methodText}</td>
                            <td className="px-4 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                              {l.transaction_id || l.transactionId || "PENDING-CLR"}
                            </td>
                            <td className="px-4 py-3.5 text-end">
                              <div className="flex items-center justify-end gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                                    isCompleted
                                      ? "bg-[#82BC00]/15 dark:bg-lime-500/15 text-[#3f6212] dark:text-lime-300"
                                      : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/70 dark:border-amber-500/20"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 size={11} />
                                  ) : (
                                    <Clock size={11} />
                                  )}
                                  {isReceived
                                    ? isAr
                                      ? "مستلمة"
                                      : "Received"
                                    : isCompleted
                                      ? isAr
                                        ? "مدفوعة"
                                        : "Cleared"
                                      : isAr
                                        ? "مستحقة"
                                        : "Pending"}
                                </span>
                                {!isCompleted && (
                                  <button
                                    type="button"
                                    onClick={() => handleMarkPaid(l.id)}
                                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg !bg-[#004A8D] hover:!bg-[#003a70] !text-white shadow-2xs transition-all cursor-pointer"
                                  >
                                    {isAr ? "تأكيد الاستلام" : "Mark Paid"}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
