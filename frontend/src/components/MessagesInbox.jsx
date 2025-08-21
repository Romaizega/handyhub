import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import api from "../app/axios";
import ChatThread from "../components/ChatThread";

const MessagesInbox = () => {
  const navigate = useNavigate();
  const { id: routeOtherId } = useParams();         
  const { user } = useSelector((s) => s.auth);
  const currentProfileId = user?.profile?.id;

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOtherId, setSelectedOtherId] = useState(null);

  useEffect(() => {
    if (!user) {
      setError("Please login to view messages.");
      setLoading(false);
      return;
    }
    let ignore = false;
    const load = async () => {
      try {
        const { data } = await api.get("/messages/threads");
        if (ignore) return;
        const items = data.threads || [];
        setThreads(items);

        if (routeOtherId) {
          setSelectedOtherId(Number(routeOtherId));     
        } else {
          const first = items.find(t => t.other_profile_id !== currentProfileId);
          setSelectedOtherId(first ? first.other_profile_id : null);
        }
      } catch (e) {
        if (!ignore) setError(e.response?.data?.message || "Failed to load threads");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [user, currentProfileId, routeOtherId]);

  useEffect(() => {
    if (routeOtherId) setSelectedOtherId(Number(routeOtherId));
  }, [routeOtherId]);

  const visibleThreads = useMemo(
    () => threads.filter(t => t.other_profile_id !== currentProfileId),
    [threads, currentProfileId]
  );

  const openThread = (otherId) => {
    setSelectedOtherId(otherId);
    navigate(`/messages/${otherId}`, { replace: false }); 
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">You need to login to view your messages.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      {error && <div className="text-red-500 mb-3">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sidebar */}
        <aside className="md:col-span-1 border rounded-lg bg-white">
          <div className="p-3 border-b font-semibold">Dialogs</div>
          <ul className="max-h-[70vh] overflow-y-auto divide-y">
            {loading && <li className="p-3 text-gray-400">Loading…</li>}
            {!loading && visibleThreads.length === 0 && (
              <li className="p-3 text-gray-400">No dialogs yet</li>
            )}
            {visibleThreads.map((t) => {
              const active = selectedOtherId === t.other_profile_id;
              return (
                <li
                  key={`${t.other_profile_id}-${t.id}`}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${active ? "bg-indigo-50" : ""}`}
                  onClick={() => openThread(t.other_profile_id)}
                  onKeyDown={(e) => e.key === "Enter" && openThread(t.other_profile_id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    {t.other_avatar_url && (
                      <img src={t.other_avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {t.other_display_name || `User #${t.other_profile_id}`}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{t.text}</div>
                    </div>
                    <div className="ml-auto text-[10px] text-gray-400">
                      {new Date(t.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Chat */}
        <main className="md:col-span-2">
          {selectedOtherId ? (
            <ChatThread
              key={selectedOtherId}
              currentProfileId={currentProfileId}
              otherProfileId={selectedOtherId}
            />
          ) : (
            <div className="p-6 border rounded-lg bg-white text-gray-500">
              Select a dialog to start chatting
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MessagesInbox;
