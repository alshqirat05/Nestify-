import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Compass } from "lucide-react";
import PropertyCard from "../../property/PropertyCard";
import api from "../../../utils/api";

export default function FavoritesView({ isAr, viewportVariants }) {
  const [favorites, setFavorites] = useState([]);

  const loadFavoritesFromApi = async () => {
    try {
      const response = await api.get("/favorites");
      const data =
        response && response.success && Array.isArray(response.data)
          ? response.data
          : [];
      setFavorites(data);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.user_id;
      if (userId) {
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(data));
      }
    } catch (_) {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.id || user.user_id;
        if (userId) {
          const favs = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
          setFavorites(Array.isArray(favs) ? favs : []);
        } else {
          setFavorites([]);
        }
      } catch (err) {
        setFavorites([]);
      }
    }
  };

  const syncFromCache = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.user_id;
      if (userId) {
        const favs = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
        setFavorites(Array.isArray(favs) ? favs : []);
      }
    } catch (_) { }
  };

  useEffect(() => {
    loadFavoritesFromApi();
    window.addEventListener("favoritesUpdate", syncFromCache);
    return () => window.removeEventListener("favoritesUpdate", syncFromCache);
  }, []);

  if (favorites.length === 0) {
    return (
      <motion.div
        key="favorites-empty"
        variants={viewportVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center justify-center py-16 text-center space-y-5"
      >
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
          <Heart size={28} />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isAr ? "قائمة السكنات المفضلة فارغة" : "No Saved Properties Yet"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm leading-relaxed">
            {isAr
              ? "ابدأ بتصفح السكنات الطلابية واضغط على أيقونة القلب لحفظ الخيارات التي تعجبك والعودة إليها لاحقاً."
              : "Browse student housing and tap the heart icon on any listing to save it here for quick comparison."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => (window.location.href = "/student")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white font-semibold shadow-xs transition-all text-sm cursor-pointer"
        >
          <Compass size={16} className="text-[#a3e635]" />
          <span>{isAr ? "تصفح المساكن الآن" : "Browse Housing Now"}</span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="favorites"
      variants={viewportVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 text-start"
    >
      {/* ترويسة الصفحة */}
      <div className="flex items-center justify-between !w-screen gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#004A8D]/10 dark:bg-sky-500/10 flex items-center justify-center text-[#004A8D] dark:text-sky-400 shrink-0">
            <Heart size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {isAr ? "السكنات المفضلة" : "Saved Properties"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {isAr
                ? `لديك ${favorites.length} مسكن محفوظ في قائمتك`
                : `You have ${favorites.length} saved listings`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => (window.location.href = "/student")}
          className="px-3.5 py-2 rounded-xl !bg-slate-100 hover:!bg-slate-200/80 dark:!bg-slate-800 dark:hover:!bg-slate-700 !text-slate-700 dark:!text-slate-200 text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          {isAr ? "تصفح المزيد" : "Explore More"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {favorites.filter(Boolean).map((property) => (
          <PropertyCard key={property.id || property} property={property} />
        ))}
      </div>
    </motion.div>
  );
}
