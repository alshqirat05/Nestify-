import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  User,
  CreditCard,
  Clock,
  Home,
  Wrench,
  ClipboardList,
  Phone,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Building2
} from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * مكون عرض نظرة عامة (Overview) بتصميم نظيف ومتوازن مع لمسات خفيفة من الأزرق (#004A8D) والأخضر اللايم (#82BC00)
 */
export default function OverviewView({
  booking,
  bookedProperty,
  isAr,
  isApproved,
  formatD,
  startDate,
  endDate,
  setActiveView,
  viewportVariants
}) {
  const { t } = useTranslation();

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-5">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-[#004A8D] dark:text-sky-400">
          <Home size={28} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t("student_overview.no_booking_title")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
            {t("student_overview.no_booking_desc")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => (window.location.href = "/student")}
          className="px-6 py-3 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
        >
          {t("student_overview.browse_units")}
        </button>
      </div>
    );
  }

  // حساب الأيام المتبقية ونسبة التقدم في العقد
  const now = new Date();
  const totalMs = startDate && endDate ? Math.max(1, endDate.getTime() - startDate.getTime()) : 1;
  const elapsedMs = startDate ? Math.max(0, now.getTime() - startDate.getTime()) : 0;
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
  const daysRemaining = endDate
    ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  const unitPrice =
    bookedProperty?.price ||
    booking?.payment?.amount ||
    booking?.unit?.price ||
    null;

  const isCardPayment = (() => {
    const mLower = (booking.payMethod || "").toLowerCase();
    return mLower.includes("visa") || mLower.includes("card") || mLower.includes("credit");
  })();

  const propertyId =
    bookedProperty?.id ||
    bookedProperty?.property_id ||
    booking?.propertyId ||
    booking?.property_id ||
    booking?.unit?.property?.property_id ||
    booking?.unit?.property?.id ||
    booking?.unit?.property_id;

  const handleViewListing = () => {
    window.location.href = propertyId ? `/property/${propertyId}` : "/student";
  };

  const quickActions = [
    {
      id: "maintenance",
      label: isAr ? "تقديم طلب صيانة" : "Request Maintenance",
      icon: Wrench,
      primary: true,
      iconCls: "text-[#a3e635]"
    },
    {
      id: "billing",
      label: isAr ? "الفواتير والمدفوعات" : "View Billing",
      icon: CreditCard,
      primary: false,
      iconCls: "text-[#004A8D] dark:text-sky-400"
    },
    {
      id: "history",
      label: isAr ? "سجل الحجوزات" : "Booking History",
      icon: ClipboardList,
      primary: false,
      iconCls: "text-[#659400] dark:text-lime-400"
    }
  ];

  return (
    <motion.div
      key="overview"
      variants={viewportVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-5 text-start"
    >
      {/* ترويسة القسم */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/70 dark:border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t("student_overview.current_unit")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isAr
              ? "تفاصيل إقامتك الحالية، بيانات المالك، والوصول السريع لخدمات السكن"
              : "Your active residence details, landlord contact, and quick service shortcuts"}
          </p>
        </div>
      </div>

      {/* شريط البطاقات الإحصائية المصغرة (خلفيات محايدة هادئة مع لمسة لونية خفيفة) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* حالة العقد */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isAr ? "حالة الإقامة والعقد" : "Lease Status"}
            </span>
            {isApproved ? (
              <CheckCircle2 size={16} className="text-[#659400] dark:text-lime-400" />
            ) : (
              <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${isApproved
                ? "bg-[#82BC00]/15 dark:bg-lime-500/15 text-[#3f6212] dark:text-lime-300"
                : "bg-amber-100/80 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400"
                }`}
            >
              {isApproved ? t("student_overview.active_contract") : t("student_overview.pending")}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {booking.status === "approved"
                ? isAr
                  ? "تمت موافقة المالك على الحجز"
                  : "Approved by property landlord"
                : isAr
                  ? "بانتظار مراجعة وتأكيد المالك"
                  : "Awaiting landlord confirmation"}
            </p>
          </div>
        </div>

        {/* الدفع وقيمة الإيجار */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t("student_overview.payment_method")}
            </span>
            <CreditCard size={16} className="text-[#004A8D] dark:text-sky-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              {unitPrice ? (
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {unitPrice} <span className="text-xs font-semibold text-slate-500">JOD</span>
                </span>
              ) : null}
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {unitPrice ? "· " : ""}
                {isCardPayment ? t("student_overview.visa_card") : t("student_overview.cash")}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveView("billing")}
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold !text-[#004A8D] dark:!text-sky-400 !bg-transparent !p-0 !border-0 hover:underline cursor-pointer"
            >
              <span>{isAr ? "إدارة الفواتير والمدفوعات" : "Manage billing & receipts"}</span>
              <ArrowRight size={11} className={isAr ? "rotate-180" : ""} />
            </button>
          </div>
        </div>

        {/* المدة الزمنية المتبقية */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isAr ? "مدة العقد" : "Contract Timeline"}
            </span>
            <Clock size={16} className="text-slate-400" />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1.5">
              <span>
                {daysRemaining !== null
                  ? isAr
                    ? `متبقي ${daysRemaining} يوم`
                    : `${daysRemaining} days remaining`
                  : formatD(endDate)}
              </span>
              <span className="text-slate-400 font-medium">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#004A8D] to-[#82BC00] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 truncate">
              {formatD(startDate)} — {formatD(endDate)}
            </p>
          </div>
        </div>
      </div>

      {/* ══════════ البطاقة الرئيسية لتفاصيل الوحدة السكنية (بدون التواريخ المكررة وبصورة أصغر) ══════════ */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* صورة السكن بحجم أصغر ومؤطرة داخل الكرت */}
          <div className="md:col-span-4 relative h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 group">
            <img
              src={
                bookedProperty?.images?.[0] ||
                bookedProperty?.image ||
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
              }
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt={booking.propertyTitle || "Residence"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />

            <div className="absolute bottom-3 inset-x-3 text-white">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#a3e635]">
                <Building2 size={11} />
                {t("student_overview.current_unit")}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                {booking.propertyTitle}
              </h3>
            </div>
          </div>

          {/* التفاصيل (المالك + الموقع التفصيلي + أزرار الخدمات السريعة) */}
          <div className="md:col-span-8 flex flex-col justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* بطاقة المالك والتواصل */}
              <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/15 text-[#004A8D] dark:text-sky-400 grid place-items-center font-bold text-sm shrink-0">
                    {booking.ownerName?.charAt(0) || <User size={18} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {t("student_overview.owner_name")}
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {booking.ownerName}
                    </p>
                    {booking.ownerPhone && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5" dir="ltr">
                        {booking.ownerPhone}
                      </p>
                    )}
                  </div>
                </div>

                {booking.ownerPhone && (
                  <a
                    href={`tel:${booking.ownerPhone}`}
                    title={isAr ? "اتصال بالمالك" : "Call Owner"}
                    className="w-9 h-9 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white grid place-items-center shrink-0 shadow-2xs transition-colors"
                  >
                    <Phone size={15} />
                  </a>
                )}
              </div>

              {/* بطاقة الموقع التفصيلي */}
              <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#82BC00]/15 dark:bg-lime-500/15 text-[#4d7c0f] dark:text-lime-400 grid place-items-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {t("student_overview.full_location")}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mt-0.5">
                    {booking.location || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* أزرار الخدمات السريعة المرتبطة بالسكن */}
            <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {quickActions.map(({ id, label, icon: Icon, primary, iconCls }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveView(id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${primary
                        ? "!bg-[#004A8D] hover:!bg-[#003a70] !text-white shadow-2xs"
                        : "!bg-slate-100 hover:!bg-slate-200/80 dark:!bg-slate-800 dark:hover:!bg-slate-700 !text-slate-700 dark:!text-slate-200"
                      }`}
                  >
                    <Icon size={14} className={iconCls} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
