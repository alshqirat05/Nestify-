import React from "react";
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";

export default function OwnerStats({ stats, setActiveTab, isAr }) {
  const ArrowIcon = isAr ? ArrowUpLeft : ArrowUpRight;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(({ id, label, sub, value, icon: Icon, targetTab, iconCls }, i) => {
        const isClickable = Boolean(targetTab && setActiveTab);

        return (
          <div
            key={id || i}
            onClick={() => isClickable && setActiveTab(targetTab)}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            className={`p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-4 transition-all group ${
              isClickable
                ? "cursor-pointer hover:border-[#004A8D]/40 dark:hover:border-sky-500/40 hover:bg-white dark:hover:bg-slate-800/70 shadow-2xs"
                : ""
            }`}
          >
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span>{label}</span>
                {isClickable && (
                  <ArrowIcon
                    size={13}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#004A8D] dark:text-sky-400"
                  />
                )}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {value}
              </p>
              {sub && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {sub}
                </p>
              )}
            </div>

            <div
              className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 transition-transform group-hover:scale-105 ${
                iconCls || "bg-[#004A8D]/10 text-[#004A8D]"
              }`}
            >
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
