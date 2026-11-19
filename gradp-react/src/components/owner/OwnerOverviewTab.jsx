import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, ArrowLeft, ArrowRight } from "lucide-react";
import BookingForm from "./BookingForm";
import PropertyList from "./PropertyList";
import { AVAILABLE_FEATURES, stagger } from "../../data/ownerDashboardData";

export default function OwnerOverviewTab({
  properties,
  propData,
  setPropData,
  showForm,
  editingIdx,
  openAdd,
  openEdit,
  closeForm,
  saveProp,
  deleteProp,
  pendingBookingsCount,
  setActiveTab,
  isAr,
  t,
}) {
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <motion.div
      key="dashboard"
      variants={stagger}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      className="space-y-6 text-start"
    >
      {/* ── تنبيه بارز لطلبات الحجز المعلقة ── */}
      {pendingBookingsCount > 0 && (
        <div className="p-4 sm:px-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent dark:from-amber-500/20 border border-amber-300/70 dark:border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white grid place-items-center shrink-0 shadow-sm">
              <BellRing size={19} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-amber-950 dark:text-amber-200">
                {isAr
                  ? `لديك ${pendingBookingsCount} طلبات حجز جديدة بانتظار المراجعة`
                  : `You have ${pendingBookingsCount} pending booking request(s) awaiting review`}
              </p>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/70 mt-0.5">
                {isAr
                  ? "راجع طلبات الطلاب ووافق عليها لتأكيد عقود الإيجار"
                  : "Review incoming student applications to confirm leases"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className="px-4 py-2.5 rounded-xl !bg-amber-500 hover:!bg-amber-600 !text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs"
          >
            <span>{isAr ? "مراجعة الطلبات الآن" : "Review Requests"}</span>
            <ArrowIcon size={14} />
          </button>
        </div>
      )}

      {/* ── نافذة إضافة / تعديل عقار ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <BookingForm
              propData={propData}
              setPropData={setPropData}
              editingIdx={editingIdx}
              onSave={saveProp}
              onClose={closeForm}
              isAr={isAr}
              t={t}
              features={AVAILABLE_FEATURES}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── معرض إدارة العقارات ── */}
      <PropertyList
        properties={properties}
        isAr={isAr}
        t={t}
        openEdit={openEdit}
        deleteProp={deleteProp}
        openAdd={openAdd}
      />
    </motion.div>
  );
}
