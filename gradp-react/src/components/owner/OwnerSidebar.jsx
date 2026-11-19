import React from "react";

/**
 * شبكة بطاقات التنقل السريع (Bento Action Tiles)
 * 5 بطاقات تفاعلية متجاورة تمثل أقسام لوحة تحكم المالك ضمن شبكة البنتو
 */
export default function OwnerSidebar({
  navItems,
  activeTab,
  setActiveTab,
  isAr,
}) {
  const subtitles = {
    dashboard: isAr ? "إدارة الوحدات المعروضة" : "Manage active listings",
    bookings: isAr ? "مراجعة طلبات الطلاب" : "Student lease requests",
    maintenance: isAr ? "متابعة بلاغات الأعطال" : "Track repair tickets",
    financials: isAr ? "التحصيلات وسجل الأرباح" : "Revenue & payouts",
    settings: isAr ? "البيانات الشخصية والبنك" : "Profile & bank info",
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {navItems.map(({ id, label, icon: Icon, badge }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`group relative p-4 rounded-2xl border text-start transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 overflow-hidden ${
              isActive
                ? "!bg-[#004A8D] !text-white !border-[#004A8D] shadow-[0_10px_25px_-5px_rgba(0,74,141,0.35)]"
                : "!bg-white dark:!bg-slate-900 !text-slate-800 dark:!text-slate-200 !border-slate-200/80 dark:!border-slate-800 shadow-[0_6px_24px_rgb(0,0,0,0.04)] dark:shadow-[0_6px_24px_rgb(0,0,0,0.2)] hover:!border-[#004A8D]/40 dark:hover:!border-sky-500/40 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgb(0,74,141,0.08)]"
            }`}
          >
            {/* الصف العلوي داخل البطاقة: الأيقونة + الشارة أو نقطة التفعيل */}
            <div className="flex items-center justify-between gap-2 w-full">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? "bg-white/15 text-[#a3e635]"
                    : "bg-slate-100 dark:bg-slate-800 text-[#004A8D] dark:text-sky-400 group-hover:bg-[#004A8D]/10"
                }`}
              >
                <Icon size={19} />
              </div>

              {badge ? (
                <span
                  className={`px-2 py-0.5 text-[11px] font-extrabold rounded-full leading-none ${
                    isActive
                      ? "bg-[#a3e635] text-slate-950"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {badge}
                </span>
              ) : isActive ? (
                <span className="w-2.5 h-2.5 rounded-full bg-[#a3e635]" />
              ) : null}
            </div>

            {/* الصف السفلي: اسم القسم + وصف مختصر */}
            <div className="min-w-0">
              <p
                className={`text-xs sm:text-sm font-extrabold truncate ${
                  isActive ? "text-white" : "text-slate-900 dark:text-white"
                }`}
              >
                {label}
              </p>
              <p
                className={`text-[11px] truncate mt-0.5 ${
                  isActive
                    ? "text-sky-100/80"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {subtitles[id] || ""}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
