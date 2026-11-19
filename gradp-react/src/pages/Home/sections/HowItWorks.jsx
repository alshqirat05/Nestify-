/* 
 * مكون HowItWorks الخاص بواجهة المستخدم.
 */
import React, { useLayoutEffect, useRef } from "react";
import { MousePointerClick, SplitSquareVertical, User, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);
  const isAr = i18n.language === "ar";

  const steps = [
    { number: "01", title: t("how_it_works.steps.step1.title"), description: t("how_it_works.steps.step1.desc"), icon: MousePointerClick, color: "bg-[#004A8D]" },
    { number: "02", title: t("how_it_works.steps.step2.title"), description: t("how_it_works.steps.step2.desc"), icon: SplitSquareVertical, color: "bg-[#82BC00]" },
    { number: "03", title: t("how_it_works.steps.step3.title"), description: t("how_it_works.steps.step3.desc"), icon: User, color: "bg-[#003566]" },
    { number: "04", title: t("how_it_works.steps.step4.title"), description: t("how_it_works.steps.step4.desc"), icon: Sparkles, color: "bg-[#689600]" },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // شريط التقدم الأفقي (للشاشات الكبيرة)
      gsap.fromTo(".timeline-progress-x", { scaleX: 0 }, {
        scaleX: 1, ease: "none", transformOrigin: isAr ? "right" : "left",
        scrollTrigger: { trigger: ".timeline-container", start: "top 75%", end: "bottom 60%", scrub: 0.6 }
      });

      // شريط التقدم العمودي (للموبايل)
      gsap.fromTo(".timeline-progress-y", { scaleY: 0 }, {
        scaleY: 1, ease: "none", transformOrigin: "top",
        scrollTrigger: { trigger: ".timeline-container", start: "top 70%", end: "bottom 40%", scrub: 0.6 }
      });

      gsap.utils.toArray(".step-item").forEach((item, i) => {
        gsap.fromTo(item, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 1, delay: i * 0.08, ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 88%", toggleActions: "play none none reverse" }
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isAr]);

  return (
    <section ref={sectionRef} className="relative py-28 bg-[#F9FAFB] w-screen left-1/2 -translate-x-1/2 overflow-hidden font-sans dark:bg-slate-950 transition-colors duration-500">

      {/* شبكة خطوط خلفية خفيفة */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.15] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#004A8D]/10 text-[#004A8D] mb-6 font-bold border border-[#004A8D]/20 dark:bg-slate-900/50 dark:text-blue-300 dark:border-blue-800">
            <Sparkles size={16} className="text-[#82BC00] fill-[#82BC00]" />
            <span>{t("how_it_works.badge")}</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-[1000] text-slate-900 leading-[1.05] tracking-tight dark:text-white">
            {t("how_it_works.title_part1")}
            <span className=" text-lime-500">
              {t("how_it_works.title_part2")}
            </span>
          </h2>

          <p className="text-lg text-slate-500 mt-6 font-medium max-w-xl mx-auto leading-relaxed dark:text-slate-400">
            {t("how_it_works.subtitle")}
          </p>
        </div>

        <div className="timeline-container relative">
          {/* الخط الأفقي المنقط + شريط التقدم (شاشات كبيرة) */}
          <div className="absolute top-8 inset-x-[12.5%] h-[2px] border-t-2 border-dashed border-slate-200 dark:border-slate-800 hidden lg:block" />
          <div className="timeline-progress-x absolute top-[31px] inset-x-[12.5%] h-1 rounded-full bg-gradient-to-r rtl:bg-gradient-to-l from-[#004A8D] to-[#82BC00] hidden lg:block" />

          {/* الخط العمودي (موبايل وتابلت) */}
          <div className="absolute top-0 bottom-0 start-8 w-[2px] border-s-2 border-dashed border-slate-200 dark:border-slate-800 lg:hidden" />
          <div className="timeline-progress-y absolute top-0 bottom-0 start-[31px] w-1 rounded-full bg-gradient-to-b from-[#004A8D] to-[#82BC00] lg:hidden" />

          <div className="grid lg:grid-cols-4 gap-10 lg:gap-6">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="step-item relative flex lg:flex-col items-start lg:items-center gap-6 lg:gap-10">

                  {/* عقدة الرقم على الخط الزمني */}
                  <div className="relative z-10 shrink-0">
                    <div className="size-16 rounded-full bg-white dark:bg-slate-900 border-4 border-[#F9FAFB] dark:border-slate-950 shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 flex items-center justify-center transition-colors">
                      <div className={`size-11 ${step.color} rounded-full flex items-center justify-center text-white font-black text-base`}>
                        {step.number}
                      </div>
                    </div>
                  </div>

                  <div className="w-full group relative flex-1">
                    {/* طبقة التوهج الأبيض (Halo) خلف الكرت */}
                    <div className="absolute inset-0 bg-white/5 dark:bg-white/10 blur-[30px] rounded-[2rem] opacity-0 dark:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    {/*هاي لون الكارد*/}
                    <div className={`relative h-full overflow-hidden bg-white/90 backdrop-blur-sm shadow-lime-300/40 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-[2rem] p-10 shadow-lg hover:shadow-2xl hover:shadow-lime-300/60 transition-all duration-500 hover:-translate-y-2
                      dark:shadow-[0_0_20px_rgba(130,188,0,0.25)] dark:hover:shadow-[0_0_35px_rgba(130,188,0,0.5)]
                      ${isAr ? "text-right" : "text-left"}`}>

                      {/* شريط لوني علوي يظهر عند التمرير */}
                      <span className={`absolute top-0 inset-x-0 h-1 ${step.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rtl:origin-right`} />

                      <span className={`absolute -top-1 ${isAr ? "left-4" : "right-4"} text-7xl font-black text-lime-500/15 group-hover:text-lime-500/30 transition-all duration-700 pointer-events-none select-none dark:text-lime-400/10`}>
                        {step.number}
                      </span>

                      <div className={`${step.color} size-14 rounded-2xl flex items-center justify-center text-white mb-7 shadow-lg ${isAr ? "-rotate-3" : "rotate-3"} group-hover:rotate-0 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon size={26} />
                      </div>

                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight uppercase">
                        <span className="text-[#82BC00]">#</span> {step.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
