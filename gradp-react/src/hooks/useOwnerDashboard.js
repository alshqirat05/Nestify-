/**
 * useOwnerDashboard.js
 * ─────────────────────────────────────────────────────────
 * خطاف مخصص (Custom Hook) لإدارة منطق وحالات لوحة تحكم المالك:
 *   - بيانات المالك وتحديثها
 *   - جلب وإضافة وتعديل وحذف العقارات
 *   - جلب طلبات الحجز والرد عليها (قبول / رفض)
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import {
  EMPTY_PROPERTY,
  normalizePropertyForEdit,
  buildPropertyPayload,
  mapOwnerBookingItem,
} from "../data/ownerDashboardData";

export function useOwnerDashboard(isAr) {
  // ── حالات التحكم في الواجهة (UI Controls) ──
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);

  // ── جلب بيانات المالك من التخزين المحلي ──
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  const [ownerInfo, setOwnerInfo] = useState({
    name: currentUser?.name || currentUser?.fullName || (isAr ? "ساره المالك" : "Sara Owner"),
    phone: currentUser?.phone_number || currentUser?.phoneNumber || "0791234567",
    gender: currentUser?.gender || "female",
    email: currentUser?.email || "",
    password: "password123",
    id: currentUser?.id || "1",
    bankName: currentUser?.bankName || "",
    bankAccountHolderName: currentUser?.bankAccountHolderName || "",
  });

  useEffect(() => {
    const handleUserUpdate = () => {
      const uStr = localStorage.getItem("user");
      const u = uStr ? JSON.parse(uStr) : null;
      if (u) {
        setOwnerInfo((prev) => ({
          ...prev,
          name: u.name || u.fullName || prev.name,
          phone: u.phone_number || u.phoneNumber || prev.phone,
          gender: u.gender || prev.gender,
          email: u.email || prev.email,
          bankName: u.bankName || prev.bankName,
          bankAccountHolderName: u.bankAccountHolderName || prev.bankAccountHolderName,
        }));
      }
    };
    window.addEventListener("userUpdate", handleUserUpdate);
    return () => window.removeEventListener("userUpdate", handleUserUpdate);
  }, []);

  // ── العقارات (Properties) ──
  const [properties, setProperties] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [propData, setPropData] = useState(EMPTY_PROPERTY);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const landlordId = currentUser?.id || ownerInfo.id;
        const res = await api.get(`/properties?landlord_id=${landlordId}`);
        if (res.success && res.data) {
          setProperties(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProps();
  }, [currentUser?.id, ownerInfo.id]);

  // فتح فورم الإضافة
  const openAdd = useCallback(() => {
    setPropData(EMPTY_PROPERTY);
    setEditingIdx(null);
    setShowForm(true);
    window.scrollTo({ top: 180, behavior: "smooth" });
  }, []);

  // فتح فورم التعديل
  const openEdit = useCallback(
    (idx) => {
      const prop = properties[idx];
      if (!prop) return;
      setPropData(normalizePropertyForEdit(prop));
      setEditingIdx(idx);
      setShowForm(true);
      window.scrollTo({ top: 180, behavior: "smooth" });
    },
    [properties]
  );

  // إغلاق الفورم
  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingIdx(null);
  }, []);

  // حفظ العقار (إضافة أو تعديل)
  const saveProp = async (e) => {
    if (e) e.preventDefault();
    const payload = buildPropertyPayload(propData);

    try {
      if (editingIdx !== null && editingIdx !== undefined && properties[editingIdx]) {
        const propertyId = properties[editingIdx].property_id || properties[editingIdx].id;
        const res = await api.put(`/properties/${propertyId}`, payload);
        if (res.success) {
          const next = [...properties];
          next[editingIdx] = { ...propData, ...res.data };
          setProperties(next);
        }
      } else {
        const res = await api.post("/properties", payload);
        if (res.success) {
          setProperties([{ ...propData, ...res.data }, ...properties]);
        }
      }
      closeForm();
    } catch (err) {
      console.error("Failed to save property:", err);
      let errMsg = isAr
        ? "فشل حفظ العقار. يرجى التأكد من البيانات والمحاولة مرة أخرى."
        : "Failed to save property. Please try again.";
      if (typeof err === "object" && err.message) errMsg = err.message;
      alert(errMsg);
    }
  };

  // حذف عقار
  const deleteProp = async (idx) => {
    const prop = properties[idx];
    if (!prop) return;
    const propertyId = prop.property_id || prop.id;

    const confirmMsg = isAr
      ? `هل أنت متأكد من حذف العقار "${prop.title}"؟\nتنبيه: لا يمكن التراجع عن هذا الإجراء.`
      : `Are you sure you want to delete "${prop.title}"? This action cannot be undone.`;

    if (window.confirm(confirmMsg)) {
      try {
        const res = await api.delete(`/properties/${propertyId}`);
        if (res.success) {
          setProperties((prev) => prev.filter((_, i) => i !== idx));
        }
      } catch (err) {
        console.error("Failed to delete property:", err);
        alert(isAr ? "فشل حذف العقار." : "Failed to delete property.");
      }
    }
  };

  // ── طلبات الحجز (Booking Requests) ──
  const [bookingRequests, setBookingRequests] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/my-bookings");
        if (res.success && res.data) {
          setBookingRequests(res.data.map(mapOwnerBookingItem));
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };
    fetchBookings();
  }, []);

  // قبول أو رفض طلب حجز
  const handleBookingAction = async (idx, action) => {
    const req = bookingRequests[idx];
    if (!req) return;
    const bookingId = req.id || req.booking_id;
    const backendStatus = action === "approve" ? "confirmed" : "rejected";

    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: backendStatus });
      if (res.success) {
        setBookingRequests((prev) => {
          const updated = [...prev];
          updated[idx] = { ...req, status: action === "approve" ? "approved" : "rejected" };
          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to update booking status:", err);
      alert(isAr ? "فشل تحديث حالة الحجز." : "Failed to update booking status.");
    }
  };

  // تسجيل الخروج
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }, []);

  // إحصائيات مشتقة
  const activeTenantsCount = bookingRequests.filter(
    (b) => b.status === "approved" || b.status === "confirmed"
  ).length;
  const pendingBookingsCount = bookingRequests.filter((b) => b.status === "pending").length;

  return {
    activeTab,
    setActiveTab,
    ownerInfo,
    setOwnerInfo,
    properties,
    fetching,
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
  };
}

