import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  User,
  Building2,
  MessageSquare,
  Image as ImageIcon,
  Zap,
  Droplets,
  Armchair,
  AlertTriangle,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MaintenanceRequestCard({ req, updateStatus }) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/70 dark:border-amber-500/20";
      case "processing":
        return "bg-[#004A8D]/10 dark:bg-sky-500/10 text-[#004A8D] dark:text-sky-400 border-[#004A8D]/20 dark:border-sky-500/20";
      case "done":
      case "completed":
        return "bg-[#82BC00]/15 dark:bg-lime-500/15 text-[#3f6212] dark:text-lime-300 border-[#82BC00]/30 dark:border-lime-500/20";
      case "rejected":
        return "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/70 dark:border-rose-500/20";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={12} />;
      case "processing":
        return <Info size={12} />;
      case "done":
      case "completed":
        return <CheckCircle2 size={12} />;
      case "rejected":
        return <XCircle size={12} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return t("owner_maintenance.status_pending");
      case "processing":
        return t("owner_maintenance.status_processing");
      case "done":
      case "completed":
        return t("owner_maintenance.status_done");
      case "rejected":
        return t("owner_maintenance.status_rejected");
      default:
        return status;
    }
  };

  const getCategoryConfig = (category) => {
    switch (category) {
      case "electrical":
        return {
          icon: <Zap size={13} />,
          style:
            "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20",
        };
      case "plumbing":
        return {
          icon: <Droplets size={13} />,
          style:
            "bg-[#004A8D]/10 dark:bg-sky-500/10 text-[#004A8D] dark:text-sky-400 border-[#004A8D]/20 dark:border-sky-500/20",
        };
      case "furniture":
        return {
          icon: <Armchair size={13} />,
          style:
            "bg-[#82BC00]/15 dark:bg-lime-500/10 text-[#5a8200] dark:text-lime-400 border-[#82BC00]/25 dark:border-lime-500/20",
        };
      default:
        return {
          icon: <AlertTriangle size={13} />,
          style:
            "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
        };
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between gap-4 text-start"
    >
      <div className="space-y-4">
        {/* حالة الطلب وتاريخه */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusStyle(
                req.status
              )}`}
            >
              {getStatusIcon(req.status)}
              <span>{getStatusLabel(req.status)}</span>
            </div>

            {req.category &&
              (() => {
                const catConfig = getCategoryConfig(req.category);
                return (
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${catConfig.style}`}
                  >
                    {catConfig.icon}
                    <span>{t(`student_maintenance.categories.${req.category}`)}</span>
                  </div>
                );
              })()}
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {req.date}
          </span>
        </div>

        {/* معلومات الطالب واسم السكن */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/15 flex items-center justify-center shrink-0 text-[#004A8D] dark:text-sky-400">
            <User size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {req.studentName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Building2 size={12} className="text-[#004A8D] dark:text-sky-400 shrink-0" />
              <span className="truncate">{req.propertyTitle}</span>
            </div>
          </div>
        </div>

        {/* وصف المشكلة والصورة المرفقة */}
        <div className="space-y-3">
          <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5 text-slate-400">
              <MessageSquare size={12} />
              <span className="text-[11px] font-semibold">
                {t("owner_maintenance.description")}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {req.description}
            </p>
          </div>

          {req.image && (
            <div className="relative group/img overflow-hidden rounded-xl h-40 bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
              <img
                src={req.image}
                alt="Maintenance"
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center p-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white font-semibold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon size={14} className="text-[#a3e635]" />
                  <span>{t("owner_maintenance.view_image")}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* أزرار الموافقة، الرفض، والانتهاء من الطلب */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2.5">
        {req.status === "pending" && (
          <>
            <button
              type="button"
              onClick={() => updateStatus(req.id, "rejected")}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl !bg-rose-50 hover:!bg-rose-100 dark:!bg-rose-500/10 dark:hover:!bg-rose-500/20 !text-rose-600 dark:!text-rose-400 border !border-rose-200/80 dark:!border-rose-500/20 font-semibold text-xs transition-all cursor-pointer"
            >
              <XCircle size={14} />
              <span>{t("owner_maintenance.action_reject")}</span>
            </button>
            <button
              type="button"
              onClick={() => updateStatus(req.id, "processing")}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} className="text-[#a3e635]" />
              <span>{t("owner_maintenance.action_accept")}</span>
            </button>
          </>
        )}

        {req.status === "processing" && (
          <>
            <div className="col-span-1" />
            <button
              type="button"
              onClick={() => updateStatus(req.id, "done")}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} className="text-[#a3e635]" />
              <span>{t("owner_maintenance.action_done")}</span>
            </button>
          </>
        )}

        {(req.status === "done" || req.status === "completed" || req.status === "rejected") && (
          <div className="col-span-2 text-center text-xs font-semibold text-slate-400 py-1">
            {t("owner_maintenance.closed")}
          </div>
        )}
      </div>

      {/* Full Image Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 end-3 z-10 w-9 h-9 rounded-xl !bg-slate-900/90 hover:!bg-slate-800 !text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
              <img
                src={req.image}
                alt="Maintenance Full"
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
