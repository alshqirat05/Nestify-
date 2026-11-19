import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  X, MapPin, CheckCircle2, DollarSign, FileText, ShoppingCart, Ban,
  Waves, HeartPulse, Fuel, Wifi, AirVent, BedDouble, CookingPot,
  Droplets, Car, WashingMachineIcon, Tv, Dumbbell, ShowerHead,
  Receipt, GraduationCap, Store, Map as MapIcon, Bus, Dog, Flame, User, Users, Lock,
  Check
} from "lucide-react";
import { Button } from "../ui/Button";
import StepBasicInfo from "./forms/StepBasicInfo";
import StepPriceDetails from "./forms/StepPriceDetails";
import StepLocationPhotos from "./forms/StepLocationPhotos";
import StepFeatures from "./forms/StepFeatures";
import StepHouseRules from "./forms/StepHouseRules";
import StepNearbyPlaces from "./forms/StepNearbyPlaces";
import { MODERN_INPUT_CLS, MODERN_LABEL_CLS } from "../../data/ownerDashboardData";
import api from "../../utils/api";

const TAG_TO_FEATURE_MAP = {
  wifi: { key: "wifi", icon: Wifi, labelEn: "WiFi", labelAr: "واي فاي" },
  ac: { key: "ac", icon: AirVent, labelEn: "Air Conditioning", labelAr: "تكييف" },
  furnished: { key: "furnished", icon: BedDouble, labelEn: "Furnished", labelAr: "مفروش" },
  kitchen: { key: "kitchen", icon: CookingPot, labelEn: "Kitchen", labelAr: "مطبخ" },
  laundry: { key: "laundry", icon: Droplets, labelEn: "Laundry", labelAr: "غسيل ملابس" },
  parking: { key: "parking", icon: Car, labelEn: "Parking", labelAr: "موقف سيارات" },
  washing_machine: { key: "washing_machine", icon: WashingMachineIcon, labelEn: "Washing Machine", labelAr: "غسالة" },
  tv: { key: "tv", icon: Tv, labelEn: "TV", labelAr: "تلفزيون" },
  gym: { key: "gym", icon: Dumbbell, labelEn: "Gym", labelAr: "صالة رياضية" },
  privateBathroom: { key: "privateBathroom", icon: ShowerHead, labelEn: "Private Bathroom", labelAr: "حمام خاص" },
  utilities_included: { key: "utilities_included", icon: Receipt, labelEn: "Utilities Included", labelAr: "شامل الخدمات" },
  near_uni: { key: "near_uni", icon: GraduationCap, labelEn: "Near University", labelAr: "قريب من الجامعة" },
  near_services: { key: "near_services", icon: Store, labelEn: "Near Services", labelAr: "قريب من الخدمات" },
  near_center: { key: "near_center", icon: MapIcon, labelEn: "Near City Center", labelAr: "قريب من وسط البلد" },
  near_connectors: { key: "near_connectors", icon: Bus, labelEn: "Near Transport", labelAr: "قريب من المواصلات" },
  pets_allowed: { key: "pets_allowed", icon: Dog, labelEn: "Pets Allowed", labelAr: "مسموح بالحيوانات الأليفة" },
  smoking_allowed: { key: "smoking_allowed", icon: Flame, labelEn: "Smoking Allowed", labelAr: "مسموح بالتدخين" },
  private_room: { key: "private_room", icon: User, labelEn: "Private Room", labelAr: "غرفة خاصة" },
  shared_room: { key: "shared_room", icon: Users, labelEn: "Shared Room", labelAr: "غرفة مشتركة" },
  security: { key: "security", icon: Lock, labelEn: "Security", labelAr: "حراسة وأمن" },
};

