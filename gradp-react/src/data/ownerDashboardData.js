/**
 * ownerDashboardData.js
 * ─────────────────────────────────────────────────────────
 * بيانات ثابتة ودوال مساعدة تُستخدم في لوحة تحكم المالك (OwnerDashboard).
 * الفائدة: فصل البيانات والمنطق المتكرر عن الواجهة لتسهيل الصيانة.
 * ─────────────────────────────────────────────────────────
 */

import {
  AirVent, Car, WashingMachineIcon, Tv, Wifi, Dumbbell,
  BedDouble, CookingPot, ShowerHead, Droplets,
  LayoutDashboard, ClipboardList, Wrench, DollarSign,
  Settings as SettingsIcon, Building2, Users2, Clock
} from "lucide-react";

/**
 * ستايلات موحدة عصرية للحقول والعناوين
 */
export const MODERN_INPUT_CLS =
  "w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-[#004A8D]/15 dark:focus:ring-[#82BC00]/20 focus:border-[#004A8D] dark:focus:border-[#82BC00] text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200";

export const MODERN_LABEL_CLS =
  "block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5";

/**
 * AVAILABLE_FEATURES
 * قائمة المميزات التي يمكن للمالك إضافتها لعقاره.
 */
export const AVAILABLE_FEATURES = [
  { key: "wifi",            icon: Wifi },
  { key: "ac",              icon: AirVent },
  { key: "furnished",       icon: BedDouble },
  { key: "kitchen",         icon: CookingPot },
  { key: "laundry",         icon: Droplets },
  { key: "parking",         icon: Car },
  { key: "washing_machine", icon: WashingMachineIcon },
  { key: "tv",              icon: Tv },
  { key: "gym",             icon: Dumbbell },
  { key: "privateBathroom", icon: ShowerHead },
];

/**
 * AVAILABLE_RULES
 * قواعد السكن التي يقدر المالك يفعّلها أو يلغيها.
 */
export const AVAILABLE_RULES = [
  "no_smoking",
  "guests_10pm",
  "quiet_hours",
  "no_pets",
  "no_parties",
];

/**
 * EMPTY_PROPERTY
 * القيم الافتراضية عند فتح فورم إضافة عقار جديد.
 */
export const EMPTY_PROPERTY = {
  title:        "",
  type:         "Apartment",
  listingType:  "Solo",
  capacity:     "",
  description:  "",
  price:        "",
  currency:     "JOD",
  gender:       "Male",
  rentalPeriod: "monthly",
  area:         "",
  locationText: "",
  locationLink: "",
  images:       "",
  features:     [],
  rules:        ["no_smoking", "guests_10pm", "quiet_hours", "no_pets", "no_parties"],
  nearby: {
    supermarkets: [],
    laundry:      [],
    hospitals:    [],
    gasStations:  [],
  },
};

/**
 * DASHBOARD_ANIMATION_VARIANTS
 * متغيرات الحركة المُعاد استخدامها في framer-motion.
 */
export const fadeUp  = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
export const stagger = { show:   { transition: { staggerChildren: 0.06 } } };
export const scaleIn = { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1 } };

/**
 * عناصر شريط التنقل العلوي العصري (بدون سايد بار)
 */
export function getOwnerNavItems(t, isAr, pendingBookingsCount = 0) {
  return [
    {
      id: "dashboard",
      label: t("owner_dashboard.tab_dashboard"),
      icon: LayoutDashboard,
      group: "management",
    },
    {
      id: "bookings",
      label: t("owner_dashboard.tab_bookings"),
      icon: ClipboardList,
      badge: pendingBookingsCount > 0 ? pendingBookingsCount : null,
      group: "management",
    },
    {
      id: "maintenance",
      label: t("owner_dashboard.tab_maintenance"),
      icon: Wrench,
      group: "management",
    },
    {
      id: "financials",
      label: isAr ? "المالية والأرباح" : "Financials",
      icon: DollarSign,
      group: "account",
    },
    {
      id: "settings",
      label: t("owner_dashboard.tab_settings"),
      icon: SettingsIcon,
      group: "account",
    },
  ];
}

/**
 * بطاقات الإحصائيات السريعة في لوحة التحكم
 */
