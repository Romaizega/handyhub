import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import api from "../app/axios";

const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const isSameDay = (a, b) => {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() &&
         da.getMonth() === db.getMonth() &&
         da.getDate() === db.getDate();
};

const humanDate = (ts) => {
  const d = new Date(ts);
  const today = new Date();
  const yest = new Date(); yest.setDate(yest.getDate() - 1);
  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yest)) return "Yesterday";
  return d.toLocaleDateString();
};

const ChatThread = ({ currentProfileId, otherProfileId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  

  const load = useCallback(async () => {
    if (!otherProfileId) return;
    try {
      setError("");
      setLoading(true);
      const { data } = await api.get(
        `/messages/direct?otherProfileId=${otherProfileId}`
      );
      setMessages(data.messages || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    }
  }, [otherProfileId]);

  useEffect(() => {
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, [load]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !otherProfileId) return;
    try {
      const { data } = await api.post("/messages/direct", {
        recipientId: otherProfileId,
        text: trimmed,
      });
      setMessages((prev) => [...prev, data.message]);
      setText("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send message");
    }
  };

  const dayBuckets = useMemo(() => {
    if (!messages.length) return [];
    const arr = [...messages].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    const days = [];
    let currentDay = null;

    for (const m of arr) {
      if (!currentDay || !isSameDay(currentDay.date, m.timestamp)) {
        currentDay = { date: m.timestamp, groups: [] };
        days.push(currentDay);
      }
      const mine = m.sender_profile_id === currentProfileId;
      const lastGroup = currentDay.groups[currentDay.groups.length - 1];

      const canMerge =
        lastGroup &&
        lastGroup.mine === mine &&
        new Date(m.timestamp) - new Date(lastGroup.lastTs) < 15 * 60 * 1000;

      if (canMerge) {
        lastGroup.items.push(m);
        lastGroup.lastTs = m.timestamp;
      } else {
        currentDay.groups.push({
          mine,
          items: [m],
          lastTs: m.timestamp,
        });
      }
    }
    return days;
  }, [messages, currentProfileId]);

  return (
    <div className="p-4 bg-white rounded border flex flex-col gap-3 min-h-[360px]">
      <h2 className="text-lg font-semibold">Chat</h2>

      {error && <div className="text-red-500">{error}</div>}

      <div className="flex-1 overflow-y-auto space-y-4 max-h-[55vh] pr-1">
        {loading && <div className="text-gray-400">Loading…</div>}
        {!loading && messages.length === 0 && (
          <div className="text-gray-400">No messages yet</div>
        )}

        {!loading &&
          dayBuckets.map((day) => (
            <div key={day.date} className="space-y-2">
              <div className="text-center text-xs text-gray-400">
                {humanDate(day.date)}
              </div>

              {day.groups.map((g, gi) => (
                <div
                  key={gi}
                  className={`flex w-full ${g.mine ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] space-y-1`}>
                    {g.items.map((m, mi) => (
                      <div
                        key={m.id}
                        className={`px-3 py-2 rounded-2xl break-words ${
                          g.mine
                            ? "bg-primary text-primary-content"
                            : "bg-base-200 text-base-content"
                        } ${g.mine
                          ? mi === 0
                            ? "rounded-tr-md"
                            : ""
                          : mi === 0
                          ? "rounded-tl-md"
                          : ""}`}
                      >
                        {m.text}
                      </div>
                    ))}
                    <div className={`text-[10px] text-gray-400 ${g.mine ? "text-right" : "text-left"}`}>
                      {fmtTime(g.items[g.items.length - 1].timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
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

export default ChatThread