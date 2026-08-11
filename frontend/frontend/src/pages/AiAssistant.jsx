import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./AiAssistant.css";

function AiAssistant() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your IT assistant. Ask me anything before opening a support ticket — I might be able to help right away." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost/InternShip/backend/ai_chat.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply || "Sorry, something went wrong." }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="ai-page">
        <div className="ai-card">
          <div className="ai-header">
            <Sparkles size={18} />
            <h2>AI IT Assistant</h2>
          </div>

          <div className="ai-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-bubble-row ${m.role}`}>
                {m.role === "ai" && <div className="ai-avatar"><Sparkles size={14} /></div>}
                <div className={`ai-bubble ${m.role}`}>{m.text}</div>
                {m.role === "user" && <div className="ai-avatar user"><User size={14} /></div>}
              </div>
            ))}
            {loading && (
              <div className="ai-bubble-row ai">
                <div className="ai-avatar"><Sparkles size={14} /></div>
                <div className="ai-bubble ai ai-typing">Typing...</div>
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>

          <form onSubmit={sendMessage} className="ai-input-row">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              <Send size={16} />
            </button>
          </form>

          <p className="ai-footer-note">
            Still need help? <Link to="/create-ticket">Create a support ticket</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default AiAssistant;