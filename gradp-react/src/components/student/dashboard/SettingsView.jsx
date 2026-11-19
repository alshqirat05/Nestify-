import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, Users, Settings as SettingsIcon } from "lucide-react";
import ProfileSection from "./settings/ProfileSection";
import LifestyleStep2 from "./settings/LifestyleStep2";
import LifestyleStep3 from "./settings/LifestyleStep3";

export default function SettingsView({ isAr, viewportVariants }) {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    {
      id: "profile",
      label: isAr ? "المعلومات الشخصية" : "Personal Profile",
      icon: User
    },
    {
      id: "step2",
      label: isAr ? "أسلوب حياتك" : "My Lifestyle",
      icon: Heart
    },
    {
      id: "step3",
      label: isAr ? "تفضيلات شريك السكن" : "Roommate Preferences",
      icon: Users
    },
  ];

  return (
    <motion.div
      variants={viewportVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 text-start"
    >
      {/* ترويسة الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-800 w-screen">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
            <SettingsIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {isAr ? "إعدادات الحساب والتفضيلات" : "Account & Preferences"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? "عدّل معلوماتك الشخصية، عاداتك المعيشية، ومواصفات شريك السكن"
                : "Update your personal info, lifestyle habits, and roommate matching criteria"}
            </p>
          </div>
        </div>
      </div>

      {/* شريط التبويبات */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 w-fit">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isActive
                  ? "!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white shadow-2xs"
                  : "!bg-transparent !text-slate-500 dark:!text-slate-400 hover:!text-slate-800 dark:hover:!text-slate-200"
                }`}
            >
              <Icon
                size={15}
                className={isActive ? "text-[#004A8D] dark:text-sky-400" : ""}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* محتوى التبويب المختار */}
      <div className="pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "profile" && <ProfileSection isAr={isAr} />}
            {activeTab === "step2" && <LifestyleStep2 isAr={isAr} />}
            {activeTab === "step3" && <LifestyleStep3 isAr={isAr} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
