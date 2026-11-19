import React, { useState, useEffect } from "react";
import { Check, Save, CheckCircle2 } from "lucide-react";
import { st3Qus } from "../../../../constants/st3Qus";
import { useTranslation } from "react-i18next";
import api from "../../../../utils/api";

export default function LifestyleStep3({ isAr }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [answers, setAnswers] = useState({});
  const questions = st3Qus(t);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await api.get("/users/preferences");
        if (res.success && res.data) {
          setAnswers(res.data);
          localStorage.setItem("lifestyle_step3", JSON.stringify(res.data));
        } else {
          const savedPrefs = localStorage.getItem("lifestyle_step3");
          if (savedPrefs) {
            setAnswers(JSON.parse(savedPrefs));
          }
        }
      } catch (err) {
        console.error("Failed to fetch preferences:", err);
        const savedPrefs = localStorage.getItem("lifestyle_step3");
        if (savedPrefs) {
          setAnswers(JSON.parse(savedPrefs));
        }
      }
    };
    fetchPrefs();
  }, []);

  const handleSelect = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put("/users/preferences", answers);
      localStorage.setItem("lifestyle_step3", JSON.stringify(answers));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save preferences:", err);
      alert(
        isAr ? "حدث خطأ أثناء حفظ البيانات" : "An error occurred while saving"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((q) => {
          const Icon = q.icon;
          return (
            <div
              key={q.id}
              className="space-y-3.5 p-4 sm:p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${q.colorClass.bg} ${q.colorClass.text}`}
                >
                  <Icon size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {q.title}
                </h4>
              </div>

              <div className="flex flex-col gap-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(q.id, opt.value)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-start ${
                        isSelected
                          ? "!bg-[#004A8D]/[0.06] dark:!bg-sky-500/15 !border-[#004A8D] dark:!border-sky-500 !text-[#004A8D] dark:!text-sky-400"
                          : "!bg-white dark:!bg-slate-900 !border-slate-200/80 dark:!border-slate-800 !text-slate-600 dark:!text-slate-300 hover:!bg-slate-50 dark:hover:!bg-slate-800/70"
                      }`}
                    >
                      <span>{t(opt.label)}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[#004A8D] dark:bg-sky-500 text-white"
                            : "border border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

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
              ? t("student_settings.actions.success")
              : t("student_settings.actions.save_roommate")}
          </span>
        </button>
      </div>
    </div>
  );
}
