import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ImageIcon,
  Send,
  Zap,
  Droplets,
  Armchair,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Info,
  XCircle,
  Wrench,
  Building2,
  Check
} from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../../utils/api";

export default function MaintenanceView({ isAr, viewportVariants, booking }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("submit");
  const [selectedCategory, setSelectedCategory] = useState("electrical");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attachedImage, setAttachedImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  const bookings = JSON.parse(localStorage.getItem("bookingRequests") || "[]");
  const myBooking = bookings.find((b) => b.status === "approved") || bookings[bookings.length - 1];

  const categories = [
    {
      id: "electrical",
      label: t("student_maintenance.categories.electrical"),
      icon: Zap,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10"
    },
    {
      id: "plumbing",
      label: t("student_maintenance.categories.plumbing"),
      icon: Droplets,
      color: "text-[#004A8D] dark:text-sky-400",
      bg: "bg-[#004A8D]/10 dark:bg-sky-500/10"
    },
    {
      id: "furniture",
      label: t("student_maintenance.categories.furniture"),
      icon: Armchair,
      color: "text-[#5a8200] dark:text-lime-400",
      bg: "bg-[#82BC00]/15 dark:bg-lime-500/10"
    },
    {
      id: "other",
      label: t("student_maintenance.categories.other"),
      icon: AlertTriangle,
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-100 dark:bg-slate-800"
    },
  ];

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await api.get("/maintenance");
      if (res.success && res.data) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchTickets();
    }
  }, [activeTab]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadFormData = new FormData();
    uploadFormData.append("maintenance_image", file);
    try {
      const uploadRes = await api.post("/upload/maintenance-image", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (uploadRes.success && uploadRes.filePath) {
        setAttachedImage(`/${uploadRes.filePath}`);
      }
    } catch (err) {
      console.error("Maintenance image upload failed:", err);
      alert(isAr ? "فشل رفع الصورة." : "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setIsSubmitting(true);

    try {
      const activeUnitId =
        booking?.unit_id ||
        booking?.unitId ||
        booking?.unit?.unit_id ||
        myBooking?.unit_id ||
        myBooking?.unitId ||
        1;
      let finalDescription = `[${selectedCategory.toUpperCase()}] ${description}`;
      if (attachedImage) {
        finalDescription += `\n[Image] ${attachedImage}`;
      }

      const res = await api.post("/maintenance", {
        unitId: String(activeUnitId),
        issueDescription: finalDescription
      });

      if (res.success) {
        setSubmitted(true);
        setDescription("");
        setAttachedImage("");
        setTimeout(() => setSubmitted(false), 3500);
      }
    } catch (err) {
      console.error("Failed to submit request:", err);
      alert(
        isAr
          ? "فشل تقديم طلب الصيانة. يرجى المحاولة مرة أخرى."
          : "Failed to submit request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const parseTicketDescription = (desc = "") => {
    let category = "other";
    let image = null;
    let cleanDesc = desc;

    const catMatch = cleanDesc.match(/^\[([A-Z]+)\]/i);
    if (catMatch) {
      category = catMatch[1].toLowerCase();
      cleanDesc = cleanDesc.replace(/^\[([A-Z]+)\]\s*/i, "");
    }

    const imgMatch = cleanDesc.match(/\[Image\]\s*([^\s]+)/i);
    if (imgMatch) {
      image = imgMatch[1];
      cleanDesc = cleanDesc.replace(/\s*\[Image\]\s*[^\s]+/i, "");
    }

    return { category, image, description: cleanDesc };
  };

  const getStatusBadge = (status) => {
    const mapping = {
      pending: {
        bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200/70 dark:border-amber-500/20",
        text: "text-amber-700 dark:text-amber-400",
        icon: Clock,
        label: isAr ? "قيد الانتظار" : "Pending"
      },
      processing: {
        bg: "bg-[#004A8D]/10 dark:bg-sky-500/10 border-[#004A8D]/20 dark:border-sky-500/20",
        text: "text-[#004A8D] dark:text-sky-400",
        icon: Info,
        label: isAr ? "جاري العمل" : "In Progress"
      },
      done: {
        bg: "bg-[#82BC00]/15 dark:bg-lime-500/15 border-[#82BC00]/30 dark:border-lime-500/20",
        text: "text-[#3f6212] dark:text-lime-300",
        icon: CheckCircle2,
        label: isAr ? "مكتمل" : "Completed"
      },
      completed: {
        bg: "bg-[#82BC00]/15 dark:bg-lime-500/15 border-[#82BC00]/30 dark:border-lime-500/20",
        text: "text-[#3f6212] dark:text-lime-300",
        icon: CheckCircle2,
        label: isAr ? "مكتمل" : "Completed"
      },
      rejected: {
        bg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200/70 dark:border-rose-500/20",
        text: "text-rose-700 dark:text-rose-400",
        icon: XCircle,
        label: isAr ? "مرفوض" : "Rejected"
      }
    };

    const config = mapping[status] || mapping.pending;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.bg} ${config.text}`}
      >
        <Icon size={12} />
        <span>{config.label}</span>
      </div>
    );
  };

  const filteredTickets = tickets.filter((tItem) => {
    if (typeFilter === "all") return true;
    const parsed = parseTicketDescription(tItem.issueDescription || tItem.description);
    return parsed.category === typeFilter;
  });

  return (
    <motion.div
      variants={viewportVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 text-start"
    >
      {/* ترويسة الصفحة والتبويبات */}
      <div className="flex flex-col w-screen sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/10 text-[#004A8D] dark:text-sky-400 flex items-center justify-center shrink-0">
            <Wrench size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t("student_maintenance.title")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? "أبلغ عن أي عطل في وحدتك السكنية وتابع حالة إصلاحه"
                : "Report an issue in your residence and track repair status"}
            </p>
          </div>
        </div>

        {/* التبديل بين تقديم طلب وسجل الطلبات */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("submit")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "submit"
              ? "!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white shadow-2xs"
              : "!bg-transparent !text-slate-500 hover:!text-slate-900 dark:hover:!text-white"
              }`}
          >
            {isAr ? "تقديم طلب جديد" : "New Request"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "history"
              ? "!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white shadow-2xs"
              : "!bg-transparent !text-slate-500 hover:!text-slate-900 dark:hover:!text-white"
              }`}
          >
            {isAr ? "سجل طلباتي" : "My Requests"}
          </button>
        </div>
      </div>

      {activeTab === "submit" ? (
        <div className="space-y-6">
          {/* شريط يوضح الوحدة السكنية المرتبطة بالطلب */}
          {booking?.propertyTitle && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <Building2 size={15} className="text-[#004A8D] dark:text-sky-400 shrink-0" />
              <span>
                {isAr ? "الوحدة السكنية:" : "Target Residence:"}{" "}
                <strong className="font-bold text-slate-900 dark:text-white">
                  {booking.propertyTitle}
                </strong>
              </span>
            </div>
          )}

          {/* اختيار تصنيف العطل */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t("student_maintenance.select_category")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`relative flex items-center gap-3 p-3.5 rounded-xl border text-start transition-all cursor-pointer ${isSelected
                      ? "!bg-[#004A8D]/[0.05] dark:!bg-sky-500/10 !border-[#004A8D] dark:!border-sky-500 shadow-2xs"
                      : "!bg-white dark:!bg-slate-900 !border-slate-200/80 dark:!border-slate-800 hover:!bg-slate-50 dark:hover:!bg-slate-800/60"
                      }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cat.bg}`}
                    >
                      <Icon size={18} className={cat.color} />
                    </div>
                    <span
                      className={`text-sm font-bold truncate ${isSelected
                        ? "text-[#004A8D] dark:text-sky-400"
                        : "text-slate-700 dark:text-slate-300"
                        }`}
                    >
                      {cat.label}
                    </span>
                    {isSelected && (
                      <span className="ms-auto w-4 h-4 rounded-full bg-[#82BC00] text-slate-950 flex items-center justify-center shrink-0">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* وصف المشكلة */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t("student_maintenance.details_label")}
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 p-4 rounded-xl outline-none focus:ring-2 ring-[#004A8D]/15 focus:border-[#004A8D] dark:focus:border-sky-500 transition-all text-slate-900 dark:text-white resize-none text-sm"
              placeholder={t("student_maintenance.details_placeholder")}
            />
          </div>

          {/* إرفاق صورة توضيحية */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {isAr ? "مرفقات توضيحية (اختياري)" : "Photo Attachment (Optional)"}
            </label>

            {attachedImage ? (
              <div className="inline-flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <img
                  src={attachedImage}
                  alt="Attachment"
                  className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="text-xs space-y-1 pe-2">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {isAr ? "تم إرفاق الصورة بنجاح" : "Photo attached"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setAttachedImage("")}
                    className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold !bg-transparent !p-0 !border-0 hover:underline cursor-pointer"
                  >
                    <X size={13} />
                    <span>{isAr ? "إزالة الصورة" : "Remove photo"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="w-full sm:w-auto inline-flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed !border-slate-300 dark:!border-slate-700 !bg-slate-50/60 dark:!bg-slate-800/40 hover:!bg-slate-100 dark:hover:!bg-slate-800 !text-slate-700 dark:!text-slate-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  <ImageIcon size={16} className="text-[#004A8D] dark:text-sky-400" />
                  <span>
                    {uploadingImage
                      ? isAr
                        ? "جاري رفع الصورة..."
                        : "Uploading photo..."
                      : t("student_maintenance.attach_photos")}
                  </span>
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* زر الإرسال */}
          <div className="pt-2 flex justify-end border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              disabled={isSubmitting || !description.trim()}
              onClick={handleSubmit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white font-semibold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={15} className="text-[#a3e635]" />
                  <span>{t("student_maintenance.submit")}</span>
                </>
              )}
            </button>
          </div>

          {/* رسالة نجاح الإرسال */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-4 bg-[#82BC00]/15 dark:bg-lime-500/10 border border-[#82BC00]/35 rounded-xl text-[#3f6212] dark:text-lime-300"
              >
                <CheckCircle2 size={20} className="text-[#659400] dark:text-lime-400 shrink-0" />
                <div className="flex-1 text-start">
                  <p className="font-bold text-sm">
                    {isAr ? "تم إرسال طلب الصيانة بنجاح" : "Maintenance request submitted"}
                  </p>
                  <p className="text-xs opacity-85 mt-0.5">
                    {isAr
                      ? "تم تسجيل البلاغ وسيتواصل معك مسؤول الصيانة قريباً."
                      : "Your ticket has been logged and the property manager will review it shortly."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-5">
          {loadingTickets ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="w-8 h-8 border-3 border-[#004A8D] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold">
                {isAr ? "جاري تحميل طلبات الصيانة..." : "Loading maintenance requests..."}
              </p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-slate-50/70 dark:bg-slate-800/30 rounded-2xl border border-slate-200/70 dark:border-slate-800">
              <ClipboardList size={36} className="text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-600 dark:text-slate-400 font-semibold text-sm">
                {isAr ? "لا توجد طلبات صيانة سابقة." : "No previous maintenance tickets."}
              </p>
            </div>
          ) : (
            <>
              {/* فلتر الأنواع */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {["all", "electrical", "plumbing", "furniture", "other"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTypeFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${typeFilter === cat
                      ? "!bg-[#004A8D] !text-white shadow-2xs"
                      : "!bg-slate-100 dark:!bg-slate-800 !text-slate-600 dark:!text-slate-300 hover:!bg-slate-200/70 dark:hover:!bg-slate-700"
                      }`}
                  >
                    {cat === "all"
                      ? isAr
                        ? "الكل"
                        : "All Categories"
                      : t(`student_maintenance.categories.${cat}`)}
                  </button>
                ))}
              </div>

              {filteredTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 bg-slate-50/70 dark:bg-slate-800/30 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                  <ClipboardList size={32} className="text-slate-300 dark:text-slate-600 mb-2.5" />
                  <p className="text-slate-500 text-xs font-semibold">
                    {isAr
                      ? "لا توجد طلبات صيانة ضمن هذا التصنيف."
                      : "No maintenance tickets in this category."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTickets.map((tItem) => {
                    const parsed = parseTicketDescription(tItem.issueDescription || tItem.description);
                    const categoryObj =
                      categories.find((c) => c.id === parsed.category) || categories[3];
                    const CatIcon = categoryObj.icon;

                    return (
                      <div
                        key={tItem.id || tItem.ticketID}
                        className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-4 text-start"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-lg ${categoryObj.bg} flex items-center justify-center`}
                              >
                                <CatIcon size={15} className={categoryObj.color} />
                              </div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                                {categoryObj.label}
                              </span>
                            </div>
                            {getStatusBadge(tItem.status)}
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                            {parsed.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            {new Date(tItem.date || tItem.ticket_date || Date.now()).toLocaleDateString(
                              isAr ? "ar-EG" : "en-US",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </span>

                          {parsed.image && (
                            <a
                              href={parsed.image}
                              target="_blank"
                              rel="noreferrer"
                              className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 block"
                            >
                              <img
                                src={parsed.image}
                                alt="Attachment"
                                className="w-full h-full object-cover"
                              />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
