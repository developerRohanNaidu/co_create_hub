"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Layout from "@/components/Layout";
import { apiRequest } from "@/lib/api";

export default function ChatHistory() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const res = await apiRequest("/chat/conversations", "GET");
    if (res.success) {
      setConversations(res.data);
    }
  };

  const openChat = (conversationId) => {
    router.push(`/chat-with-expert/${conversationId}`);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Your Chats with Experts</h1>

        {conversations.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">No previous conversations</p>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 transition"
                onClick={() => openChat(conv.id)}
              >
                {/* Expert Profile Photo */}
                <div className="relative w-12 h-12">
                  <Image
                    src={conv.expert?.profile_image || "/default-avatar.png"}
                    alt={conv.expert?.name || "Expert"}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                {/* Expert Info */}
                <div className="flex-1 flex flex-col">
                  <p className="text-white font-semibold">{conv.expert?.name || "Unknown Expert"}</p>
                  <p className="text-gray-400 text-sm truncate">{conv.lastMessage?.content || "No messages yet"}</p>
                </div>

                {/* Last Message Time */}
                <div className="text-gray-500 text-xs">
                  {conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
