import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, RefreshCw, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { STATUS } from "../../../data/roommates";
import RoommateCard from "./roommate/RoommateCard";
import SuggestionCard from "./roommate/SuggestionCard";
import MatchedProfileView from "./roommate/MatchedProfileView";
import api from "../../../utils/api";

function Tab({ active, onClick, children, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${active
          ? "!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white shadow-2xs"
          : "!bg-transparent !text-slate-500 dark:!text-slate-400 hover:!text-slate-800 dark:hover:!text-slate-200"
        }`}
    >
      <span>{children}</span>
      {badge > 0 && (
        <span className="px-1.5 py-0.5 rounded-full bg-[#82BC00] text-slate-950 text-[10px] font-bold leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}

function EmptyRequests({ t }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-14 px-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 text-center space-y-2.5"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
        <Users size={22} />
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
        {t("roommate_matching.request.no_requests")}
      </p>
    </motion.div>
  );
}

export default function RoommateView({ viewportVariants }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [suggestions, setSuggestions] = useState([]);
  const [fetchingMatches, setFetchingMatches] = useState(false);

  const [dbAcceptedRoommate, setDbAcceptedRoommate] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(true);

  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("suggestions");

  const fetchRoommateMatches = async (currentPartnerId = null) => {
    setFetchingMatches(true);
    try {
      const response = await api.post("/ai/match-roommates");
      if (response.success && response.data) {
        const matchId = currentPartnerId ?? dbAcceptedRoommate?.id;
        const filtered = matchId
          ? response.data.filter((item) => item.id !== matchId)
          : response.data;
        setSuggestions(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch roommate matches:", err);
    } finally {
      setFetchingMatches(false);
    }
  };

  const fetchRoommateRequests = async () => {
    try {
      const response = await api.get("/ai/roommate-requests");
      if (response.success && response.data) {
        setRequests(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch roommate requests:", err);
    }
  };

  useEffect(() => {
    const initRoommateData = async () => {
      try {
        const response = await api.get("/ai/roommate-match");
        if (response.success && response.data) {
          setDbAcceptedRoommate(response.data);
        } else {
          setDbAcceptedRoommate(null);
          fetchRoommateMatches(null);
        }
      } catch (err) {
        console.error("Failed to fetch database roommate match:", err);
        fetchRoommateMatches(null);
      } finally {
        setLoadingMatch(false);
      }
    };
    initRoommateData();
    fetchRoommateRequests();
  }, []);

  useEffect(() => {
    if (activeTab === "requests") {
      fetchRoommateRequests();
    }
  }, [activeTab]);

  const pendingCount = requests.filter((r) => r.status === STATUS.PENDING).length;

  const handlePair = async (person) => {
    if (dbAcceptedRoommate) return;
    if (requests.find((r) => r.id === person.id)) return;
    try {
      const response = await api.post("/ai/roommate-request/send", {
        receiverId: person.id
      });
      if (response.success) {
        await fetchRoommateRequests();
        setActiveTab("requests");
      }
    } catch (err) {
      console.error("Failed to send roommate request:", err);
    }
  };

  const handleAccept = async (id) => {
    if (dbAcceptedRoommate) return;
    const person = requests.find((r) => r.id === id);
    if (!person) return;

    try {
      const response = await api.post("/ai/roommate-request/accept", {
        senderId: id
      });
      if (response.success) {
        setDbAcceptedRoommate(person);
        await fetchRoommateRequests();
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to accept roommate request:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await api.post("/ai/roommate-request/reject", {
        senderId: id
      });
      if (response.success) {
        await fetchRoommateRequests();
      }
    } catch (err) {
      console.error("Failed to reject roommate request:", err);
    }
  };

  const handleCancel = async (id) => {
    try {
      const response = await api.post("/ai/roommate-request/cancel", {
        receiverId: id
      });
      if (response.success) {
        await fetchRoommateRequests();
      }
    } catch (err) {
      console.error("Failed to cancel roommate request:", err);
    }
  };

  const handleUnmatch = async () => {
    const partnerId = dbAcceptedRoommate?.id;
    if (!partnerId) return;

    try {
      const response = await api.post("/ai/unpair-roommate", { partnerId });
      if (response.success) {
        setDbAcceptedRoommate(null);
        setRequests([]);
        fetchRoommateMatches(null);
      }
    } catch (err) {
      console.error("Failed to unpair roommates in database:", err);
    }
  };

  if (loadingMatch) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#004A8D] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
          {isAr ? "جاري تحميل بيانات شريك السكن..." : "Loading roommate information..."}
        </p>
      </div>
    );
  }

  if (dbAcceptedRoommate) {
    return (
      <MatchedProfileView
        roommate={dbAcceptedRoommate}
        onUnmatch={handleUnmatch}
        viewportVariants={viewportVariants}
        isAr={isAr}
      />
    );
  }

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
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t("roommate_matching.title")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t("roommate_matching.subtitle")}
            </p>
          </div>
        </div>

        {/* التبويبات وزر التحديث */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <Tab
              active={activeTab === "suggestions"}
              onClick={() => setActiveTab("suggestions")}
            >
              {t("roommate_matching.tabs.suggestions")}
            </Tab>
            <Tab
              active={activeTab === "requests"}
              onClick={() => setActiveTab("requests")}
              badge={pendingCount}
            >
              {t("roommate_matching.tabs.requests")}
            </Tab>
          </div>

          {activeTab === "suggestions" && (
            <button
              type="button"
              onClick={() => fetchRoommateMatches()}
              disabled={fetchingMatches}
              title={isAr ? "تحديث الاقتراحات" : "Refresh suggestions"}
              className="p-2.5 rounded-xl border !border-slate-200 dark:!border-slate-700 !bg-white dark:!bg-slate-800 !text-slate-600 dark:!text-slate-300 hover:!bg-slate-50 dark:hover:!bg-slate-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={15} className={fetchingMatches ? "animate-spin" : ""} />
            </button>
          )}
        </div>
      </div>

      {/* محتوى التبويب المختار */}
      <AnimatePresence mode="wait">
        {activeTab === "suggestions" && (
          <motion.div
            key="sug"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {fetchingMatches ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-8 h-8 border-3 border-[#004A8D] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {isAr
                    ? "جاري تحليل التفضيلات وإيجاد أفضل الشركاء المتوافقين..."
                    : "Finding the most compatible roommates based on your lifestyle..."}
                </p>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <SlidersHorizontal size={20} />
                </div>
                <div className="max-w-sm space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {isAr
                      ? "لا توجد اقتراحات مطابقة حالياً"
                      : "No Compatible Suggestions Yet"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isAr
                      ? "تأكد من تحديث عاداتك وتفضيلات شريك السكن في قسم الإعدادات لتحسين نتائج المطابقة."
                      : "Make sure your lifestyle habits and roommate preferences are updated in Settings for accurate matching."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fetchRoommateMatches()}
                  className="px-4 py-2 rounded-xl !bg-[#004A8D] hover:!bg-[#003a70] !text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  {t("roommate_matching.find_matches_btn")}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((p) => (
                  <SuggestionCard
                    key={p.id}
                    data={p}
                    onPair={handlePair}
                    alreadySent={!!requests.find((r) => r.id === p.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "requests" && (
          <motion.div
            key="req"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {requests.length === 0 ? (
              <EmptyRequests t={t} />
            ) : (
              requests.map((req) => (
                <RoommateCard
                  key={req.id}
                  data={req}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onCancel={handleCancel}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
