"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import { apiRequest } from "@/lib/api";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

let socket;

export default function ChatScreen() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null); // assume you have JWT user
  const messagesEndRef = useRef(null);

  // 🧠 Initialize Socket
  useEffect(() => {
    const tokenData = localStorage.getItem("user"); // assume user info saved
    if (tokenData) {
      const user = JSON.parse(tokenData);
      setUserId(user.id);

      socket = io(SOCKET_URL, { transports: ["websocket"] });
      socket.emit("register", user.id);
      socket.emit("join_conversation", conversationId);

      socket.on("new_message", (msg) => {
        if (msg.conversationId === parseInt(conversationId)) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      socket.on("typing", ({ senderId }) => {
        console.log("Typing:", senderId);
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [conversationId]);

  // 📨 Fetch messages initially
  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  const fetchMessages = async () => {
    const res = await apiRequest(`/chat/messages/${conversationId}`, "GET");
    if (res.success) setMessages(res.data);
  };

  // ✉️ Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    const payload = {
      conversationId: parseInt(conversationId),
      senderId: userId,
      content: input,
      messageType: "text",
    };

    // Emit via socket
    socket.emit("send_message", payload);
    setInput("");
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold">Chat #{conversationId}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-xs ${
                msg.senderId === userId
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 bg-gray-800 rounded-lg outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}
