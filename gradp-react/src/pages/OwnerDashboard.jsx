import React from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import InnerNavbar from "../components/layout/InnerNavbar";
import { PageBackground } from "../components/ui/BackgroundDecorations";
import FloatingShapes from "../components/ui/FloatingShapes";
import DashboardHeader from "../components/owner/DashboardHeader";
import OwnerSidebar from "../components/owner/OwnerSidebar";
import OwnerOverviewTab from "../components/owner/OwnerOverviewTab";
import BookingRequests from "../components/owner/BookingRequests";
import MaintenanceRequests from "../components/owner/MaintenanceRequests";
import LandlordFinancialsView from "../components/owner/LandlordFinancialsView";
import SettingsForm from "../components/owner/SettingsForm";
import { useOwnerDashboard } from "../hooks/useOwnerDashboard";
import {
  getOwnerNavItems,
  getOwnerStats,
  fadeUp,
  stagger,
} from "../data/ownerDashboardData";

export default function OwnerDashboard() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const {
    activeTab,
    setActiveTab,
    ownerInfo,
    setOwnerInfo,
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
    bookingRequests,
    handleBookingAction,
    handleLogout,
    activeTenantsCount,
    pendingBookingsCount,
  } = useOwnerDashboard(isAr);

  const navItems = getOwnerNavItems(t, isAr, pendingBookingsCount);
  const stats = getOwnerStats(
    properties.length,
    activeTenantsCount,
    pendingBookingsCount,
    isAr
  );

  // عند الضغط على "إضافة سكن جديد" من أي تبويب، ننتقل لتبويب العقارات ونفتح الفورم
  const handleAddPropertyClick = () => {
    setActiveTab("dashboard");
    openAdd();
  };

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="relative min-h-screen w-full bg-[#f4f6fa] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-x-hidden"
    >
      <PageBackground />
      <FloatingShapes />
      <InnerNavbar hideDashboard={true} />

      <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-4">
        {/* ══════════ الصف الأول من شبكة البنتو: بطاقة المالك (5 أعمدة) + 3 بطاقات إحصائيات (7 أعمدة) ══════════ */}
        <DashboardHeader
          ownerInfo={ownerInfo}
          isAr={isAr}
          t={t}
          openAdd={handleAddPropertyClick}
          handleLogout={handleLogout}
          stats={stats}
          setActiveTab={setActiveTab}
        />

        {/* ══════════ الصف الثاني من شبكة البنتو: 5 بطاقات تفاعلية للتنقل السريع (Bento Navigation Tiles) ══════════ */}
        <OwnerSidebar
          ownerInfo={ownerInfo}
          navItems={navItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAr={isAr}
          t={t}
          handleLogout={handleLogout}
        />

        {/* ══════════ الصف الثالث من شبكة البنتو: مساحة المحتوى الرئيسية ══════════ */}
        <div className="pt-2">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <OwnerOverviewTab
                ownerName={ownerInfo.name}
                stats={stats}
                properties={properties}
                propData={propData}
                setPropData={setPropData}
                showForm={showForm}
                editingIdx={editingIdx}
                openAdd={openAdd}
                openEdit={openEdit}
                closeForm={closeForm}
                saveProp={saveProp}
                deleteProp={deleteProp}
                pendingBookingsCount={pendingBookingsCount}
                setActiveTab={setActiveTab}
                isAr={isAr}
                t={t}
              />
            )}

            {activeTab === "bookings" && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <BookingRequests
                  bookingRequests={bookingRequests}
                  handleBookingAction={handleBookingAction}
                  isAr={isAr}
                  t={t}
                  fadeUp={fadeUp}
                  stagger={stagger}
                />
              </div>
            )}

            {activeTab === "maintenance" && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <MaintenanceRequests
                  isAr={isAr}
                  t={t}
                  fadeUp={fadeUp}
                  stagger={stagger}
                />
              </div>
            )}

            {activeTab === "financials" && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <LandlordFinancialsView
                  isAr={isAr}
                  t={t}
                  viewportVariants={fadeUp}
                />
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <SettingsForm
                  ownerInfo={ownerInfo}
                  setOwnerInfo={setOwnerInfo}
                  t={t}
                  isAr={isAr}
                  fadeUp={fadeUp}
                  stagger={stagger}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
