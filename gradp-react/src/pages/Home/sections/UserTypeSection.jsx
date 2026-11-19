/* 
 * مكون UserTypeSection الخاص بواجهة المستخدم.
 */
import { GraduationCap, ArrowRight, Sparkles, Building2, MapPin, ShieldCheck, Wallet, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Card, CardContent } from "../../../components/ui/Card";

export function UserTypeSection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAr = i18n.language === "ar";
  const handleStudentClick = () => {
    navigate("/student");
  };

  const handleOwnerClick = () => {
    navigate("/owner-login");
  };

  const cards = [
    {
      id: "student",
      title: t("user_type.student.title"),
      desc: t("user_type.student.desc"),
      color: "bg-[#004A8D]",
      num: "01",
      icon: <GraduationCap className="size-9 text-white" />,
      btn: t("user_type.student.btn"),
      btnClasses: "bg-[#004A8D]! hover:bg-[#003566]! shadow-[#004A8D]/25",
      iconColor: "text-[#004A8D] dark:text-[#3b82f6]",
      iconBg: "bg-[#004A8D]/10 dark:bg-[#3b82f6]/15",
      headerGlow: "from-[#004A8D]/15 via-[#3b82f6]/5 to-transparent",
      glowGradient: "before:bg-[conic-gradient(from_0deg,transparent_25%,#3b82f6_50%,transparent_75%,#004A8D_100%)]",
      features: [
        { text: t("user_type.student.f1"), icon: <MapPin className="size-5" /> },
        { text: t("user_type.student.f2"), icon: <Zap className="size-5" /> },
        { text: t("user_type.student.f3"), icon: <ShieldCheck className="size-5" /> },
        { text: t("user_type.student.f4"), icon: <Sparkles className="size-5" /> }
      ]
    },
    {
      id: "owner",
      title: t("user_type.owner.title"),
      desc: t("user_type.owner.desc"),
      color: "bg-[#82BC00]",
      num: "02",
      icon: <Building2 className="size-9 text-white" />,
      btn: t("user_type.owner.btn"),
      btnClasses: "bg-[#82BC00]! hover:bg-[#689600]! shadow-[#82BC00]/25",
      iconColor: "text-[#82BC00]",
      iconBg: "bg-[#82BC00]/10 dark:bg-[#82BC00]/15",
      headerGlow: "from-[#82BC00]/20 via-[#bef264]/5 to-transparent",
      glowGradient: "before:bg-[conic-gradient(from_0deg,transparent_25%,#bef264_50%,transparent_75%,#82BC00_100%)]",
      features: [
        { text: t("user_type.owner.f1"), icon: <Wallet className="size-5" /> },
        { text: t("user_type.owner.f2"), icon: <Sparkles className="size-5" /> },
        { text: t("user_type.owner.f3"), icon: <Zap className="size-5" /> },
        { text: t("user_type.owner.f4"), icon: <ShieldCheck className="size-5" /> },
      ]
    }
  ];

  return (
    <section className="relative bg-[#F9FAFB] pt-16 pb-32 w-screen left-1/2 -translate-x-1/2 overflow-hidden font-sans dark:bg-slate-950 transition-colors duration-500" >

      {/* دوائر الإضاءة خلف البطاقات */}
      <div className="absolute top-1/2 start-[10%] w-[28rem] h-[28rem] bg-[#004A8D]/10 dark:bg-[#004A8D]/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 end-[10%] w-[28rem] h-[28rem] bg-[#82BC00]/10 dark:bg-[#82BC00]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="text-center mb-20 max-w-3xl mx-auto">
          <Badge className="mb-6 mx-auto px-5 py-2 bg-white! border-slate-200! dark:bg-slate-900! dark:border-slate-800!">
            <Sparkles size={16} className="fill-[#82BC00] text-[#82BC00]" />
            <span className="text-slate-700 dark:text-slate-300 tracking-widest">{t("user_type.badge")}</span>
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6 dark:text-white">
            {t("user_type.title_part1")}
            <span className="text-lime-500 uppercase dark:text-[#82BC00]">{t("user_type.title_part2")}</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed dark:text-slate-400">
            {t("user_type.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto scroll-mt-28" id="user-paths" >
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`group relative p-0 gap-0! transition-all duration-500 hover:-translate-y-2 rounded-[2.5rem]! border-none! shadow-xl shadow-slate-200/60
          bg-white dark:bg-slate-900 dark:shadow-[0_0_30px_rgba(255,255,255,0.05)]
          dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] hover:shadow-2xl
          ${isAr ? "text-right" : "text-left"}
          overflow-hidden isolate
          before:absolute before:inset-[-200%] before:-z-20 ${card.glowGradient}
          before:animate-[spin_5s_linear_infinite] before:opacity-40 group-hover:before:opacity-100 before:transition-opacity before:duration-500
          after:absolute after:inset-0.5 after:-z-10 after:bg-white dark:after:bg-slate-900 after:rounded-[calc(2.5rem-2px)]
          `}
            >
              {/* التوهج الخلفي (Blur) */}
              <div className="absolute inset-0 bg-white/5 blur-2xl rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden dark:block z-0" />

              {/* تدرج لوني علوي خاص بكل بطاقة */}
              <div className={`absolute top-0.5 inset-x-0.5 h-52 rounded-t-[calc(2.5rem-2px)] bg-gradient-to-b ${card.headerGlow} pointer-events-none z-0`} />

              <span className={`
  absolute top-6 ${isAr ? 'left-8' : 'right-8'} 
  text-8xl font-black z-10 select-none pointer-events-none
  ${isAr ? "text-right" : "text-left"}

          {اللون تبع اللوان}
  bg-gradient-to-br from-[#3b82f6] to-[#70e000] 
  bg-clip-text text-transparent
          {هذا توهج الي ورا الرقم}
  drop-shadow-[0_0_15px_rgba(59,130,246,0.35)]
          {وضوج الالوان }
  opacity-25 dark:opacity-20 
  group-hover:opacity-60 transition-opacity duration-500
`}>
                {card.num}
              </span>

              <CardContent className="p-8 md:p-10 relative z-20 flex flex-col h-full">
                <div className={`${card.color} w-18 h-18 rounded-[1.5rem] flex items-center justify-center shadow-xl mb-8 ring-8 ring-white/70 dark:ring-slate-800/60 transform ${isAr ? "-rotate-3" : "rotate-3"} group-hover:rotate-0 group-hover:scale-105 transition-transform duration-500`}>
                  {card.icon}
                </div>

                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">
                  {card.title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 font-medium leading-relaxed min-h-[3.5rem] line-clamp-2">
                  {card.desc}
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-10">
                  {card.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5">
                      <div className={`shrink-0 flex items-center justify-center size-9 rounded-xl ${card.iconBg} ${card.iconColor}`}>{feature.icon}</div>
                      <span className="text-slate-700 dark:text-slate-200 font-bold text-sm leading-snug">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => {
                    if (card.id === "student") {
                      handleStudentClick();
                    } else if (card.id === "owner") {
                      handleOwnerClick();
                    }
                  }}
                  className={`group/btn mt-auto w-full h-16! text-lg rounded-2xl! text-white! font-[1000] gap-3 shadow-xl transition-all transform active:scale-[0.98] ${card.btnClasses}`}
                >
                  {card.btn}
                  <span className="flex items-center justify-center size-9 rounded-xl bg-white/20 transition-colors group-hover/btn:bg-white/30">
                    <ArrowRight size={18} className={`transition-transform duration-300 ${isAr ? "rotate-180 group-hover/btn:-translate-x-1" : "group-hover/btn:translate-x-1"}`} />
                  </span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
