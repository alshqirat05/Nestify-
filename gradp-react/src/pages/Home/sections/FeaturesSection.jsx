/* 
 * مكون FeaturesSection الخاص بواجهة المستخدم.
 */
import React from "react";
import { ShieldCheck, Search, Zap, Award, Heart, Users, Sparkles, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "../../../components/ui/Badge";

const ICON_MAP = {
  safe: ShieldCheck,
  search: Search,
  contact: Zap,
  prices: Award,
  support: Heart,
  hub: Users
};

export default function FeaturesSection() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const featuresList = [
    { key: "safe", theme: "from-indigo-900 to-blue-500", glowColor: "#4f46e5", span: "lg:col-span-2" },
    { key: "search", theme: "from-lime-300 to-green-400", glowColor: "#bef264", span: "" },
    { key: "contact", theme: "from-blue-500 to-green-500", glowColor: "#22c55e", span: "" },
    { key: "prices", theme: "from-rose-500 to-blue-700", glowColor: "#e11d48", span: "" },
    { key: "support", theme: "from-emerald-500 to-teal-400", glowColor: "#10b981", span: "" },
    { key: "hub", theme: "from-sky-500 to-blue-400", glowColor: "#0ea5e9", span: "lg:col-span-2" },
  ];

  return (
    <section id="Fe-grid-main" className="relative py-28 bg-[#F9FAFB] dark:bg-slate-950 transition-all duration-1000 overflow-hidden">

      {/* إضاءة خلفية ناعمة للقسم */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50rem] h-[30rem] bg-lime-300/10 dark:bg-[#82BC00]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-8">

        {/* عنوان القسم */}
        <div className="mb-20 flex flex-col items-center text-center">
          <Badge className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 px-5 py-2 shadow-sm mb-7">
            <Sparkles size={13} className={`${isArabic ? 'text-lime-500' : 'text-indigo-600'}`} />
            <span className="text-[13px] font-bold uppercase tracking-widest">{t("Fe.badge")}</span>
          </Badge>

          <h2 className="text-[32px] leading-[1.1] md:text-6xl font-black text-slate-900 dark:text-slate-50 tracking-tighter max-w-4xl">
            {t("Fe.title_part1")}
            <span className="relative inline-block text-lime-500 drop-shadow-[0_2px_10px_rgba(190,242,100,0.3)]">
              {t("Fe.title_part2")}
              <svg className="absolute -bottom-2 start-0 w-full h-3 text-lime-400/60" viewBox="0 0 200 12" preserveAspectRatio="none" fill="none">
                <path d="M2 9C50 3 150 3 198 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="mt-7 text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
            {t("Fe.subtitle")}
          </p>
        </div>

        {/* شبكة البطاقات بنمط Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresList.map((feat, i) => {
            const IconComponent = ICON_MAP[feat.key];
            const isWide = Boolean(feat.span);

            const title = t(`Fe.items.${feat.key}.title`);
            const desc = t(`Fe.items.${feat.key}.desc`);

            return (
              <div
                key={`${feat.key}-${i}`}
                onMouseEnter={() => {

                  if (import.meta.env.MODE === 'development') console.debug('Hovering:', feat.key);
                }}
                className={`group relative z-1 p-[1.5px] rounded-[2.2rem] transition-transform duration-500 hover:-translate-y-2
                  ${isArabic ? 'text-right' : 'text-left'}
                  ${isWide ? 'sm:col-span-2' : ''} ${feat.span}`}
              >
                {/* الإطار المتوهج الدوّار عند التمرير */}
                <div className="absolute inset-0 rounded-[2.2rem] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-[-150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_40%,#bef264_50%,transparent_60%)]" />
                </div>

                <div className="relative h-full overflow-hidden bg-white/90 dark:bg-[#0f172a] backdrop-blur-sm rounded-[calc(2.2rem-1.5px)] p-8 md:p-9 z-10 border border-slate-200/70 dark:border-slate-800/80 group-hover:border-transparent transition-colors">

                  {/* رقم البطاقة كعلامة مائية */}
                  <span className="absolute top-6 end-8 text-6xl font-black text-slate-100 dark:text-slate-800/70 select-none pointer-events-none transition-colors duration-500 group-hover:text-lime-100 dark:group-hover:text-slate-800">
                    0{i + 1}
                  </span>

                  {/* أيقونة كبيرة باهتة للبطاقات العريضة */}
                  {isWide && IconComponent && (
                    <IconComponent
                      className="absolute -bottom-10 -end-6 w-48 h-48 text-slate-100 dark:text-slate-800/40 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 pointer-events-none"
                      strokeWidth={1}
                    />
                  )}

                  <div className={`relative flex h-full flex-col ${isWide ? 'md:max-w-[70%]' : ''}`}>
                    <div className={`w-14 h-14 mb-8 flex items-center justify-center rounded-2xl bg-gradient-to-br ${feat.theme} shadow-lg transition-all duration-500 group-hover:rotate-[12deg] group-hover:scale-110`}>
                      {IconComponent && <IconComponent className="text-white w-7 h-7" strokeWidth={1.8} />}
                    </div>

                    <h3 className="text-2xl font-[850] text-slate-900 dark:text-white mb-3 leading-tight">
                      {title}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-medium">
                      {desc}
                    </p>

                    {/* سهم يظهر عند التمرير */}
                    <div className="mt-auto pt-8">
                      <span className="inline-flex items-center justify-center size-10 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 transition-all duration-500 group-hover:bg-lime-400 group-hover:border-lime-400 group-hover:text-slate-900">
                        <ArrowUpRight size={18} className={`transition-transform duration-500 ${isArabic ? '-scale-x-100' : ''} group-hover:rotate-45`} />
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute inset-10 opacity-0 group-hover:opacity-25 blur-[50px] transition-all duration-700 -z-10"
                  style={{ backgroundColor: feat.glowColor }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section >
  );
}
