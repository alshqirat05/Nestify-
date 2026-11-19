import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Users,
  Mail,
  Lock,
  Landmark,
  AlertCircle,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "../ui/Button";
import { MODERN_INPUT_CLS, MODERN_LABEL_CLS } from "../../data/ownerDashboardData";
import api from "../../utils/api";

export default function SettingsForm({
  ownerInfo,
  setOwnerInfo,
  t,
  isAr,
  fadeUp,
  stagger,
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!ownerInfo.bankName || ownerInfo.bankName.trim().length < 2) {
      alert(
        isAr
          ? "اسم البنك يجب أن يتكون من حرفين على الأقل"
          : "Bank Name must be at least 2 characters"
      );
      setLoading(false);
      return;
    }
    if (!/^[a-zA-Z\s\u0600-\u06FF]+$/.test(ownerInfo.bankName.trim())) {
      alert(
        isAr
          ? "اسم البنك يجب أن يحتوي على حروف فقط"
          : "Bank Name must only contain letters"
      );
      setLoading(false);
      return;
    }
    if (
      !ownerInfo.bankAccountHolderName ||
      ownerInfo.bankAccountHolderName.trim().length < 2
    ) {
      alert(
        isAr
          ? "اسم صاحب الحساب يجب أن يتكون من حرفين على الأقل"
          : "Bank Account Holder Name must be at least 2 characters"
      );
      setLoading(false);
      return;
    }
    if (
      !/^[a-zA-Z\s\u0600-\u06FF]+$/.test(
        ownerInfo.bankAccountHolderName.trim()
      )
    ) {
      alert(
        isAr
          ? "اسم صاحب الحساب يجب أن يحتوي على حروف فقط"
          : "Bank Account Holder Name must only contain letters"
      );
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: ownerInfo.name,
        phoneNumber: ownerInfo.phone,
        email: ownerInfo.email,
        bankName: ownerInfo.bankName,
        bankAccountHolderName: ownerInfo.bankAccountHolderName,
      };

      if (ownerInfo.password && ownerInfo.password !== "password123") {
        payload.password = ownerInfo.password;
      }

      const res = await api.put("/users/profile", payload);
      if (res.success) {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const parsed = JSON.parse(userStr);
          const updatedUser = {
            ...parsed,
            name: ownerInfo.name,
            fullName: ownerInfo.name,
            phone_number: ownerInfo.phone,
            email: ownerInfo.email,
            bankName: ownerInfo.bankName,
            bankAccountHolderName: ownerInfo.bankAccountHolderName,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        window.dispatchEvent(new Event("userUpdate"));
        alert(
          isAr ? "تم حفظ التغييرات بنجاح!" : "Settings saved successfully!"
        );
      }
    } catch (err) {
      console.error("Failed to update landlord settings:", err);
      alert(
        isAr
          ? "فشل حفظ التغييرات. يرجى المحاولة مرة أخرى."
          : "Failed to save settings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="settings"
      variants={stagger}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      className="space-y-6 text-start"
    >
      {/* ── ترويسة الصفحة ── */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3.5 pb-4 border-b border-slate-200/70 dark:border-slate-800"
      >
        <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
          <SettingsIcon size={20} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t("owner_dashboard.settings_title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t("owner_dashboard.settings_desc")}
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/15 grid place-items-center text-[#004A8D] dark:text-sky-400 text-base font-bold shrink-0">
            {ownerInfo.name?.charAt(0) || "O"}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
              {ownerInfo.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {ownerInfo.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-w-3xl">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={MODERN_LABEL_CLS}>
                <span className="inline-flex items-center gap-1.5">
                  <User size={13} className="text-[#004A8D] dark:text-sky-400" />
                  {t("owner_login.full_name")}
                </span>
              </label>
              <input
                required
                type="text"
                value={ownerInfo.name}
                onChange={(e) =>
                  setOwnerInfo({ ...ownerInfo, name: e.target.value })
                }
                className={MODERN_INPUT_CLS}
              />
            </div>

            <div>
              <label className={MODERN_LABEL_CLS}>
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={13} className="text-[#004A8D] dark:text-sky-400" />
                  {t("owner_login.phone")}
                </span>
              </label>
              <input
                required
                type="tel"
                value={ownerInfo.phone}
                onChange={(e) =>
                  setOwnerInfo({ ...ownerInfo, phone: e.target.value })
                }
                className={MODERN_INPUT_CLS}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className={MODERN_LABEL_CLS}>
                <span className="inline-flex items-center gap-1.5">
                  <Users size={13} className="text-[#004A8D] dark:text-sky-400" />
                  {t("owner_login.gender")}
                </span>
              </label>
              <select
                value={ownerInfo.gender}
                onChange={(e) =>
                  setOwnerInfo({ ...ownerInfo, gender: e.target.value })
                }
                className={MODERN_INPUT_CLS}
              >
                <option value="male">{t("owner_login.male")}</option>
                <option value="female">{t("owner_login.female")}</option>
              </select>
            </div>

            <div>
              <label className={MODERN_LABEL_CLS}>
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={13} className="text-[#004A8D] dark:text-sky-400" />
                  {t("owner_login.email")}
                </span>
              </label>
              <input
                required
                type="email"
                value={ownerInfo.email}
                onChange={(e) =>
                  setOwnerInfo({ ...ownerInfo, email: e.target.value })
                }
                className={MODERN_INPUT_CLS}
              />
            </div>

            <div>
              <label className={MODERN_LABEL_CLS}>
                <span className="inline-flex items-center gap-1.5">
                  <Lock size={13} className="text-[#004A8D] dark:text-sky-400" />
                  {t("owner_login.password")}
                </span>
              </label>
              <input
                required
                type="password"
                value={ownerInfo.password}
                onChange={(e) =>
                  setOwnerInfo({ ...ownerInfo, password: e.target.value })
                }
                className={MODERN_INPUT_CLS}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid sm:grid-cols-2 gap-5">
            <div>
              <label className={MODERN_LABEL_CLS}>
                <span className="inline-flex items-center gap-1.5">
                  <Landmark
                    size={13}
                    className="text-[#659400] dark:text-lime-400"
                  />
                  {isAr ? "اسم البنك" : "Bank Name"}
                </span>
              </label>
              <input
                required
                type="text"
                value={ownerInfo.bankName}
                onChange={(e) =>
                  setOwnerInfo({ ...ownerInfo, bankName: e.target.value })
                }
                className={MODERN_INPUT_CLS}
                placeholder={isAr ? "مثال: البنك العربي" : "e.g., Arab Bank"}
              />
            </div>

            <div>
              <label className={MODERN_LABEL_CLS}>
                <span className="inline-flex items-center gap-1.5">
                  <User size={13} className="text-[#659400] dark:text-lime-400" />
                  {isAr ? "اسم صاحب الحساب" : "Account Holder Name"}
                </span>
              </label>
              <input
                required
                type="text"
                value={ownerInfo.bankAccountHolderName}
                onChange={(e) =>
                  setOwnerInfo({
                    ...ownerInfo,
                    bankAccountHolderName: e.target.value,
                  })
                }
                className={MODERN_INPUT_CLS}
                placeholder={
                  isAr
                    ? "الاسم الكامل لصاحب الحساب"
                    : "Full account holder name"
                }
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="!bg-[#004A8D] hover:!bg-[#003a70] !text-white !rounded-xl !px-6 !py-2.5 text-xs sm:text-sm font-semibold border-none shadow-xs disabled:opacity-50"
            >
              {loading
                ? isAr
                  ? "جاري الحفظ..."
                  : "Saving..."
                : t("owner_dashboard.save_settings")}
            </Button>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <AlertCircle size={13} />
              {isAr ? "يتم تطبيق التغييرات فوراً" : "Changes apply immediately"}
            </span>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
