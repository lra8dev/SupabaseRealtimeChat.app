"use client";

import { useEffect, useState } from "react";
import { supabase, Message, Profile } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

// MESSAGES HOOK
export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50);

      if (!error) setMessages(data || []);
      setLoading(false);
    };

    const setupSubscription = () => {
      channel = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => setMessages((prev) => [...prev, payload.new as Message])
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "messages" },
          (payload) =>
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== payload.old.id)
            )
        )
        .subscribe();
    };

    fetchMessages();
    setupSubscription();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return { messages, loading };
}

// ONLINE USERS HOOK
export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([]);

  useEffect(() => {
    let channel: RealtimeChannel;

    const fetchOnlineUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("online", true);

      if (!error) setOnlineUsers(data || []);
    };

    const setupSubscription = () => {
      channel = supabase
        .channel("profiles")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profiles" },
          (payload) => {
            const newProfile = payload.new as Profile;
            const oldProfile = payload.old as Profile;

            setOnlineUsers((prev) => {
              let updated = [...prev];

              if (payload.eventType === "INSERT") {
                if (
                  newProfile.online &&
                  !updated.find((u) => u.id === newProfile.id)
                ) {
                  updated.push(newProfile);
                }
              }

              if (payload.eventType === "UPDATE") {
                if (newProfile.online) {
                  updated = updated.filter((u) => u.id !== newProfile.id);
                  updated.push(newProfile);
                } else {
                  updated = updated.filter((u) => u.id !== newProfile.id);
                }
              }

              if (payload.eventType === "DELETE") {
                updated = updated.filter((u) => u.id !== oldProfile.id);
              }

              return updated;
            });
          }
        )
        .subscribe();
    };

    fetchOnlineUsers();
    setupSubscription();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return onlineUsers;
}
