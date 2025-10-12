"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api"; // your existing API helper

export default function ConversationList() {
  const [conversations, setConversations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const res = await apiRequest("/chat/my-conversations", "GET");
    if (res.success) setConversations(res.data);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Your Conversations</h1>

      {conversations.length === 0 ? (
        <p className="text-gray-400">No conversations yet</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer"
              onClick={() => router.push(`/chat/${conv.id}`)}
            >
              <h3 className="font-semibold text-lg">
                {conv.name || `Conversation ${conv.id}`}
              </h3>
              <p className="text-gray-400 text-sm">
                {conv.messages?.[0]?.content || "No messages yet"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
