"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useMessages, useOnlineUsers } from "@/hooks/useRealtime";

export default function ChatRoom() {
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const { messages, loading } = useMessages();
  const onlineUsers = useOnlineUsers();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join chat
  const joinChat = async () => {
    if (!userName.trim()) return;

    await supabase.from("profiles").upsert({
      name: userName,
      online: true,
      last_seen: new Date().toISOString(),
    });

    setIsJoined(true);
  };

  // Leave chat manually
  const leaveChat = async () => {
    await supabase
      .from("profiles")
      .update({ online: false, last_seen: new Date().toISOString() })
      .eq("name", userName);

    setIsJoined(false);
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !userName) return;

    await supabase.from("messages").insert({
      content: message.trim(),
      user_name: userName,
    });

    setMessage("");
  };

  // Cleanup: go offline on tab close/refresh
  useEffect(() => {
    const handleUnload = async () => {
      if (isJoined && userName) {
        await supabase
          .from("profiles")
          .update({ online: false, last_seen: new Date().toISOString() })
          .eq("name", userName);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload();
    };
  }, [isJoined, userName]);

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Join the Chat 💬
          </h1>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 border text-background border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => e.key === "Enter" && joinChat()}
            />
            <button
              onClick={joinChat}
              disabled={!userName.trim()}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Join Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">
            Online ({onlineUsers.length})
          </h2>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-2">
          {onlineUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
          ))}
        </div>
        <button
          onClick={leaveChat}
          className="mt-4 w-full text-sm text-red-600 hover:text-red-700 p-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Leave Chat
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Real-time Chat
          </h1>
          <p className="text-sm text-gray-600">Welcome, {userName}! 👋</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.user_name === userName ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.user_name === userName
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  {msg.user_name !== userName && (
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {msg.user_name}
                    </p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.user_name === userName
                        ? "text-blue-100"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={sendMessage}
          className="p-4 bg-white border-t border-gray-200"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border text-background border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
