import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Home,
  GraduationCap,
  CalendarDays,
  UserCheck,
  RefreshCcw,
  CheckCircle2,
  SlidersHorizontal
} from "lucide-react";
import { useTranslation } from "react-i18next";

function DetailTile({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#004A8D]/10 dark:bg-sky-500/10 text-[#004A8D] dark:text-sky-400">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function PreferenceRow({ label, myVal, partnerVal, isAr }) {
  const isMatch =
    myVal && partnerVal && myVal.toLowerCase() === partnerVal.toLowerCase();
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800/80 last:border-0 text-xs">
      <span className="font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      <div className="flex items-center gap-2.5">
        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium capitalize">
          {myVal || (isAr ? "غير محدد" : "N/A")}
        </span>
        <span className="text-slate-300 dark:text-slate-600">↔</span>
        <span
          className={`px-2.5 py-0.5 rounded-md font-semibold capitalize ${
            isMatch
              ? "bg-[#82BC00]/15 dark:bg-lime-500/15 text-[#3f6212] dark:text-lime-300"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          {partnerVal || (isAr ? "غير محدد" : "N/A")}
        </span>
      </div>
    </div>
  );
}

export default function MatchedProfileView({
  roommate,
  onUnmatch,
  viewportVariants,
  isAr
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={viewportVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-5 text-start"
    >
      {/* بطاقة شريك السكن الحالي */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5 pb-4 border-b border-slate-200/70 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#82BC00]/15 dark:bg-lime-500/15 text-[#3f6212] dark:text-lime-300 text-xs font-semibold">
            <UserCheck size={14} />
            <span>{t("roommate_matching.request.matched_success")}</span>
          </div>

          <button
            type="button"
            onClick={onUnmatch}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg !bg-rose-50 hover:!bg-rose-100 dark:!bg-rose-500/10 dark:hover:!bg-rose-500/20 border !border-rose-200/80 dark:!border-rose-500/20 !text-rose-600 dark:!text-rose-400 text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCcw size={12} />
            <span>{isAr ? "إلغاء الشراكة" : "Unmatch Roommate"}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-[#004A8D] text-white flex items-center justify-center text-2xl font-bold shadow-xs">
              {roommate.name?.[0] || "R"}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#82BC00] border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {roommate.name}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              {roommate.major} · {roommate.year}
            </p>
          </div>

          {roommate.similarityScore !== undefined && (
            <div className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-center">
              <span className="block text-lg font-bold text-[#004A8D] dark:text-sky-400 leading-none">
                {roommate.similarityScore}%
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {isAr ? "نسبة التوافق" : "Compatibility"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* شبكة معلومات التواصل والدراسة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <DetailTile
          icon={Phone}
          label={t("roommate_matching.profile.phone")}
          value={roommate.phone}
        />
        <DetailTile
          icon={Home}
          label={t("roommate_matching.profile.reservation")}
          value={
            roommate.hasReservation
              ? t("roommate_matching.profile.yes")
              : t("roommate_matching.profile.no")
          }
        />
        <DetailTile
          icon={GraduationCap}
          label={t("roommate_matching.profile.major")}
          value={roommate.major}
        />
        <DetailTile
          icon={CalendarDays}
          label={t("roommate_matching.profile.year")}
          value={roommate.year}
        />
      </div>

      {/* مقارنة العادات والتفضيلات المعيشية */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#004A8D]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
              <SlidersHorizontal size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isAr
                  ? "مقارنة العادات وأسلوب المعيشة"
                  : "Lifestyle & Habit Comparison"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr
                  ? `نسبة التوافق الكلية: ${roommate.similarityScore || 90}%`
                  : `Overall compatibility score: ${roommate.similarityScore || 90}%`}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#5a8200] dark:text-lime-400">
            <CheckCircle2 size={14} />
            <span>{isAr ? "متوافق" : "Matched"}</span>
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${roommate.similarityScore || 90}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#004A8D] to-[#82BC00] rounded-full"
          />
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          <PreferenceRow
            label={isAr ? "جدول النوم" : "Sleep Schedule"}
            myVal={roommate.myPrefs?.sleep_schedule}
            partnerVal={roommate.partnerPrefs?.sleep_schedule}
            isAr={isAr}
          />
          <PreferenceRow
            label={isAr ? "حالة التدخين" : "Smoking Status"}
            myVal={roommate.myPrefs?.smoking_status}
            partnerVal={roommate.partnerPrefs?.smoking_status}
            isAr={isAr}
          />
          <PreferenceRow
            label={isAr ? "مستوى النظافة" : "Cleanliness Level"}
            myVal={roommate.myPrefs?.cleanliness_level}
            partnerVal={roommate.partnerPrefs?.cleanliness_level}
            isAr={isAr}
          />
          <PreferenceRow
            label={isAr ? "تحمل الضوضاء" : "Noise Tolerance"}
            myVal={roommate.myPrefs?.noise_tolerance}
            partnerVal={roommate.partnerPrefs?.noise_tolerance}
            isAr={isAr}
          />
          <PreferenceRow
            label={isAr ? "المستوى الاجتماعي" : "Social Level"}
            myVal={roommate.myPrefs?.social_level}
            partnerVal={roommate.partnerPrefs?.social_level}
            isAr={isAr}
          />
          <PreferenceRow
            label={isAr ? "مستوى الدراسة" : "Study Habits"}
            myVal={roommate.myPrefs?.study_level}
            partnerVal={roommate.partnerPrefs?.study_level}
            isAr={isAr}
          />
          <PreferenceRow
            label={isAr ? "تفضيل الضيوف" : "Guest Preference"}
            myVal={roommate.myPrefs?.guest_preference}
            partnerVal={roommate.partnerPrefs?.guest_preference}
            isAr={isAr}
          />
        </div>
      </div>
    </motion.div>
  );
}
