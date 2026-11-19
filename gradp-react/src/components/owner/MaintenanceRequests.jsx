import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench } from "lucide-react";
import MaintenanceRequestCard from "./MaintenanceRequestCard";
import api from "../../utils/api";

export default function MaintenanceRequests({ isAr, t, stagger }) {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get("/maintenance/landlord");
        if (response.success && response.data) {
          const mapped = response.data.map((req) => {
            const desc = req.issueDescription || req.description || "";
            let image = null;
            let cleanDesc = desc;

            const imgMatch = cleanDesc.match(/\[Image\]\s*([^\s]+)/i);
            if (imgMatch) {
              image = imgMatch[1];
              cleanDesc = cleanDesc.replace(/\s*\[Image\]\s*[^\s]+/i, "");
            }

            let category = "other";
            const catMatch = cleanDesc.match(/^\[([A-Z]+)\]/i);
            if (catMatch) {
              category = catMatch[1].toLowerCase();
            }

            cleanDesc = cleanDesc.replace(/^\[([A-Z]+)\]\s*/i, "");

            return {
              id: req.id || req.ticketID,
              studentName: req.studentName || (isAr ? "طالب" : "Tenant"),
              propertyTitle: req.propertyTitle || (isAr ? "عقاري" : "Property"),
              description: cleanDesc,
              image: image,
              status: req.status,
              category: category,
              date: new Date(
                req.date || req.ticket_date || Date.now()
              ).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            };
          });
          setRequests(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch landlord requests:", err);
      }
    };
    fetchRequests();
  }, [isAr]);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await api.put(`/maintenance/${id}/status`, {
        status: newStatus,
      });
      if (response.success) {
        setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(isAr ? "فشل تحديث حالة الطلب." : "Failed to update ticket status.");
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filter === "all" || req.status === filter;
    const matchesType = typeFilter === "all" || req.category === typeFilter;
    return matchesStatus && matchesType;
  });

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6 text-start"
    >
      {/* ── ترويسة الصفحة ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
            <Wrench size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t("owner_maintenance.title")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t("owner_maintenance.desc")}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 self-start sm:self-auto shrink-0">
          {isAr ? `${filteredRequests.length} بلاغ` : `${filteredRequests.length} Tickets`}
        </span>
      </div>

      {/* ── شريط الفلاتر (الحالة + التصنيف) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* أزرار التصفية حسب الحالة */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-x-auto no-scrollbar self-start">
          {["all", "pending", "processing", "done", "rejected"].map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white shadow-2xs"
                    : "!bg-transparent !text-slate-500 dark:!text-slate-400 hover:!text-slate-900 dark:hover:!text-white"
                }`}
              >
                {f === "all"
                  ? t("owner_maintenance.filter_all")
                  : t(`owner_maintenance.status_${f}`)}
              </button>
            );
          })}
        </div>

        {/* أزرار التصفية حسب نوع الصيانة */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {["all", "electrical", "plumbing", "furniture", "other"].map((cat) => {
            const active = typeFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setTypeFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "!bg-[#004A8D] !text-white shadow-2xs"
                    : "!bg-slate-100 dark:!bg-slate-800 !text-slate-600 dark:!text-slate-300 hover:!bg-slate-200/70 dark:hover:!bg-slate-700"
                }`}
              >
                {cat === "all"
                  ? isAr
                    ? "كل الأنواع"
                    : "All Categories"
                  : t(`student_maintenance.categories.${cat}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── شبكة عرض طلبات الصيانة ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <MaintenanceRequestCard
                key={req.id}
                req={req}
                updateStatus={updateStatus}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-16 px-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 text-center space-y-2.5"
            >
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                <Wrench size={26} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {t("owner_maintenance.no_requests")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                {t("owner_maintenance.no_requests_desc")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
