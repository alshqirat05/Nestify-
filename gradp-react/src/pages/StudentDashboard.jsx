import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import InnerNavbar from "../components/layout/InnerNavbar";
import api from "../utils/api";
import Sidebar from "../components/student/dashboard/Sidebar";
import StudentDashboardHeader from "../components/student/dashboard/StudentDashboardHeader";
import LockedView from "../components/student/dashboard/LockedView";
import OverviewView from "../components/student/dashboard/OverviewView";
import MaintenanceView from "../components/student/dashboard/MaintenanceView";
import RoommateView from "../components/student/dashboard/RoommateView";
import HistoryView from "../components/student/dashboard/HistoryView";
import SettingsView from "../components/student/dashboard/SettingsView";
import BillingView from "../components/student/dashboard/BillingView";
import FavoritesView from "../components/student/dashboard/FavoritesView";
import { PageBackground } from "../components/ui/BackgroundDecorations";
import FloatingShapes from "../components/ui/FloatingShapes";
import {
  viewportVariants,
  RESTRICTED_VIEWS,
  getStudentNavItems,
  mapBookingItem,
  extractPropertyFromBooking,
  normalizePropertyResponse,
  calculateEndDate,
  formatDashboardDate,
} from "../data/studentDashboardData";

export default function StudentDashboard() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  /* الحالة المسؤولة عن تحديد الواجهة المعروضة حالياً */
  const [activeView, setActiveView] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [bookedProperty, setBookedProperty] = useState(null);

  /* جلب بيانات المستخدم من التخزين المحلي */
  const [userData, setUserData] = useState({ name: "Student", profileImage: "", email: "", major: "" });

  useEffect(() => {
    const fetchUser = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserData({
          name: user.name || user.fullName || "Student",
          profileImage: user.profileImage || user.profile_image || "",
          email: user.email || "",
          major: user.major || "",
        });
      }
    };
    fetchUser();
    window.addEventListener("userUpdate", fetchUser);
    return () => window.removeEventListener("userUpdate", fetchUser);
  }, []);

  /* دالة مساعدة لتحميل الحجوزات من التخزين المحلي في حال عدم توفرها من السيرفر */
  const loadFallbackBookings = useCallback(async () => {
    const stored = JSON.parse(localStorage.getItem("bookingRequests") || "[]");
    stored.sort((a, b) => new Date(b.startDate || b.checkInDate) - new Date(a.startDate || a.checkInDate));
    setAllBookings(stored);
    setBooking(stored[0] || null);

    if (stored[0]?.propertyId) {
      try {
        const propRes = await api.get(`/properties/${stored[0].propertyId}`);
        if (propRes.success && propRes.data) {
          setBookedProperty(normalizePropertyResponse(propRes.data));
        }
      } catch (propErr) {
        console.error("Failed to fetch fallback property:", propErr);
      }
    }
  }, []);

  /* جلب بيانات الحجز والعقار المرتبط به من السيرفر */
  const fetchBookingsData = useCallback(async () => {
    try {
      const res = await api.get("/bookings/my-bookings");
      if (res.success && res.data && res.data.length > 0) {
        const mappedList = res.data.map(mapBookingItem);
        mappedList.sort((a, b) => new Date(b.checkInDate || b.checkin_date) - new Date(a.checkInDate || a.checkin_date));
        setAllBookings(mappedList);

        const activeBooking = mappedList.find((b) => ["approved", "pending"].includes(b.status)) || null;
        setBooking(activeBooking);
        setBookedProperty(extractPropertyFromBooking(activeBooking));
      } else {
        await loadFallbackBookings();
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      await loadFallbackBookings();
    } finally {
      setLoading(false);
    }
  }, [loadFallbackBookings]);

  useEffect(() => {
    fetchBookingsData();
  }, [fetchBookingsData]);

  /* إلغاء الحجز وتحديث القائمة */
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(isAr ? "هل أنت متأكد من إلغاء هذا الحجز؟" : "Are you sure you want to cancel this booking?")) {
      return;
    }
    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.success) {
        alert(isAr ? "تم إلغاء الحجز بنجاح." : "Booking cancelled successfully.");
        await fetchBookingsData();
      }
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      const errMsg = err.response?.data?.message || err.message;
      alert(isAr ? `فشل إلغاء الحجز: ${errMsg}` : `Failed to cancel booking: ${errMsg}`);
    }
  };

  /* حساب التواريخ وحالة الحجز */
  const startDate = booking ? new Date(booking.checkInDate || booking.startDate || booking.requestDate) : null;
  const endDate = calculateEndDate(startDate, booking, bookedProperty);
  const formatD = (date) => formatDashboardDate(date, isAr);

  const isApproved =
    booking?.status === "approved" &&
    (booking.payment ? !!booking.payment.payment_date || !!booking.payment.transaction_id : false);

  const hasBooking = !!booking;
  const isLocked = RESTRICTED_VIEWS.includes(activeView) && !hasBooking;
  const navItems = getStudentNavItems(isAr, allBookings.length);

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="relative min-h-screen w-full bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-x-hidden"
    >
      <PageBackground />
      <FloatingShapes />
      <InnerNavbar />

      {loading ? (
        <div className="relative z-10 h-screen w-full flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-slate-200 dark:border-slate-800 border-t-[#004A8D] dark:border-t-[#82BC00] rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {isAr ? "جاري تحميل لوحة التحكم..." : "Loading your dashboard..."}
          </p>
        </div>
      ) : (
        <main className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-16">
          {/* شريط الترحيب العلوي */}
          <StudentDashboardHeader
            userName={userData.name}
            hasBooking={hasBooking}
            booking={booking}
            isAr={isAr}
          />

          {/* التخطيط الرئيسي: القائمة الجانبية + مساحة العرض */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <Sidebar
              activeView={activeView}
              setActiveView={setActiveView}
              navItems={navItems}
              userName={userData.name}
              profileImage={userData.profileImage}
              userData={userData}
              hasBooking={hasBooking}
              isAr={isAr}
            />

            <div className="lg:col-span-9 min-w-0">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 min-h-[560px] shadow-xs">
                <AnimatePresence mode="wait">
                  {isLocked && (
                    <LockedView
                      isAr={isAr}
                      viewportVariants={viewportVariants}
                      setActiveView={setActiveView}
                    />
                  )}

                  {activeView === "overview" && !isLocked && (
                    <OverviewView
                      booking={booking}
                      bookedProperty={bookedProperty}
                      isAr={isAr}
                      isApproved={isApproved}
                      formatD={formatD}
                      startDate={startDate}
                      endDate={endDate}
                      setActiveView={setActiveView}
                      viewportVariants={viewportVariants}
                    />
                  )}

                  {activeView === "maintenance" && !isLocked && (
                    <MaintenanceView
                      isAr={isAr}
                      setActiveView={setActiveView}
                      viewportVariants={viewportVariants}
                      booking={booking}
                    />
                  )}

                  {activeView === "roommate" && (
                    <RoommateView isAr={isAr} viewportVariants={viewportVariants} />
                  )}

                  {activeView === "billing" && !isLocked && (
                    <BillingView
                      booking={booking}
                      isAr={isAr}
                      viewportVariants={viewportVariants}
                    />
                  )}

                  {activeView === "history" && !isLocked && (
                    <HistoryView
                      allBookings={allBookings}
                      isAr={isAr}
                      formatD={formatD}
                      viewportVariants={viewportVariants}
                      onCancelBooking={handleCancelBooking}
                    />
                  )}

                  {activeView === "favorites" && (
                    <FavoritesView isAr={isAr} viewportVariants={viewportVariants} />
                  )}

                  {activeView === "settings" && (
                    <SettingsView isAr={isAr} viewportVariants={viewportVariants} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
