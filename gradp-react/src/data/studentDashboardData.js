/**
 * studentDashboardData.js
 * ─────────────────────────────────────────────────────────
 * بيانات ودوال مساعدة تُستخدم في لوحة تحكم الطالب (StudentDashboard).
 * الفائدة: فصل البيانات والمنطق المتكرر عن الواجهة لتسهيل الصيانة.
 * ─────────────────────────────────────────────────────────
 */

import {
  LayoutDashboard,
  Wrench,
  Users,
  ClipboardList,
  Settings,
  CreditCard,
  Heart
} from "lucide-react";

/* متغيرات الحركة الخاصة بانتقال الأقسام */
export const viewportVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } }
};

/* الأقسام التي تحتاج حجز مسبق */
export const RESTRICTED_VIEWS = ["overview", "history", "maintenance", "billing"];

/* تعريف عناصر القائمة الجانبية */
export function getStudentNavItems(isAr, bookingsCount = 0) {
  return [
    {
      id: "overview",
      label: isAr ? "نظرة عامة" : "Overview",
      icon: LayoutDashboard,
      group: "residence",
      restricted: true
    },
    {
      id: "maintenance",
      label: isAr ? "طلبات الصيانة" : "Maintenance",
      icon: Wrench,
      group: "residence",
      restricted: true
    },
    {
      id: "billing",
      label: isAr ? "الفواتير والدفع" : "Billing & Payments",
      icon: CreditCard,
      group: "residence",
      restricted: true
    },
    {
      id: "history",
      label: isAr ? "سجل الحجوزات" : "Booking History",
      icon: ClipboardList,
      group: "residence",
      restricted: true,
      badge: bookingsCount > 0 ? bookingsCount : null
    },
    {
      id: "roommate",
      label: isAr ? "شريك السكن" : "Roommate Finder",
      icon: Users,
      group: "community",
      restricted: false
    },
    {
      id: "favorites",
      label: isAr ? "المفضلة" : "Saved Housing",
      icon: Heart,
      group: "community",
      restricted: false
    },
    {
      id: "settings",
      label: isAr ? "إعدادات الحساب" : "Account Settings",
      icon: Settings,
      group: "community",
      restricted: false
    },
  ];
}

/* توحيد صيغة الحجز القادم من السيرفر */
export function mapBookingItem(b) {
  const sLower = (b.status || "").toLowerCase();
  const normalizedStatus =
    sLower === "confirmed" || sLower === "approved"
      ? "approved"
      : sLower === "rejected"
        ? "rejected"
        : sLower === "cancelled"
          ? "cancelled"
          : "pending";

  return {
    ...b,
    status: normalizedStatus,
    propertyId: b.unit?.property?.property_id?.toString(),
    requestDate: b.bookingDate || b.checkInDate || b.checkin_date || b.booking_date,
    ownerName:
      b.unit?.property?.landlord?.user?.name ||
      b.unit?.property?.landlord?.business_name ||
      "Owner",
    ownerPhone: b.unit?.property?.landlord?.user?.phone_number || "",
    propertyTitle: b.unit?.property?.title || "",
    location: b.unit?.property?.address || "",
    payMethod: b.payment?.payment_method || b.payMethod || "cash",
  };
}

/* استخراج وتجهيز بيانات العقار من الحجز النشط */
export function extractPropertyFromBooking(activeBooking) {
  const prop = activeBooking?.unit?.property;
  if (!prop) return null;

  const rawImages = prop.properties_image || prop.propertiesImage;
  const imagesArray = typeof rawImages === "string" ? rawImages.split(",") : [];

  return {
    ...prop,
    id: prop.property_id?.toString(),
    location: prop.address,
    price: activeBooking.unit.price,
    image: imagesArray[0] || null,
    images: imagesArray,
  };
}

/* تجهيز بيانات العقار عند جلبه كـ Fallback من الـ API */
export function normalizePropertyResponse(p) {
  if (!p) return null;
  const rawImages = p.properties_image || p.propertiesImage;
  const imagesArray =
    p.images && p.images.length > 0
      ? p.images
      : typeof rawImages === "string"
        ? rawImages.split(",")
        : [];

  return {
    ...p,
    id: p.property_id?.toString() || p.id,
    location: p.address,
    price: p.price || (p.units && p.units.length > 0 ? p.units[0].price : 0),
    image: imagesArray[0] || null,
    images: imagesArray,
  };
}

/* حساب تاريخ نهاية العقد بناءً على نوع الإيجار */
export function calculateEndDate(startDate, booking, bookedProperty) {
  if (!startDate) return null;
  if (booking?.checkoutDate) return new Date(booking.checkoutDate);
  if (booking?.checkout_date) return new Date(booking.checkout_date);
  if (booking?.endDate) return new Date(booking.endDate);

  const period =
    booking?.rentalType ||
    booking?.rentalPeriod ||
    bookedProperty?.rentalPeriod ||
    bookedProperty?.rental_period ||
    "monthly";

  const end = new Date(startDate.getTime());
  if (period === "daily") {
    end.setDate(end.getDate() + 1);
  } else if (period === "seasonal" || period === "semester") {
    end.setMonth(end.getMonth() + 4);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

/* تنسيق عرض التاريخ حسب اللغة */
export function formatDashboardDate(date, isAr) {
  if (!date) return "";
  return date.toLocaleDateString(isAr ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

