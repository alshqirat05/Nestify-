import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  CalendarDays,
  Phone,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  UserCheck,
  Lock
} from "lucide-react";
import { useTranslation } from "react-i18next";

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200/70 dark:border-amber-500/20"
  },
  accepted: {
    icon: CheckCircle2,
    color: "text-[#3f6212] dark:text-lime-300",
    bg: "bg-[#82BC00]/15 dark:bg-lime-500/15",
    border: "border-[#82BC00]/30 dark:border-lime-500/20"
  },
  rejected: {
    icon: XCircle,
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-200/70 dark:border-rose-500/20"
  },
};

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

export default function RoommateCard({ data, onAccept, onReject, onCancel }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const statusCfg = STATUS_CONFIG[data.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;
  const isPending = data.status === "pending";
  const isAccepted = data.status === "accepted";
  const isRejected = data.status === "rejected";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
    >
      <div
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-3.5 px-4 py-3.5 text-start cursor-pointer select-none"
      >
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#004A8D] dark:text-sky-400 font-bold text-base">
            {data.name?.[0] || "S"}
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-slate-900 ${
              isPending
                ? "bg-amber-500"
                : isAccepted
                  ? "bg-[#82BC00]"
                  : "bg-rose-500"
            }`}
          >
            <StatusIcon size={9} strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {data.name}
            </p>
            <span
              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-semibold border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}
            >
              {t(`roommate_matching.status.${data.status}`)}
            </span>
            {data.direction && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-semibold border ${
                  data.direction === "incoming"
                    ? "bg-[#004A8D]/10 dark:bg-sky-500/10 text-[#004A8D] dark:text-sky-400 border-[#004A8D]/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                {data.direction === "incoming"
                  ? t("roommate_matching.request.received")
                  : t("roommate_matching.request.sent")}
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
                  const isLocked = isSensitive && data.status !== "accepted";
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

              {isPending && (
                <div className="flex gap-2.5 pt-1">
                  {data.direction === "incoming" ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAccept && onAccept(data.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white font-semibold text-xs transition-all cursor-pointer shadow-2xs"
                      >
                        <CheckCircle2 size={14} className="text-[#a3e635]" />
                        <span>{t("roommate_matching.request.accept")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReject && onReject(data.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border !border-rose-200 dark:!border-rose-500/20 !bg-rose-50/60 dark:!bg-rose-500/10 !text-rose-600 dark:!text-rose-400 hover:!bg-rose-100 font-semibold text-xs transition-all cursor-pointer"
                      >
                        <XCircle size={14} />
                        <span>{t("roommate_matching.request.reject")}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancel && onCancel(data.id);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border !border-amber-200 dark:!border-amber-500/20 !bg-amber-50/60 dark:!bg-amber-500/10 !text-amber-700 dark:!text-amber-400 hover:!bg-amber-100 font-semibold text-xs transition-all cursor-pointer"
                    >
                      <XCircle size={14} />
                      <span>{t("roommate_matching.request.cancel")}</span>
                    </button>
                  )}
                </div>
              )}

              {isAccepted && (
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#82BC00]/15 border border-[#82BC00]/30">
                  <UserCheck size={14} className="text-[#4d7c0f] dark:text-lime-400" />
                  <span className="text-xs font-semibold text-[#3f6212] dark:text-lime-300">
                    {t("roommate_matching.request.matched_success")}
                  </span>
                </div>
              )}

              {isRejected && (
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/70 dark:border-rose-500/20">
                  <XCircle size={14} className="text-rose-600 dark:text-rose-400" />
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                    {t("roommate_matching.status.rejected")}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
