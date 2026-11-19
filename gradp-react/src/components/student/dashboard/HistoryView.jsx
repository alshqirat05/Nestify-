import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Star,
  XCircle,
  Building2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../../utils/api";

function BookingRatingWidget({ booking, onRatingSubmitted, isAr }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(booking.hasRated);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    try {
      const propertyId =
        booking.unit?.property_id ||
        booking.propertyId ||
        booking.unit?.property?.property_id;
      const unitId = booking.unitId || booking.unit?.unit_id;
      if (!propertyId) {
        alert("Property ID not found.");
        return;
      }
      const response = await api.post("/reviews", {
        propertyId: propertyId.toString(),
        unitId: unitId ? unitId.toString() : undefined,
        rating: rating,
        comment: "Rated via history dashboard"
      });
      if (response.success) {
        setSubmitted(true);
        if (onRatingSubmitted) {
          onRatingSubmitted(booking.id || booking.booking_id || booking.bookingID);
        }
      } else {
        alert(response.message || "Failed to submit rating.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting rating: " + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="inline-flex items-center gap-1.5 text-[#3f6212] dark:text-lime-300 font-semibold text-xs bg-[#82BC00]/15 dark:bg-lime-500/15 px-3 py-1.5 rounded-lg">
        <CheckCircle2 size={13} />
        <span>{isAr ? "تم إرسال تقييمك بنجاح" : "Stay Rated"}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
        {isAr ? "قيّم إقامتك:" : "Rate your stay:"}
      </span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="!p-0.5 !bg-transparent !border-0 focus:outline-none cursor-pointer"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            disabled={isSubmitting}
          >
            <Star
              size={16}
              className={`transition-all duration-150 ${(hoverRating || rating) >= star
                ? "fill-amber-400 text-amber-400 scale-110"
                : "text-slate-300 dark:text-slate-600 hover:text-amber-400"
                }`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="text-xs font-semibold !bg-[#004A8D] hover:!bg-[#003a70] !text-white px-3 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting
            ? isAr
              ? "جاري الحفظ..."
              : "Saving..."
            : isAr
              ? "إرسال"
              : "Submit"}
        </button>
      )}
    </div>
  );
}

