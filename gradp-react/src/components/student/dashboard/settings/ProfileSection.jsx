import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  CalendarDays,
  Users,
  Save,
  CheckCircle2,
  Camera,
  Trash2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../../../utils/api";

export default function ProfileSection({ isAr }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    year: "",
    semester: "",
    major: "",
    profileImage: ""
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const parsed = JSON.parse(userStr);
      setFormData({
        name: parsed.name || parsed.fullName || "",
        phone: parsed.phone || parsed.phone_number || "",
        email: parsed.email || "",
        gender: parsed.gender || "",
        year: parsed.year || "",
        semester: parsed.semester || "",
        major: parsed.major || "",
        profileImage: parsed.profileImage || parsed.profile_image || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(
          isAr
            ? "الصورة كبيرة جداً، يرجى اختيار صورة أقل من 2 ميجابايت"
            : "Image too large, please pick one under 2MB"
        );
        return;
      }

      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let profileImageUrl = formData.profileImage;

      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("profile_image", selectedFile);

        const uploadRes = await api.post("/upload/profile-image", uploadFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadRes.success && uploadRes.filePath) {
          profileImageUrl = `/${uploadRes.filePath}`;
        }
      }

      const updatePayload = {
        fullName: formData.name,
        phoneNumber: formData.phone,
        profile_image: profileImageUrl,
        major: formData.major,
        gender: formData.gender,
        year: formData.year,
        semester: formData.semester
      };

      await api.put("/users/profile", updatePayload);

      const updatedUser = {
        ...formData,
        fullName: formData.name,
        phone_number: formData.phone,
        profileImage: profileImageUrl,
        profile_image: profileImageUrl,
        semester: formData.semester
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdate"));

      setSelectedFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save profile error:", err);
      alert(
        isAr
          ? "حدث خطأ أثناء حفظ التغييرات"
          : "An error occurred while saving profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = `w-full ${
    isAr ? "pr-10 pl-3.5 text-right" : "pl-10 pr-3.5"
  } py-2.5 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl outline-none focus:ring-2 ring-[#004A8D]/15 focus:border-[#004A8D] dark:focus:border-sky-500 transition-all text-slate-900 dark:text-white text-sm font-medium`;
  const iconStyle = `absolute ${
    isAr ? "right-3.5" : "left-3.5"
  } top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`;

  return (
    <div className="space-y-6 text-start">
      {/* قسم الصورة الشخصية الأفقي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center shrink-0">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={28} className="text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? "الصورة الشخصية" : "Profile Photo"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? "يفضل صورة مربعة واضحة بحد أقصى 2 ميجابايت"
                : "Recommended square image, max size 2MB"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl !bg-white dark:!bg-slate-800 hover:!bg-slate-100 dark:hover:!bg-slate-700 !text-slate-700 dark:!text-slate-200 border !border-slate-200 dark:!border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Camera size={14} className="text-[#004A8D] dark:text-sky-400" />
            <span>{isAr ? "تغيير الصورة" : "Upload Photo"}</span>
          </button>

          {formData.profileImage && (
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, profileImage: "" }))
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl !bg-rose-50 hover:!bg-rose-100 dark:!bg-rose-500/10 dark:hover:!bg-rose-500/20 !text-rose-600 dark:!text-rose-400 border !border-rose-200/70 dark:!border-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
            >
              <Trash2 size={14} />
              <span>{isAr ? "حذف" : "Remove"}</span>
            </button>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* شبكة حقول البيانات الشخصية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t("login_page.full_name")}
          </label>
          <div className="relative">
            <User size={16} className={iconStyle} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t("login_page.email")}
          </label>
          <div className="relative">
            <Mail size={16} className={iconStyle} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t("login_page.phone")}
          </label>
          <div className="relative">
            <Phone size={16} className={iconStyle} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t("login_page.user_gender")}
          </label>
          <div className="relative">
            <Users size={16} className={iconStyle} />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`${inputStyle} appearance-none cursor-pointer`}
            >
              <option value="male">{t("login_page.gender.male")}</option>
              <option value="female">{t("login_page.gender.female")}</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t("login_page.select_year")}
          </label>
          <div className="relative">
            <GraduationCap size={16} className={iconStyle} />
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`${inputStyle} appearance-none cursor-pointer`}
            >
              <option value="0">{t("login_page.years.0")}</option>
              <option value="1">{t("login_page.years.1")}</option>
              <option value="2">{t("login_page.years.2")}</option>
              <option value="3">{t("login_page.years.3")}</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t("login_page.select_semester")}
          </label>
          <div className="relative">
            <CalendarDays size={16} className={iconStyle} />
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className={`${inputStyle} appearance-none cursor-pointer`}
            >
              <option value="0">{t("login_page.semesters.0")}</option>
              <option value="1">{t("login_page.semesters.1")}</option>
              <option value="2">{t("login_page.semesters.2")}</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t("login_page.major")}
          </label>
          <div className="relative">
            <GraduationCap size={16} className={iconStyle} />
            <input
              type="text"
              name="major"
              value={formData.major || ""}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* زر الحفظ */}
      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
            saved
              ? "!bg-emerald-600 !text-white"
              : "!bg-[#004A8D] hover:!bg-[#003a70] !text-white"
          }`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? (
            <CheckCircle2 size={16} />
          ) : (
            <Save size={16} />
          )}
          <span>
            {saved
              ? t("student_settings.actions.saved")
              : t("student_settings.actions.save")}
          </span>
        </button>
      </div>
    </div>
  );
}
