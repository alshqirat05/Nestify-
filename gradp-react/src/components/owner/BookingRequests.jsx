import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  CreditCard,
  Banknote,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  X,
  Phone,
  Calendar,
  Clock,
  User,
  Building2,
} from "lucide-react";

export default function BookingRequests({
  bookingRequests,
  handleBookingAction,
  isAr,
  t,
  fadeUp,
  stagger,
}) {
  const [statusFilter, setStatusFilter] = useState("all");

  const fmtDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString(isAr ? "ar-JO" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const rentalLabel = (period) => {
    const map = {
      monthly: t("owner_booking.monthly"),
      daily: t("owner_booking.daily"),
      seasonal: t("owner_booking.seasonal"),
    };
    return map[period] || t("owner_booking.monthly");
  };

  const indexedRequests = bookingRequests.map((req, originalIdx) => ({
    req,
    originalIdx,
  }));

  const filteredList = indexedRequests.filter(({ req }) => {
    if (statusFilter === "all") return true;
    return req.status === statusFilter;
  });

  const filters = [
    { id: "all", label: isAr ? "الكل" : "All" },
    { id: "pending", label: t("owner_booking.status_pending") },
    { id: "approved", label: t("owner_booking.status_approved") },
    { id: "rejected", label: t("owner_booking.status_rejected") },
  ];

  return (
    <motion.div
      key="bookings"
      variants={stagger}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      className="space-y-6 text-start"
    >
      {/* ── ترويسة الصفحة والفلاتر ── */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-800"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
            <ClipboardList size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t("owner_booking.title")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t("owner_booking.desc")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-x-auto no-scrollbar self-start sm:self-auto">
          {filters.map(({ id, label }) => {
            const active = statusFilter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setStatusFilter(id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white shadow-2xs"
                    : "!bg-transparent !text-slate-500 dark:!text-slate-400 hover:!text-slate-900 dark:hover:!text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── حاوية الطلبات ── */}
      <motion.div
        variants={fadeUp}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
            {t("owner_booking.incoming")}
          </h3>
          <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-lg">
            {filteredList.length}{" "}
            {filteredList.length === 1
              ? t("owner_booking.request_single")
              : t("owner_booking.request_plural")}
          </span>
        </div>

        {filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center mb-3 text-slate-400">
              <ClipboardList size={26} />
            </div>
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
              {t("owner_booking.no_requests")}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t("owner_booking.no_requests_desc")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredList.map(({ req, originalIdx }) => {
              const mLower = (req.payMethod || "").toLowerCase();
              const isCard =
                mLower.includes("visa") ||
                mLower.includes("card") ||
                mLower.includes("credit");

              return (
                <div
                  key={req.id || originalIdx}
                  className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/15 text-[#004A8D] dark:text-sky-400 grid place-items-center shrink-0">
                      <User size={19} />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {req.studentName}
                        </p>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${
                            req.status === "approved"
                              ? "bg-[#82BC00]/15 text-[#3f6212] border-[#82BC00]/30 dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-500/20"
                              : req.status === "rejected"
                                ? "bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                                : "bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                          }`}
                        >
                          {req.status === "approved"
                            ? t("owner_booking.status_approved")
                            : req.status === "rejected"
                              ? t("owner_booking.status_rejected")
                              : t("owner_booking.status_pending")}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <Building2
                            size={12}
                            className="text-[#004A8D] dark:text-sky-400"
                          />
                          {req.propertyTitle}
                        </span>

                        {req.studentPhone && (
                          <a
                            href={`tel:${req.studentPhone}`}
                            className="flex items-center gap-1 hover:text-[#004A8D] dark:hover:text-sky-400 transition-colors"
                          >
                            <Phone size={12} />
                            <span dir="ltr">{req.studentPhone}</span>
                          </a>
                        )}

                        <span className="flex items-center gap-1">
                          {isCard ? <CreditCard size={12} /> : <Banknote size={12} />}
                          {isCard
                            ? isAr
                              ? "بطاقة ائتمان"
                              : "Credit Card"
                            : isAr
                              ? "نقدي"
                              : "Cash"}
                        </span>

                        {req.rentalPeriod && (
                          <span className="font-semibold text-[#004A8D] dark:text-sky-400 flex items-center gap-1">
                            <Clock size={12} />
                            {rentalLabel(req.rentalPeriod)}
                          </span>
                        )}

                        {req.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {fmtDate(req.startDate)} — {fmtDate(req.endDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── أزرار القبول والرفض ── */}
                  {req.status === "pending" ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleBookingAction(originalIdx, "approve")}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                      >
                        <ThumbsUp size={13} className="text-[#a3e635]" />
                        <span>{t("owner_booking.approve")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBookingAction(originalIdx, "reject")}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl !bg-rose-50 hover:!bg-rose-100 !text-rose-600 dark:!bg-rose-500/10 dark:hover:!bg-rose-500/20 dark:!text-rose-400 border !border-rose-200/80 dark:!border-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <ThumbsDown size={13} />
                        <span>{t("owner_booking.reject")}</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold shrink-0 ${
                        req.status === "approved"
                          ? "text-[#4d7c0f] dark:text-lime-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {req.status === "approved" ? (
                        <CheckCircle2 size={15} />
                      ) : (
                        <X size={15} />
                      )}
                      <span>
                        {req.status === "approved"
                          ? t("owner_booking.approved_done")
                          : t("owner_booking.rejected_done")}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