export default function HistoryView({
  allBookings = [],
  isAr,
  formatD,
  viewportVariants,
  onCancelBooking
}) {
  const { t } = useTranslation();

  const getEndDateForBooking = (b) => {
    const checkin = b.checkInDate || b.startDate || b.requestDate || b.checkin_date;
    const start = checkin ? new Date(checkin) : new Date();
    if (b.checkoutDate) return new Date(b.checkoutDate);
    if (b.checkout_date) return new Date(b.checkout_date);
    if (b.endDate) return new Date(b.endDate);

    const period = b.rentalType || b.rentalPeriod || "monthly";
    const end = new Date(start.getTime());
    if (period === "daily") {
      end.setDate(end.getDate() + 1);
    } else if (period === "seasonal" || period === "semester") {
      end.setMonth(end.getMonth() + 4);
    } else {
      end.setMonth(end.getMonth() + 1);
    }
    return end;
  };

  const getStatusBadge = (status) => {
    const mapping = {
      approved: {
        bg: "bg-[#82BC00]/15 dark:bg-lime-500/15 border-[#82BC00]/30",
        text: "text-[#3f6212] dark:text-lime-300",
        icon: CheckCircle2,
        label: isAr ? "مقبول" : "Approved"
      },
      confirmed: {
        bg: "bg-[#82BC00]/15 dark:bg-lime-500/15 border-[#82BC00]/30",
        text: "text-[#3f6212] dark:text-lime-300",
        icon: CheckCircle2,
        label: isAr ? "مؤكد" : "Confirmed"
      },
      pending: {
        bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200/70 dark:border-amber-500/20",
        text: "text-amber-700 dark:text-amber-400",
        icon: Clock,
        label: isAr ? "قيد المراجعة" : "Pending"
      },
      rejected: {
        bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200/70 dark:border-rose-500/20",
        text: "text-rose-700 dark:text-rose-400",
        icon: XCircle,
        label: isAr ? "مرفوض" : "Rejected"
      },
      cancelled: {
        bg: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
        text: "text-slate-600 dark:text-slate-400",
        icon: AlertCircle,
        label: isAr ? "ملغي" : "Cancelled"
      }
    };

    const config = mapping[status] || mapping.pending;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.bg} ${config.text}`}
      >
        <Icon size={12} />
        <span>{config.label}</span>
      </div>
    );
  };

  if (!allBookings || allBookings.length === 0) {
    return (
      <motion.div
        key="history-empty"
        variants={viewportVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-5">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
            <ClipboardList size={28} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t("student_history.no_history_title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
              {t("student_history.no_history_desc")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => (window.location.href = "/student")}
            className="px-6 py-3 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white font-semibold shadow-xs transition-all text-sm cursor-pointer"
          >
            {t("student_history.browse_btn")}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="history"
      variants={viewportVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 text-start"
    >
      {/* ترويسة الصفحة */}
      <div className="flex items-center w-screen justify-between gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
            <ClipboardList size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t("student_history.title")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t("student_history.subtitle")}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
          {isAr ? `${allBookings.length} حجوزات` : `${allBookings.length} Bookings`}
        </span>
      </div>

      {/* قائمة الحجوزات */}
      <div className="space-y-4">
        {allBookings.map((b, idx) => {
          const checkin = b.checkInDate || b.startDate || b.requestDate || b.checkin_date;
          const startDateObj = checkin ? new Date(checkin) : new Date();
          const endDateObj = getEndDateForBooking(b);
          const isCurrent = idx === 0;
          const isEnded = endDateObj && endDateObj < new Date();
          const showRatingWidget =
            (b.status === "confirmed" || b.status === "approved") &&
            (isEnded || !isCurrent);
          const canCancel =
            b.status !== "cancelled" && b.status !== "rejected" && !isEnded;

          return (
            <div
              key={b.id || b.booking_id || idx}
              className={`p-5 rounded-xl border transition-all bg-white dark:bg-slate-900 ${isCurrent
                ? "border-[#004A8D]/25 dark:border-sky-500/30 shadow-xs"
                : "border-slate-200/80 dark:border-slate-800"
                }`}
            >
              {/* رأس بطاقة الحجز */}
              <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
                    <Building2 size={19} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {b.propertyTitle ||
                          b.unit?.property?.title ||
                          (isAr ? "وحدة سكنية" : "Student Residence")}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${isCurrent
                          ? "bg-[#004A8D]/10 dark:bg-sky-500/15 text-[#004A8D] dark:text-sky-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                      >
                        {isCurrent
                          ? isAr
                            ? "الحجز الأحدث"
                            : "Latest Booking"
                          : isAr
                            ? "حجز سابق"
                            : "Past Booking"}
                      </span>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <User size={12} />
                      <span>
                        {isAr ? `المالك: ${b.ownerName}` : `Landlord: ${b.ownerName}`}
                      </span>
                    </p>
                  </div>
                </div>

                {getStatusBadge(b.status)}
              </div>

              {/* شبكة التفاصيل الرباعية */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-[#004A8D] dark:text-sky-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {t("student_history.location")}
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {b.location || b.unit?.property?.address || (isAr ? "غير محدد" : "N/A")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Calendar size={15} className="text-[#659400] dark:text-lime-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {t("student_history.start_date")}
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {formatD(startDateObj)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-[#004A8D] dark:text-sky-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {t("student_history.end_date")}
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {formatD(endDateObj)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <CreditCard size={15} className="text-[#659400] dark:text-lime-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {isAr ? "الدفع والقيمة" : "Payment & Amount"}
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {(() => {
                        const mLower = (b.payMethod || "").toLowerCase();
                        const isCard =
                          mLower.includes("visa") ||
                          mLower.includes("card") ||
                          mLower.includes("credit");
                        return isCard
                          ? isAr
                            ? "بطاقة"
                            : "Card"
                          : isAr
                            ? "نقدي"
                            : "Cash";
                      })()}
                      {` · ${b.payment?.amount || b.unit?.price || 0} JOD`}
                    </p>
                  </div>
                </div>
              </div>

              {/* التقييم أو زر إلغاء الحجز */}
              {(showRatingWidget || canCancel) && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    {showRatingWidget && (
                      <BookingRatingWidget
                        booking={b}
                        isAr={isAr}
                        t={t}
                        onRatingSubmitted={() => {
                          if (b.hasRated === undefined) {
                            b.hasRated = true;
                          }
                        }}
                      />
                    )}
                  </div>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() =>
                        onCancelBooking &&
                        onCancelBooking(b.id || b.booking_id || b.bookingID)
                      }
                      className="px-4 py-2 rounded-xl !bg-rose-50 hover:!bg-rose-100 dark:!bg-rose-500/10 dark:hover:!bg-rose-500/20 !text-rose-600 dark:!text-rose-400 border !border-rose-200/80 dark:!border-rose-500/20 font-semibold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <XCircle size={14} />
                      <span>{isAr ? "إلغاء الحجز" : "Cancel Reservation"}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
