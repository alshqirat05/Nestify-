/* 
* مكون HeroSection الخاص بواجهة المستخدم.
*/
import React, { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, MapPin, Sparkles, CheckCircle, ShieldCheck } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/Button";
import AboutUsModal from "../../../components/modals/AboutUsModal";
import heroImg from "../../../assets/imgs/hero_building.jpg";

export function HeroSection() {
  const { t, i18n } = useTranslation();
  const heroRef = useRef(null);
  const isAr = i18n.language === "ar";
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-content > *", { opacity: 0, y: 30, stagger: 0.12, duration: 1 })
        .from(".hero-image-wrapper", { opacity: 0, scale: 0.94, duration: 1.2 }, "-=0.8")
        .from(".hero-chip", { opacity: 0, y: 20, scale: 0.9, stagger: 0.15, duration: 0.8 }, "-=0.6")
        .from(".stat-item", { opacity: 0, y: 10, stagger: 0.1, duration: 0.8 }, "-=0.6");

      gsap.to(".hero-float", {
        y: -14,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.6
      });
    }, heroRef);
    return () => ctx.revert();
  }, [isAr]);

  const scrollToPath = () => {
    const element = document.getElementById("user-paths");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center bg-[#F9FAFB] dark:bg-slate-950 overflow-hidden pt-32 pb-20 font-sans transition-colors duration-500">

      {/* نافذة القوانين والسياسات (About Us) */}
      <AnimatePresence>
        {isAboutOpen && (
          <AboutUsModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        )}
      </AnimatePresence>

      {/* نمط الخلفية المنقطة */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{ backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

      {/* دوائر الإضاءة الملونة في الخلفية */}
      <div className="absolute -top-40 -start-40 w-[38rem] h-[38rem] bg-[#004A8D]/15 dark:bg-[#004A8D]/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -end-20 w-[32rem] h-[32rem] bg-[#82BC00]/15 dark:bg-[#82BC00]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 w-full h-full">
        {/* شبكة التقسيم الرئيسية بين النص والصورة */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">

          {/* القسم النصي والأزرار */}
          <div className="hero-content flex flex-col items-center lg:items-start text-center lg:text-start gap-7">

            {/* شارة التميز (Badge) */}
            <div className="inline-flex items-center gap-2.5 ps-1.5 pe-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="flex items-center justify-center size-7 rounded-full bg-[#004A8D] text-white">
                <Sparkles size={14} className="text-[#82BC00] fill-[#82BC00]" />
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200">
                {t('hero.badge')}
              </span>
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#82BC00] opacity-75 animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-[#82BC00]" />
              </span>
            </div>

            {/* العنوان الرئيسي الكبير */}
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-[1000] leading-[1.05] tracking-tight text-slate-900 dark:text-white">
              {t('hero.welcome')} <br />
              <span className="bg-gradient-to-r from-blue-800 via-blue-600 to-lime-500 bg-clip-text text-transparent font-black italic pe-2
                 dark:bg-none dark:text-[#82BC00] dark:drop-shadow-[0_0_20px_rgba(130,188,0,0.45)]
                 transition-all duration-500">NESTIFY.</span>
            </h1>

            {/* النص الوصفي تحت العنوان */}
            <p className="hero-p text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
              {t('hero.description')}
            </p>

            {/* أزرار التفاعل (Get Started & About Us) */}
            <div className="hero-btns flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <Button
                onClick={scrollToPath}
                variant="primary"
                size="lg"
                className="group h-14 px-8 text-lg !rounded-2xl !bg-[#004A8D] text-white hover:!bg-[#003566] shadow-xl shadow-[#004A8D]/25 hover:shadow-[#004A8D]/40 hover:-translate-y-0.5 gap-3"
              >
                {t('hero.get_started')}
                <span className="flex items-center justify-center size-8 rounded-xl bg-white/15 group-hover:bg-[#82BC00] transition-colors">
                  <ArrowRight size={18} className={`transition-transform duration-300 ${isAr ? "rotate-180 group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
                </span>
              </Button>

              <Button
                onClick={() => setIsAboutOpen(true)}
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg !rounded-2xl !bg-white/70 dark:!bg-slate-900/60 backdrop-blur-md !border !border-slate-200 dark:!border-slate-800 !text-slate-900 dark:!text-white hover:!border-[#004A8D]/40 hover:-translate-y-0.5"
              >
                {t('hero.about_us')}
              </Button>
            </div>

            {/* قسم الإحصائيات والأرقام */}
            <div className="mt-4 inline-flex items-center divide-x rtl:divide-x-reverse divide-slate-200 dark:divide-slate-800 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="stat-item px-6 py-4 text-center lg:text-start">
                <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">+150</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Student</p>
              </div>
              <div className="stat-item px-6 py-4 text-center lg:text-start">
                <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">+50</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Properties</p>
              </div>
              <div className="stat-item px-6 py-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle size={22} />
                <p className="text-xs font-bold uppercase tracking-widest">Trusted</p>
              </div>
            </div>
          </div>

          {/* القسم الجمالي للصورة المتحركة */}
          <div className="hero-image-wrapper relative hidden lg:block">
            {/* الخلفية الملونة تحت الصورة */}
            <div className={`absolute -inset-4 bg-gradient-to-br from-[#004A8D]/20 via-transparent to-[#82BC00]/25 rounded-[3.5rem] blur-2xl`} />
            <div className={`absolute inset-0 border-2 border-dashed border-[#004A8D]/15 dark:border-[#82BC00]/15 rounded-[3rem] transform ${isAr ? 'rotate-3' : '-rotate-3'}`} />

            <div className="relative z-10 rounded-[3rem] overflow-hidden p-2.5 bg-white dark:bg-slate-900 shadow-2xl shadow-[#004A8D]/15 ring-1 ring-slate-200/70 dark:ring-slate-800 transition-colors duration-500">
              <div className="relative rounded-[2.5rem] overflow-hidden">
                <img
                  src={heroImg}
                  alt="Ma'an Student Housing"
                  className="w-full h-[540px] object-cover scale-105 hover:scale-100 transition-transform duration-[1500ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

                {/* البطاقة العائمة فوق الصورة */}
                <div className="absolute bottom-5 start-5 end-5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-5 rounded-3xl border border-white/60 dark:border-slate-700/60 shadow-xl flex justify-between items-center transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#004A8D] rounded-2xl text-[#82BC00] shadow-lg shadow-[#004A8D]/30">
                      <MapPin size={22} />
                    </div>
                    <div className="text-start">
                      <p className="font-black text-slate-900 dark:text-white">Al Hussein University</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">2 Mins Distance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#82BC00]/15 text-[#5f8a00] dark:text-[#82BC00] px-3.5 py-2 rounded-xl text-xs font-black uppercase">
                    <span className="size-1.5 rounded-full bg-[#82BC00] animate-pulse" />
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* شرائح عائمة جانبية (Floating Chips) */}
            <div className="hero-chip absolute top-10 -start-10 z-20">
              <div className="hero-float flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl ps-3 pe-5 py-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xl">
                <div className="p-2 rounded-xl bg-[#82BC00] text-white">
                  <ShieldCheck size={18} />
                </div>
                <div className="text-start">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('hero.floating.trust')}</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{t('hero.floating.verified')}</p>
                </div>
              </div>
            </div>

            <div className="hero-chip absolute top-1/2 -end-8 z-20">
              <div className="hero-float flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl ps-3 pe-5 py-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xl">
                <div className="p-2 rounded-xl bg-[#004A8D] text-white">
                  <Sparkles size={18} className="text-[#82BC00]" />
                </div>
                <div className="text-start">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('hero.floating.availability')}</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{t('hero.floating.location')}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
