import React from "react";
import { User, Lock, Compass, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * مكون القائمة الجانبية (Sidebar) بتصميم هادئ ومتوازن مع لمسات الأزرق (#004A8D) والأخضر اللايم (#82BC00)
 */
export default function Sidebar({
  activeView,
  setActiveView,
  navItems,
  userName,
  profileImage,
  userData = {},
  hasBooking = false,
}) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const residenceItems = navItems.filter((item) => item.group === "residence");
  const communityItems = navItems.filter((item) => item.group === "community");

  const renderNavButton = (nav) => {
    const isActive = activeView === nav.id;
    const isRestrictedLocked = nav.restricted && !hasBooking;
    const Icon = nav.icon;

    return (
      <button
        key={nav.id}
        type="button"
        onClick={() => setActiveView(nav.id)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
          isActive
            ? "!bg-[#004A8D] !text-white shadow-xs"
            : "!bg-transparent !text-slate-600 dark:!text-slate-400 hover:!bg-slate-100/80 dark:hover:!bg-slate-800/60 hover:!text-slate-900 dark:hover:!text-white"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            isActive
              ? "bg-white/15 text-[#a3e635]"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          }`}
        >
          <Icon size={17} />
        </div>

        <span className="truncate flex-1 text-start">{nav.label}</span>

        {nav.badge ? (
          <span
            className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
              isActive
                ? "bg-[#82BC00] text-slate-950"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {nav.badge}
          </span>
        ) : isRestrictedLocked ? (
          <Lock
            size={13}
            className={isActive ? "text-white/70" : "text-slate-400 dark:text-slate-600"}
          />
        ) : isActive ? (
          <span className="w-2 h-2 rounded-full bg-[#82BC00]" />
        ) : null}
      </button>
    );
  };

  return (
    <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
      {/* شريط التنقل الأفقي للموبايل والتابلت */}
      <div className="lg:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-2 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {navItems.map((nav) => {
            const isActive = activeView === nav.id;
            const Icon = nav.icon;
            const isRestrictedLocked = nav.restricted && !hasBooking;
            return (
              <button
                key={nav.id}
                type="button"
                onClick={() => setActiveView(nav.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "!bg-[#004A8D] !text-white shadow-xs"
                    : "!bg-transparent !text-slate-600 dark:!text-slate-400 hover:!bg-slate-100 dark:hover:!bg-slate-800"
                }`}
              >
                <Icon size={15} className={isActive ? "text-[#a3e635]" : ""} />
                <span>{nav.label}</span>
                {isRestrictedLocked && (
                  <Lock size={11} className={isActive ? "text-white/75" : "text-slate-400"} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* القائمة الجانبية لسطح المكتب */}
      <div className="hidden lg:flex lg:flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs space-y-5">
        {/* بطاقة تعريف الطالب */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#004A8D]/10 dark:bg-sky-500/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <User size={22} className="text-[#004A8D] dark:text-sky-400" />
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#82BC00] border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          <div className="min-w-0 flex-1 text-start">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {userName}
            </h2>
            {userData.major ? (
              <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                <GraduationCap size={12} className="text-[#004A8D] dark:text-sky-400 shrink-0" />
                <span className="truncate">{userData.major}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {userData.email || t("student_sidebar.hub")}
              </p>
            )}
          </div>
        </div>

        {/* القسم الأول: السكن والعقود */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 text-start">
            {isAr ? "السكن والحجوزات" : "Residence & Lease"}
          </p>
          {residenceItems.map(renderNavButton)}
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800/80" />

        {/* القسم الثاني: المجتمع والحساب */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 text-start">
            {isAr ? "المجتمع والحساب" : "Community & Account"}
          </p>
          {communityItems.map(renderNavButton)}
        </div>

        {/* بطاقة تصفح الوحدات السكنية */}
        <div className="pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-start space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#82BC00]/15 text-[#4d7c0f] dark:text-lime-400 flex items-center justify-center shrink-0">
                <Compass size={17} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {t("student_sidebar.explore")}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAr ? "استكشف الخيارات المتاحة حول جامعتك" : "Discover verified units near campus"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = "/student")}
              className="w-full py-2 px-3 rounded-lg !bg-white dark:!bg-slate-900 hover:!bg-slate-100 dark:hover:!bg-slate-800 !text-[#004A8D] dark:!text-sky-400 border !border-slate-200 dark:!border-slate-700 text-xs font-semibold transition-all cursor-pointer text-center shadow-2xs"
            >
              {isAr ? "الذهاب لصفحة السكنات" : "Open Housing Directory"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
