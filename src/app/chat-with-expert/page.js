"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Layout from "@/components/Layout";
import { Send } from "lucide-react";

let socket;

export default function ChatWithExpert() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState("123"); // 🔑 Replace with logged-in user id
  const [conversationId, setConversationId] = useState("expert-room-1");
  const [isTyping, setIsTyping] = useState(false);
  const [expertStatus, setExpertStatus] = useState("offline");
  const messagesEndRef = useRef(null);
  let typingTimeout;

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // ✅ Connect socket
    socket = io("http://localhost:5000");

    // ✅ Register user
    socket.emit("register", userId);

    // ✅ Join expert conversation
    socket.emit("join_conversation", conversationId);

    // ✅ Listen for new messages
    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // ✅ Listen for typing events
    socket.on("typing", ({ senderId }) => {
      if (senderId !== userId) {
        setIsTyping(true);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => setIsTyping(false), 1500);
      }
    });

    // ✅ Listen for online status
    socket.on("user_online", (uid) => {
      if (uid !== userId) setExpertStatus("online");
    });
    socket.on("user_offline", (uid) => {
      if (uid !== userId) setExpertStatus("offline");
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, conversationId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      conversationId,
      senderId: userId,
      content: input,
      messageType: "text",
    };

    // Emit to server
    socket.emit("send_message", msg);

    // Optimistic update
    setMessages((prev) => [...prev, { ...msg, id: Date.now() }]);
    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit("typing", { conversationId, senderId: userId });
  };

  return (
    <Layout>
      <div className="flex flex-col h-[90vh] max-w-3xl mx-auto bg-black text-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Chat with Expert</h2>
          <span
            className={`text-sm ${
              expertStatus === "online" ? "text-green-400" : "text-gray-400"
            }`}
          >
            {expertStatus}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-500 text-center mt-10">No messages yet</p>
          )}
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex ${
                msg.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  msg.senderId === userId
                    ? "bg-white text-black rounded-br-none"
                    : "bg-gray-800 text-white rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <p className="text-gray-400 text-sm italic">Expert is typing...</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 bg-gray-900 text-white rounded-full px-4 py-2 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-white text-black rounded-full p-3 hover:bg-gray-200 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </Layout>
  );
}
