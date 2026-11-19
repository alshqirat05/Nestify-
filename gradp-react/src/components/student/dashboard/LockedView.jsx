import React from "react";
import { motion } from "framer-motion";
import { Lock, Compass, Users } from "lucide-react";

/**
 * مكون رسالة "لم تحجز بعد" للأقسام المقيدة
 * يعرض خطوات إرشادية سريعة للطالب الجديد
 */
export default function LockedView({ isAr, viewportVariants, setActiveView }) {
  return (
    <motion.div
      key="locked"
      variants={viewportVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="py-12 px-4"
    >
      <div className="max-w-xl mx-auto text-center">
        <div className="w-16 h-16 bg-[#004A8D]/[0.07] dark:bg-slate-800 border border-[#004A8D]/15 dark:border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#004A8D] dark:text-sky-400">
          <Lock size={28} strokeWidth={1.75} />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {isAr ? "لا يوجد حجز نشط حالياً" : "No Active Residence Yet"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
          {isAr
            ? "هذا القسم مخصص لإدارة سكنك الحالي (العقد، الفواتير، وطلبات الصيانة). يمكنك البدء بتصفح السكنات المتاحة أو البحث عن شريك سكن أولاً."
            : "This section is unlocked once you have an active booking to manage your lease, bills, and maintenance. Start by browsing available housing or finding a roommate."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => (window.location.href = "/student")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
          >
            <Compass size={17} />
            <span>{isAr ? "تصفح الوحدات السكنية" : "Browse Available Housing"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("roommate")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl !bg-slate-100 hover:!bg-slate-200/80 dark:!bg-slate-800 dark:hover:!bg-slate-700 !text-slate-700 dark:!text-slate-200 font-semibold text-sm transition-all cursor-pointer"
          >
            <Users size={17} />
            <span>{isAr ? "ابحث عن شريك سكن" : "Find a Roommate"}</span>
          </button>
        </div>

        {/* خطوات إرشادية سريعة للطالب الجديد */}
        <div className="mt-10 pt-8 border-t border-slate-200/70 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-start">
          <div
            onClick={() => setActiveView("settings")}
            className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-[#004A8D]/30 transition-all cursor-pointer"
          >
            <span className="inline-block text-xs font-bold text-[#004A8D] dark:text-sky-400 mb-1">
              {isAr ? "خطوة ١" : "Step 1"}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {isAr ? "أكمل ملفك وتفضيلاتك" : "Complete Your Profile"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isAr ? "حدد عاداتك الدراسية والمعيشية لتحسين نتائج المطابقة." : "Set your study and lifestyle habits for better matching."}
            </p>
          </div>

          <div
            onClick={() => setActiveView("roommate")}
            className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-[#82BC00]/40 transition-all cursor-pointer"
          >
            <span className="inline-block text-xs font-bold text-[#5a8200] dark:text-lime-400 mb-1">
              {isAr ? "خطوة ٢" : "Step 2"}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {isAr ? "اختر شريك السكن" : "Match with a Roommate"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isAr ? "تواصل مع طلاب متوافقين معك في التخصص وأسلوب الحياة." : "Connect with students who share your habits and major."}
            </p>
          </div>

          <div
            onClick={() => (window.location.href = "/student")}
            className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-[#004A8D]/30 transition-all cursor-pointer"
          >
            <span className="inline-block text-xs font-bold text-[#004A8D] dark:text-sky-400 mb-1">
              {isAr ? "خطوة ٣" : "Step 3"}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {isAr ? "احجز وحدتك السكنية" : "Book Your Unit"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {isAr ? "اختر السكن المناسب وتابع عقدك وفواتيرك من هنا." : "Reserve your place and manage your contract & bills here."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

