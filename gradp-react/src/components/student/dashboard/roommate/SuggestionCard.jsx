import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  CalendarDays,
  Phone,
  Home,
  Send,
  ChevronDown,
  Lock,
  Check
} from "lucide-react";
import { useTranslation } from "react-i18next";

const DETAIL_FIELDS = [
  {
    icon: Phone,
    labelKey: "roommate_matching.profile.phone",
    resolve: (data) => data.phone,
    isSensitive: true,
  },
  {
    icon: Home,
    labelKey: "roommate_matching.profile.reservation",
    resolve: (data, t) =>
      data.hasReservation
        ? t("roommate_matching.profile.yes")
        : t("roommate_matching.profile.no"),
  },
  {
    icon: GraduationCap,
    labelKey: "roommate_matching.profile.major",
    resolve: (data) => data.major,
  },
  {
    icon: CalendarDays,
    labelKey: "roommate_matching.profile.year",
    resolve: (data) => data.year,
  },
];

export default function SuggestionCard({ data, onPair, alreadySent }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 overflow-hidden transition-all"
    >
      <div
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-3.5 px-4 py-3.5 text-start cursor-pointer select-none"
      >
        <div className="w-11 h-11 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/15 border border-[#004A8D]/15 dark:border-sky-500/20 flex items-center justify-center text-[#004A8D] dark:text-sky-400 font-bold text-base shrink-0">
          {data.name?.[0] || "S"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {data.name}
            </p>
            {data.similarityScore !== undefined && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#82BC00]/15 dark:bg-lime-500/15 text-[#3f6212] dark:text-lime-300">
                {isAr ? `توافق ${data.similarityScore}%` : `${data.similarityScore}% Match`}
              </span>
            )}
            {data.hasReservation && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#82BC00]" />
                {t("roommate_matching.card.reserved")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            {data.major && (
              <span className="flex items-center gap-1">
                <GraduationCap size={12} className="text-slate-400" />
                <span>{data.major}</span>
              </span>
            )}
            {data.year && (
              <span className="flex items-center gap-1">
                <CalendarDays size={12} className="text-slate-400" />
                <span>{data.year}</span>
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPair && onPair(data);
            }}
            disabled={alreadySent}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              alreadySent
                ? "!bg-slate-100 dark:!bg-slate-800 !text-slate-400 dark:!text-slate-500 cursor-not-allowed"
                : "!bg-[#004A8D] hover:!bg-[#003a70] !text-white shadow-2xs"
            }`}
          >
            {alreadySent ? (
              <>
                <Check size={13} />
                <span className="hidden sm:inline">
                  {t("roommate_matching.status.pending")}
                </span>
              </>
            ) : (
              <>
                <Send size={12} className="text-[#a3e635]" />
                <span className="hidden sm:inline">
                  {t("roommate_matching.card.pair_btn")}
                </span>
              </>
            )}
          </button>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800"
          >
            <ChevronDown size={14} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 space-y-3 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-2.5">
                {DETAIL_FIELDS.map(({ icon: Icon, labelKey, resolve, isSensitive }) => {
                  const isLocked = isSensitive;
                  const displayValue = isLocked
                    ? t("roommate_matching.profile.locked", "Hidden until accepted")
                    : resolve(data, t);

                  return (
                    <div
                      key={labelKey}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                    >
                      <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1">
                        {t(labelKey)}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {isLocked ? (
                          <Lock size={12} className="text-amber-500 shrink-0" />
                        ) : (
                          <Icon size={12} className="text-[#004A8D] dark:text-sky-400 shrink-0" />
                        )}
                        <p
                          className={`text-xs font-semibold truncate ${
                            isLocked
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {displayValue}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("roommate_matching.profile.habits_desc")}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
