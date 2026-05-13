import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot } from "lucide-react";
import axios from "axios";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi 👋 I'm your Easy Colonizer Assistant. How can I help you today?",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");

  const [step, setStep] = useState("asking");

  const [leadData, setLeadData] = useState({
    name: "",
    phone: "",
  });

  const scrollRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const rawInput = input.trim();

    const userMessage = {
      id: Date.now(),
      text: rawInput,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    const userInput = rawInput.toLowerCase();

    setInput("");

    setTimeout(async () => {
      let botResponse = "";

      // NAME STEP
      if (step === "getting_name") {
        setLeadData((prev) => ({
          ...prev,
          name: rawInput,
        }));

        botResponse = `Thanks ${rawInput} 😊 Please enter your 10-digit mobile number.`;

        setStep("getting_phone");
      }

      // PHONE STEP
      else if (step === "getting_phone") {
        if (!/^[6-9]\d{9}$/.test(rawInput)) {
          botResponse =
            "Please enter a valid 10-digit Indian mobile number.";
        } else {
          const updatedLead = {
            ...leadData,
            phone: rawInput,
          };

          setLeadData(updatedLead);

          botResponse =
            "✅ Great! Our property expert will contact you shortly.";

          setStep("asking");

          // Save Lead
          try {
            await axios.post("/api/leads", {
              name: updatedLead.name,
              phone: updatedLead.phone,
              message: "Captured via AI Chatbot",
              source: "Chatbot",
            });
          } catch (err) {
            console.error("Error saving chatbot lead:", err);
          }
        }
      }

      // NORMAL CHAT
      else {
        if (
          userInput.includes("price") ||
          userInput.includes("budget") ||
          userInput.includes("cost")
        ) {
          botResponse =
            "🏡 Our properties start from ₹25 Lakhs and go up to ₹2 Crores.";
        } else if (
          userInput.includes("location") ||
          userInput.includes("area") ||
          userInput.includes("where")
        ) {
          botResponse =
            "📍 We have projects in Kolar Road, Arera Colony & Misrod, Bhopal.";
        } else if (
          userInput.includes("plot") ||
          userInput.includes("villa") ||
          userInput.includes("flat")
        ) {
          botResponse =
            "🏠 We offer premium plots, luxury villas & modern apartments.";
        } else if (
          userInput.includes("contact") ||
          userInput.includes("call") ||
          userInput.includes("visit") ||
          userInput.includes("interested")
        ) {
          botResponse =
            "Awesome 😊 Please share your full name.";

          setStep("getting_name");
        } else {
          botResponse =
            "I can help you with plots, villas, pricing, locations & site visits.";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: botResponse,
          sender: "bot",
        },
      ]);
    }, 700);
  };

  return (
    <div className="chatbot-wrapper">
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="chatbot-card">
          {/* HEADER */}
          <div className="chatbot-header">
            <div className="d-flex align-items-center gap-2">
              <div className="chatbot-avatar">
                <Bot size={18} />
              </div>

              <div>
                <h6 className="mb-0 fw-bold">Easy Colonizer</h6>
                <small className="opacity-75">Online</small>
              </div>
            </div>

            <button
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* BODY */}
          <div className="chatbot-body" ref={scrollRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-message-row ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                <div
                  className={`chatbot-message ${
                    msg.sender === "user"
                      ? "user-message"
                      : "bot-message"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <form className="chatbot-footer" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chatbot-input"
            />

            <button type="submit" className="chatbot-send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* TOGGLE BUTTON */}
      <button
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default ChatBot;