import React from "react";
import { Building2, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";

/**
 * شريط الترحيب العلوي في لوحة تحكم الطالب
 * يعرض اسم الطالب، حالة الحجز الحالي، وزر تصفح السكنات
 */
export default function StudentDashboardHeader({ userName, hasBooking, booking, isAr }) {
  return (
    <div className="mb-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex w-12 h-12 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/10 border border-[#004A8D]/15 dark:border-sky-500/20 items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
          <Building2 size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="!text-xl sm:!text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isAr ? `أهلاً بك، ${userName.split(" ")[0]}` : `Welcome back, ${userName.split(" ")[0]}`}
            </h1>
            {hasBooking ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  booking.status === "approved"
                    ? "bg-[#82BC00]/15 dark:bg-lime-500/15 text-[#3f6212] dark:text-lime-300 border-[#82BC00]/30"
                    : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                }`}
              >
                {booking.status === "approved" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                {booking.status === "approved"
                  ? isAr
                    ? "حجز مؤكد"
                    : "Confirmed Lease"
                  : isAr
                    ? "حجز بانتظار الموافقة"
                    : "Booking Pending"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#82BC00]/15 dark:bg-lime-500/15 text-[#3f6212] dark:text-lime-300 border border-[#82BC00]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#82BC00]" />
                {isAr ? "حساب طالب" : "Student Account"}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {hasBooking
              ? isAr
                ? `الوحدة الحالية: ${booking.propertyTitle || "سكن طلابي"} — ${booking.location || ""}`
                : `Current residence: ${booking.propertyTitle || "Student Residence"} — ${booking.location || ""}`
              : isAr
                ? "أدر حجوزاتك، الفواتير، طلبات الصيانة، وتفضيلات شريك السكن من مكان واحد."
                : "Manage your housing, billing, maintenance requests, and roommate preferences in one place."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
        <button
          type="button"
          onClick={() => (window.location.href = "/student")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
        >
          <span>{isAr ? "تصفح السكنات" : "Browse Housing"}</span>
          <ArrowUpRight size={16} className={`text-[#a3e635] ${isAr ? "-scale-x-100" : ""}`} />
        </button>
      </div>
    </div>
  );
}

