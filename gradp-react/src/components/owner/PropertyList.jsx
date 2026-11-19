import React, { useState } from "react";
import {
  Search,
  Building2,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  X,
  LayoutGrid,
  List,
  Users,
} from "lucide-react";

export default function PropertyList({
  properties,
  isAr,
  t,
  openEdit,
  deleteProp,
  openAdd,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  const filteredProperties = properties
    .map((prop, originalIdx) => ({ prop, originalIdx }))
    .filter(({ prop }) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      const title = (prop.title || "").toLowerCase();
      const addr = (prop.address || prop.locationText || "").toLowerCase();
      const type = (prop.type || "").toLowerCase();
      return title.includes(q) || addr.includes(q) || type.includes(q);
    });

  const getTypeLabel = (type) => {
    const map = {
      Apartment: t("owner_dashboard.type_apartment"),
      Studio: t("owner_dashboard.type_studio"),
      "Shared Room": t("owner_dashboard.type_shared"),
      Villa: t("owner_dashboard.type_villa"),
    };
    return map[type] || type;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* ── رأس القائمة مع البحث والتبديل بين الشبكة والقائمة ── */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t("owner_dashboard.active_board")}
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#004A8D]/10 dark:bg-sky-500/15 text-[#004A8D] dark:text-sky-400">
            {properties.length}
          </span>
        </div>

        {properties.length > 0 && (
          <div className="flex items-center gap-2">
            {/* حقل البحث */}
            <div className="relative flex-1 sm:w-64">
              <Search
                size={15}
                className={`absolute ${
                  isAr ? "right-3" : "left-3"
                } top-1/2 -translate-y-1/2 text-slate-400`}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isAr ? "بحث في عقاراتي..." : "Search properties..."}
                className={`w-full ${
                  isAr ? "pr-9 pl-8" : "pl-9 pr-8"
                } py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 outline-none text-xs font-medium text-slate-900 dark:text-white focus:border-[#004A8D] dark:focus:border-[#82BC00] transition-colors`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className={`absolute ${
                    isAr ? "left-2.5" : "right-2.5"
                  } top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600`}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* أزرار تغيير طريقة العرض (بطاقات / قائمة) */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-[#004A8D] dark:text-[#82BC00] shadow-2xs"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title={isAr ? "عرض بطاقات" : "Grid view"}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-900 text-[#004A8D] dark:text-[#82BC00] shadow-2xs"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title={isAr ? "عرض قائمة" : "List view"}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── محتوى العقارات ── */}
      {properties.length === 0 ? (
        <div className="py-16 px-4 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center mx-auto text-slate-400">
            <Building2 size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("owner_dashboard.no_props")}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {t("owner_dashboard.start_adding")}
            </p>
          </div>
          {openAdd && (
            <button
              type="button"
              onClick={openAdd}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>{t("owner_dashboard.add_property")}</span>
            </button>
          )}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="py-12 px-4 text-center space-y-2">
          <p className="text-sm font-bold text-slate-500">
            {isAr ? "لا توجد نتائج مطابقة للبحث" : "No matching properties found"}
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="text-xs font-bold text-[#004A8D] dark:text-[#82BC00] hover:underline"
          >
            {isAr ? "مسح البحث" : "Clear search"}
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* ── العرض العصري على شكل بطاقات (Bento Card Grid) ── */
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map(({ prop, originalIdx }) => {
            const rawImg =
              prop.propertiesImage ||
              prop.properties_image ||
              prop.image ||
              (Array.isArray(prop.images) && prop.images[0]);
            const firstImg =
              typeof rawImg === "string" ? rawImg.split(",")[0] : null;

            return (
              <div
                key={prop.property_id || prop.id || originalIdx}
                className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60 hover:border-[#004A8D]/30 dark:hover:border-[#82BC00]/30 hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* صورة العقار العلوية مع الشارات */}
                <div className="relative h-40 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {firstImg ? (
                    <img
                      src={firstImg}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-slate-300 dark:text-slate-600">
                      <Building2 size={36} />
                    </div>
                  )}

                  {/* شارة نوع العقار */}
                  <span className="absolute top-3 start-3 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900/75 text-white backdrop-blur-xs">
                    {getTypeLabel(prop.type)}
                  </span>

                  {/* شارة السعر */}
                  <span className="absolute bottom-3 end-3 px-2.5 py-1 rounded-lg text-xs font-black bg-white/95 dark:bg-slate-900/95 text-[#004A8D] dark:text-[#82BC00] shadow-xs">
                    {prop.price} {prop.currency || "JOD"}
                  </span>
                </div>

                {/* تفاصيل العقار */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {prop.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 truncate">
                      <MapPin size={12} className="text-[#004A8D] dark:text-[#82BC00] shrink-0" />
                      <span className="truncate">{prop.address || prop.locationText || "—"}</span>
                    </p>

                    {(prop.listingType === "PerBed" || prop.listingType === "Hybrid") && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                        <Users size={12} />
                        <span>
                          {prop.currentOccupancy || 0}/{prop.capacity || 1}{" "}
                          {isAr ? "مشغول" : "Occupied"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* أزرار التعديل والحذف */}
                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(originalIdx)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#004A8D] hover:text-white dark:hover:bg-[#82BC00] dark:hover:text-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Pencil size={13} />
                      <span>{isAr ? "تعديل" : "Edit"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProp(originalIdx)}
                      className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title={isAr ? "حذف" : "Delete"}
                    >
                      <Trash2 size={13} />
                      <span>{isAr ? "حذف" : "Delete"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── العرض المدمج على شكل قائمة (List View) ── */
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredProperties.map(({ prop, originalIdx }) => {
            const rawImg =
              prop.propertiesImage ||
              prop.properties_image ||
              prop.image ||
              (Array.isArray(prop.images) && prop.images[0]);
            const firstImg =
              typeof rawImg === "string" ? rawImg.split(",")[0] : null;

            return (
              <div
                key={prop.property_id || prop.id || originalIdx}
                className="p-4 sm:px-6 flex items-center gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  {firstImg ? (
                    <img src={firstImg} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={22} />
                  )}
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {prop.title}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={11} /> {prop.address || prop.locationText || "—"}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {isAr ? "السعر" : "Price"}
                    </p>
                    <p className="text-sm font-black text-[#004A8D] dark:text-[#82BC00]">
                      {prop.price} {prop.currency || "JOD"}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {isAr ? "النوع / الإشغال" : "Type / Occupancy"}
                    </p>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {getTypeLabel(prop.type)}
                      {(prop.listingType === "PerBed" || prop.listingType === "Hybrid") && (
                        <span className="mx-1.5 text-emerald-600 dark:text-emerald-400">
                          ({prop.currentOccupancy || 0}/{prop.capacity || 1})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(originalIdx)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#004A8D] border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Pencil size={13} />
                    <span className="hidden sm:inline">{isAr ? "تعديل" : "Edit"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProp(originalIdx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