export default function BookingForm({
  propData,
  setPropData,
  editingIdx,
  onSave,
  onClose,
  isAr,
  t,
  features
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [suggesting, setSuggesting] = useState(false);

  const [fetchedDesc, setFetchedDesc] = useState("");
  const [activeFeatures, setActiveFeatures] = useState(features);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setActiveFeatures(features);
  }, [features]);

  useEffect(() => {
    if (currentStep === 3 && propData.description?.trim()) {
      if (propData.description !== fetchedDesc) {
        const fetchAiTags = async () => {
          setAiLoading(true);
          try {
            const response = await api.post("/ai/tag-property", {
              propertyDetails: {
                title: propData.title || "",
                description: propData.description
              }
            });
            if (response.success && response.data) {
              const rawTags = response.data;
              const generated = [];
              rawTags.forEach(tagKey => {
                if (TAG_TO_FEATURE_MAP[tagKey]) {
                  generated.push(TAG_TO_FEATURE_MAP[tagKey]);
                }
              });

              if (generated.length >= 3) {
                setActiveFeatures(generated);
              } else {
                setActiveFeatures(features);
              }
              setFetchedDesc(propData.description);
            } else {
              setActiveFeatures(features);
            }
          } catch (err) {
            console.error("Auto AI Tagging failed:", err);
            setActiveFeatures(features);
          } finally {
            setAiLoading(false);
          }
        };
        fetchAiTags();
      }
    }
  }, [currentStep, propData.description, features, fetchedDesc, propData.title]);

  const handleAiSuggestTags = async () => {
    if (!propData.description?.trim()) return;
    setSuggesting(true);
    try {
      const response = await api.post("/ai/tag-property", {
        propertyDetails: {
          title: propData.title || "",
          description: propData.description
        }
      });
      if (response.success && response.data) {
        const rawTags = response.data;
        const mapper = {
          "wifi": "wifi", "internet": "wifi", "wi-fi": "wifi",
          "ac": "ac", "air conditioning": "ac", "air conditioning/heating": "ac", "cooling": "ac",
          "furnished": "furnished", "bed": "furnished", "furniture": "furnished",
          "kitchen": "kitchen", "cooking": "kitchen", "fridge": "kitchen", "refrigerator": "kitchen",
          "laundry": "laundry", "dryer": "laundry",
          "parking": "parking", "car": "parking", "garage": "parking",
          "washing machine": "washing_machine", "washer": "washing_machine", "washing_machine": "washing_machine",
          "tv": "tv", "television": "tv", "screen": "tv",
          "gym": "gym", "dumbbell": "gym", "workout": "gym",
          "private bathroom": "privateBathroom", "shower": "privateBathroom", "bathroom": "privateBathroom", "privatebathroom": "privateBathroom"
        };

        const extractedKeys = new Set();
        rawTags.forEach(tKey => {
          const norm = tKey.toLowerCase().trim();
          if (mapper[norm]) {
            extractedKeys.add(mapper[norm]);
          }
          if (["wifi", "ac", "furnished", "kitchen", "laundry", "parking", "washing_machine", "tv", "gym", "privateBathroom"].includes(norm)) {
            extractedKeys.add(norm);
          }
        });

        const mergedFeatures = Array.from(new Set([...(propData.features || []), ...extractedKeys]));
        setPropData(p => ({
          ...p,
          features: mergedFeatures
        }));

        alert(
          isAr
            ? `تم استخراج المميزات ذكياً بنجاح! تم تحديد: ${mergedFeatures.map(k => t(`features.${k}`)).join("، ")}`
            : `AI Auto-Tagging Success! Features auto-selected: ${mergedFeatures.join(", ")}`
        );
      }
    } catch (err) {
      console.error("AI Suggestion failed:", err);
      alert(isAr ? "فشل استدعاء ميزة الذكاء الاصطناعي." : "Failed to trigger AI auto-tagging.");
    } finally {
      setSuggesting(false);
    }
  };

  const boxInput = MODERN_INPUT_CLS;
  const labelCls = MODERN_LABEL_CLS;

  const sections = [
    { title: t("owner_dashboard.step_basic"), icon: FileText },
    { title: t("owner_dashboard.step_price"), icon: DollarSign },
    { title: t("owner_dashboard.step_location"), icon: MapPin },
    { title: t("owner_dashboard.step_features"), icon: CheckCircle2 },
    { title: t("owner_dashboard.step_rules"), icon: Ban },
    { title: t("owner_dashboard.step_nearby"), icon: ShoppingCart },
  ];

  const nextStep = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentStep(prev => Math.min(prev + 1, sections.length - 1));
  };

  const prevStep = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const toggleFeature = (key) =>
    setPropData(p => {
      let currentFeatures = [];
      if (Array.isArray(p.features)) {
        currentFeatures = p.features;
      } else if (p.features && typeof p.features === "object") {
        currentFeatures = Object.keys(p.features).filter(k => p.features[k] === true);
      }
      return {
        ...p,
        features: currentFeatures.includes(key)
          ? currentFeatures.filter(f => f !== key)
          : [...currentFeatures, key],
      };
    });

  const toggleRule = (key) =>
    setPropData(p => {
      let currentRules = [];
      if (Array.isArray(p.rules)) {
        currentRules = p.rules;
      } else if (p.rules && typeof p.rules === "object") {
        currentRules = Object.keys(p.rules).filter(k => p.rules[k] === true);
      }
      return {
        ...p,
        rules: currentRules.includes(key)
          ? currentRules.filter(r => r !== key)
          : [...currentRules, key],
      };
    });

  const addNearbyPlace = (category) => {
    const nearby = { ...(propData.nearby || {}) };
    if (!nearby[category]) nearby[category] = [];
    nearby[category] = [...nearby[category], { name: "", distance: "" }];
    setPropData({ ...propData, nearby });
  };

  const updateNearbyPlace = (category, idx, field, value) => {
    const nearby = { ...(propData.nearby || {}) };
    nearby[category] = nearby[category].map((p, i) =>
      i === idx ? { ...p, [field]: value } : p
    );
    setPropData({ ...propData, nearby });
  };

  const removeNearbyPlace = (category, idx) => {
    const nearby = { ...(propData.nearby || {}) };
    nearby[category] = nearby[category].filter((_, i) => i !== idx);
    setPropData({ ...propData, nearby });
  };

  const nearbyCategories = [
    { key: "supermarkets", label: t("owner_dashboard.cat_supermarkets"), icon: ShoppingCart, color: "text-emerald-500" },
    { key: "laundry", label: t("owner_dashboard.cat_laundry"), icon: Waves, color: "text-blue-500" },
    { key: "hospitals", label: t("owner_dashboard.cat_hospitals"), icon: HeartPulse, color: "text-rose-500" },
    { key: "gasStations", label: t("owner_dashboard.cat_gas"), icon: Fuel, color: "text-amber-500" },
  ];

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-lg overflow-hidden">
      {/* ── ترويسة الفورم ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
            {editingIdx !== null && editingIdx !== undefined
              ? t("owner_dashboard.edit_property")
              : t("owner_dashboard.add_title")}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("owner_dashboard.add_desc")}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
        >
          <X size={14} />
          <span>{t("owner_dashboard.cancel")}</span>
        </button>
      </div>

      {/* ── شريط الخطوات الأفقي العصري ── */}
      <div className="px-6 py-3 bg-slate-50/70 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max sm:grid sm:grid-cols-6">
          {sections.map(({ title, icon: Icon }, idx) => {
            const isActive = currentStep === idx;
            const isDone = currentStep > idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-start transition-all cursor-pointer border ${
                  isActive
                    ? "!bg-[#004A8D] !text-white border-[#004A8D] shadow-2xs dark:!bg-[#82BC00] dark:!text-slate-950 dark:border-[#82BC00]"
                    : isDone
                      ? "bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/50"
                      : "bg-white dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg grid place-items-center shrink-0 text-[11px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white dark:bg-slate-950/15 dark:text-slate-950"
                      : isDone
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
                  }`}
                >
                  {isDone ? <Check size={12} strokeWidth={3} /> : <Icon size={13} />}
                </div>
                <span className="text-xs font-bold truncate">{title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── محتوى الخطوة الحالية ── */}
      <div className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); onSave(e); }} className="flex flex-col">
          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <StepBasicInfo
                  propData={propData}
                  setPropData={setPropData}
                  boxInput={boxInput}
                  labelCls={labelCls}
                  t={t}
                  isAr={isAr}
                  suggesting={suggesting}
                  onAiSuggest={handleAiSuggestTags}
                />
              )}
              {currentStep === 1 && <StepPriceDetails propData={propData} setPropData={setPropData} boxInput={boxInput} labelCls={labelCls} t={t} isAr={isAr} />}
              {currentStep === 2 && <StepLocationPhotos propData={propData} setPropData={setPropData} boxInput={boxInput} labelCls={labelCls} t={t} isAr={isAr} />}
              {currentStep === 3 && <StepFeatures propData={propData} toggleFeature={toggleFeature} features={activeFeatures} t={t} isAr={isAr} isLoading={aiLoading} />}
              {currentStep === 4 && <StepHouseRules propData={propData} toggleRule={toggleRule} t={t} isAr={isAr} />}
              {currentStep === 5 && <StepNearbyPlaces propData={propData} nearbyCategories={nearbyCategories} addNearbyPlace={addNearbyPlace} updateNearbyPlace={updateNearbyPlace} removeNearbyPlace={removeNearbyPlace} boxInput={boxInput} t={t} isAr={isAr} />}
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="!rounded-xl !px-5 !py-2 text-xs font-bold disabled:opacity-30 transition-opacity"
            >
              {t("owner_dashboard.btn_back")}
            </Button>

            {currentStep < sections.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="!rounded-xl !px-6 !py-2 !bg-[#004A8D] hover:!bg-[#003a70] !text-white text-xs font-bold shadow-xs border-none"
              >
                {t("owner_dashboard.btn_next")}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={(e) => { e.preventDefault(); onSave(e); }}
                className="!rounded-xl !px-6 !py-2 !bg-emerald-600 hover:!bg-emerald-700 !text-white text-xs font-bold shadow-xs border-none"
              >
                {editingIdx !== null && editingIdx !== undefined
                  ? t("owner_dashboard.save_changes")
                  : t("owner_dashboard.list_property")}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
