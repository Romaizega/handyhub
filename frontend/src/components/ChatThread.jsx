import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import api from "../app/axios";

// Format timestamp to "HH:MM"
const fmtTime = ts =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Check if two timestamps are on the same day
const isSameDay = (a, b) => {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear()
      && da.getMonth() === db.getMonth()
      && da.getDate() === db.getDate();
};

//Human-readable day label (Today, Yesterday, or Date)
const humanDate = ts => {
  const d = new Date(ts), today = new Date(), yest = new Date();
  yest.setDate(yest.getDate() - 1);
  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yest)) return "Yesterday";
  return d.toLocaleDateString();
};


const ChatThread = ({
  currentProfileId,
  otherProfileId,
  otherDisplayName,
  otherAvatarUrl
}) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
 
  // Fetch chat messages with the other user
  const load = useCallback(async () => {
    if (!otherProfileId) return;
    try {
      setError("");
      setLoading(true);
      const { data } = await api.get(`/messages/direct?otherProfileId=${otherProfileId}`);
      setMessages(data.messages || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    }
  }, [otherProfileId]);

  // Load messages on mount and poll every 8 seconds
  useEffect(() => {
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, [load]);

   // Handle sending a new message
  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !otherProfileId) return;
    try {
      const { data } = await api.post("/messages/direct", {
        recipientId: otherProfileId,
        text: trimmed,
      });
      setMessages(prev => [...prev, data.message]);
      setText("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send message");
    }
  };
  // Group messages by day and merge bubbles by sender & short time diff
  const dayBuckets = useMemo(() => {
    if (!messages.length) return [];
    const arr = [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const days = [];
    let currentDay = null;

    arr.forEach(m => {
      if (!currentDay || !isSameDay(currentDay.date, m.timestamp)) {
        currentDay = { date: m.timestamp, groups: [] };
        days.push(currentDay);
      }
      const mine = String(m.sender_profile_id) === String(currentProfileId);
      const last = currentDay.groups[currentDay.groups.length - 1];
      const canMerge = last?.mine === mine
        && (new Date(m.timestamp) - new Date(last.lastTs) < 15 * 60 * 1000);

      if (canMerge) {
        last.items.push(m);
        last.lastTs = m.timestamp;
      } else {
        currentDay.groups.push({ mine, items: [m], lastTs: m.timestamp });
      }
    });

    return days;
  }, [messages, currentProfileId]);

  return (
    <div className="p-4 bg-white rounded border flex flex-col h-full">
      {/*  NEW HEADER  */}
      <div className="flex items-center mb-4">
        {otherAvatarUrl && (
          <img
            src={otherAvatarUrl}
            alt={otherDisplayName}
            className="w-8 h-8 rounded-full mr-3 object-cover"
          />
        )}
        <h2 className="text-lg font-semibold">
          Chat{otherDisplayName ? ` with ${otherDisplayName}` : ""}
        </h2>
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-3">
        {loading && <div className="text-gray-400">Loading…</div>}
        {!loading && !messages.length && (
          <div className="text-gray-400">No messages yet</div>
        )}

        {dayBuckets.map(day => (
          <div key={day.date} className="space-y-2">
            <div className="text-center text-xs text-gray-400">
              {humanDate(day.date)}
            </div>

            {day.groups.map((g, idx) => (
              <div
                key={idx}
                className={`flex w-full ${g.mine ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] space-y-1 ${g.mine ? "ml-auto" : ""}`}>
                  {g.items.map(m => (
                    <div
                      key={m.id}
                      className={`px-3 py-2 rounded-2xl break-words ${
                        g.mine
                          ? "bg-blue-600 text-white text-right"
                          : "bg-gray-200 text-gray-800 text-left"
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                  <div
                    className={`text-[10px] text-gray-500 ${
                      g.mine ? "text-right" : "text-left"
                    }`}
                  >
                    {fmtTime(g.items[g.items.length - 1].timestamp)}
                  </div>
                </div>
              </div>
            ))}
        </div>))}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          className="input input-bordered flex-1"
          placeholder="Write a message…"
        />
        <button onClick={handleSend} className="btn btn-primary">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatThread;