export function getOwnerStats(propertiesCount, activeTenantsCount, pendingBookingsCount, isAr) {
  return [
    {
      id: "properties",
      label: isAr ? "إجمالي العقارات" : "Total Properties",
      sub: isAr ? "وحدات معروضة حالياً" : "Active listings",
      value: propertiesCount,
      icon: Building2,
      iconCls: "bg-[#004A8D]/10 text-[#004A8D] dark:bg-sky-500/15 dark:text-sky-400",
    },
    {
      id: "pending_bookings",
      label: isAr ? "طلبات حجز معلقة" : "Pending Requests",
      sub: isAr ? "بانتظار المراجعة" : "Awaiting approval",
      value: pendingBookingsCount,
      icon: Clock,
      targetTab: "bookings",
      iconCls: pendingBookingsCount > 0
        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      id: "tenants",
      label: isAr ? "المستأجرون الحاليون" : "Current Tenants",
      sub: isAr ? "عقود نشطة ومؤكدة" : "Confirmed leases",
      value: activeTenantsCount,
      icon: Users2,
      targetTab: "bookings",
      iconCls: "bg-[#82BC00]/15 text-[#4d7c0f] dark:bg-lime-500/15 dark:text-lime-400",
    },
  ];
}

/**
 * تجهيز بيانات العقار عند فتح نافذة التعديل
 */
export function normalizePropertyForEdit(prop) {
  let resolvedFeatures = [];
  if (prop.features) {
    if (Array.isArray(prop.features)) {
      resolvedFeatures = prop.features;
    } else if (typeof prop.features === "object") {
      resolvedFeatures = Object.keys(prop.features).filter((k) => prop.features[k] === true);
    }
  }

  let resolvedRules = [];
  if (prop.rules) {
    if (Array.isArray(prop.rules)) {
      resolvedRules = prop.rules;
    } else if (typeof prop.rules === "object") {
      resolvedRules = Object.keys(prop.rules).filter((k) => prop.rules[k] === true);
    }
  }

  return {
    ...prop,
    locationText: prop.locationText || prop.address || "",
    features: resolvedFeatures,
    rules: resolvedRules,
  };
}

/**
 * تجهيز البيانات لإرسالها إلى السيرفر (Add / Update)
 */
export function buildPropertyPayload(propData) {
  return {
    title: propData.title,
    description: propData.description,
    price: Number(propData.price),
    address: propData.locationText || propData.address || "TBD Address",
    type: propData.type || "Apartment",
    capacity: Number(propData.capacity) || 1,
    features: propData.features || [],
    properties_image: propData.properties_image || propData.propertiesImage || null,
    gender: propData.gender || "Mixed",
    images: propData.images || [],
    listingType: propData.listingType || "Solo",
    locationLink: propData.locationLink || "",
    rules: propData.rules || [],
    nearby: propData.nearby || { supermarkets: [], laundry: [], hospitals: [], gasStations: [] },
    area: propData.area !== undefined && propData.area !== null && propData.area !== "" ? Number(propData.area) : null,
    currency: propData.currency || "JOD",
    rentalPeriod: propData.rentalPeriod || "monthly",
  };
}

/**
 * توحيد شكل بيانات طلب الحجز القادم من السيرفر
 */
export function mapOwnerBookingItem(b) {
  const sLower = (b.status || "").toLowerCase();
  const normalizedStatus =
    sLower === "pending" || sLower === "pending_approval"
      ? "pending"
      : sLower === "confirmed" || sLower === "approved"
        ? "approved"
        : sLower === "rejected"
          ? "rejected"
          : sLower;

  return {
    ...b,
    id: b.booking_id || b.id,
    studentName: b.studentName || b.student?.user?.name || b.student?.user?.fullName || "Ahmad Student",
    studentPhone: b.studentPhone || b.student?.user?.phone_number || b.student?.user?.phoneNumber || "079...",
    propertyTitle: b.propertyTitle || b.unit?.property?.title || "Property",
    startDate: b.checkInDate || b.startDate,
    endDate: b.checkoutDate || b.endDate,
    payMethod: b.payment?.payment_method || b.payMethod || "cash",
    status: normalizedStatus,
  };
}
