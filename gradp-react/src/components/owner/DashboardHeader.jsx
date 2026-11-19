import React from "react";
import {
  Plus,
  LogOut,
  ShieldCheck,
  ArrowUpLeft,
  ArrowUpRight,
  Mail,
  Phone,
  Landmark,
} from "lucide-react";

/**
 * شبكة البنتو العلوية للمالك (Bento Grid Workspace Header)
 * تقسم الجزء العلوي إلى بطاقة تعريف المالك + 3 بطاقات إحصائيات تفاعلية متجاورة
 */
export default function DashboardHeader({
  ownerInfo,
  isAr,
  t,
  openAdd,
  handleLogout,
  stats = [],
  setActiveTab,
}) {
  const firstName =
    (ownerInfo?.name || "").split(" ")[0] ||
    ownerInfo?.name ||
    (isAr ? "المالك" : "Owner");
  const ArrowIcon = isAr ? ArrowUpLeft : ArrowUpRight;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      {/* ── خلية البنتو 1: بطاقة المالك والإجراءات السريعة (تأخذ 5 أعمدة) ── */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col justify-between gap-5 relative overflow-hidden">
        {/* لمسة لونية جانبية خفيفة */}
        <div className="pointer-events-none absolute -top-12 -end-12 w-36 h-36 rounded-full bg-[#004A8D]/[0.06] dark:bg-sky-500/10 blur-2xl" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#004A8D] to-[#0066c2] text-white grid place-items-center text-xl font-black shadow-sm">
                {ownerInfo?.name?.charAt(0)?.toUpperCase() || "O"}
              </div>
              <span className="absolute -bottom-1 -end-1 w-4 h-4 rounded-full bg-[#82BC00] border-2 border-white dark:border-slate-900" />
            </div>

            <div className="min-w-0 text-start">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="!text-lg sm:!text-xl font-extrabold text-slate-900 dark:text-white truncate">
                  {isAr ? `أهلاً، ${firstName}` : `Hi, ${firstName}`}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#82BC00]/15 dark:bg-lime-500/15 text-[#3f6212] dark:text-lime-300">
                  <ShieldCheck size={12} />
                  {t("owner_dashboard.role")}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                {ownerInfo?.email && (
                  <span className="inline-flex items-center gap-1 truncate max-w-[190px]">
                    <Mail size={11} className="text-[#004A8D] dark:text-sky-400 shrink-0" />
                    <span className="truncate">{ownerInfo.email}</span>
                  </span>
                )}
                {ownerInfo?.bankName && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <Landmark size={11} className="text-[#659400] dark:text-lime-400 shrink-0" />
                    <span>{ownerInfo.bankName}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {handleLogout && (
            <button
              type="button"
              onClick={handleLogout}
              title={t("owner_dashboard.logout")}
              className="p-2.5 rounded-xl !bg-slate-100 hover:!bg-rose-50 dark:!bg-slate-800 dark:hover:!bg-rose-950/40 !text-slate-500 hover:!text-rose-600 dark:!text-slate-400 dark:hover:!text-rose-400 transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>

        {/* شريط الأزرار السفلي داخل بطاقة المالك */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 relative z-10">
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {t("owner_dashboard.welcome_desc")}
          </p>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={15} className="text-[#a3e635]" />
            <span>{t("owner_dashboard.add_property")}</span>
          </button>
        </div>
      </div>

      {/* ── خلايا البنتو 2، 3، 4: بطاقات المؤشرات التفاعلية الثلاث (تأخذ 7 أعمدة) ── */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ id, label, sub, value, icon: Icon, targetTab, iconCls }, i) => {
          const isClickable = Boolean(targetTab && setActiveTab);
          const isPendingCard = id === "pending_bookings" && Number(value) > 0;

          return (
            <div
              key={id || i}
              onClick={() => isClickable && setActiveTab(targetTab)}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              className={`group rounded-3xl p-5 border transition-all flex flex-col justify-between gap-4 text-start relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] ${
                isPendingCard
                  ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/90 dark:border-amber-800/50"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800"
              } ${
                isClickable
                  ? "cursor-pointer hover:border-[#004A8D]/40 dark:hover:border-sky-500/40 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgb(0,74,141,0.08)]"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`w-11 h-11 rounded-2xl grid place-items-center shrink-0 transition-transform group-hover:scale-105 ${
                    iconCls || "bg-[#004A8D]/10 text-[#004A8D]"
                  }`}
                >
                  <Icon size={20} />
                </div>

                {isClickable && (
                  <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-[#004A8D] group-hover:text-white dark:group-hover:bg-[#82BC00] dark:group-hover:text-slate-950 grid place-items-center transition-colors">
                    <ArrowIcon size={13} />
                  </span>
                )}
              </div>

              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {value}
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
                  {label}
                </p>
                {sub && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {sub}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
