"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { Lock, MessageCircle, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Message {
  _id?: string;
  conversationId: string;
  sender: string | { _id: string; name?: string; email?: string };
  text: string;
  createdAt?: string;
}

interface Participant {
  _id: string;
  name?: string;
  email?: string;
}

interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessage?: string;
  updatedAt?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL as string;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL as string;

export default function AdminMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();
  const ADMIN_ID = session?.user?.id as string | undefined;
  const router = useRouter();

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket setup
  useEffect(() => {
    if (!ADMIN_ID) return;

    const s = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(s);

    s.on("connect", () => {
      s.emit("register", ADMIN_ID);
      setConnected(true);
    });

    s.on("disconnect", () => setConnected(false));

    s.on("receiveMessage", (msg: Message) => {
      if (
        currentConversation &&
        msg.conversationId === currentConversation._id
      ) {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (m) =>
              m._id === msg._id ||
              (m.text === msg.text && m.createdAt === msg.createdAt)
          );
          if (alreadyExists) return prev;
          return [...prev, msg];
        });
      }
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === msg.conversationId
            ? { ...conv, lastMessage: msg.text, updatedAt: msg.createdAt }
            : conv
        )
      );
    });

    return () => {
      s.disconnect();
    };
  }, [ADMIN_ID, currentConversation]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!ADMIN_ID || !session?.accessToken) return;

    const res = await fetch(`${API_BASE}/conversation`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const data = await res.json();
    if (Array.isArray(data)) {
      setConversations(data);
    } else if (Array.isArray(data.data)) {
      setConversations(data.data);
    } else {
      setConversations([]);
    }
  }, [ADMIN_ID, session?.accessToken]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Open a conversation
  const openConversation = async (conv: Conversation) => {
    setCurrentConversation(conv);
    setMessages([]);
    if (socket && connected) socket.emit("joinRoom", conv._id);

    const res = await fetch(`${API_BASE}/message/${conv._id}`);
    const data = await res.json();

    if (Array.isArray(data)) {
      setMessages(data);
    } else if (Array.isArray(data.data)) {
      setMessages(data.data);
    } else {
      setMessages([]);
    }
  };

  // Send message
  const sendMessage = () => {
    if (
      !input.trim() ||
      !socket ||
      !currentConversation ||
      !connected ||
      !ADMIN_ID
    )
      return;

    const payload: Message = {
      conversationId: currentConversation._id,
      sender: ADMIN_ID,
      text: input.trim(),
      createdAt: new Date().toISOString(),
    };

    socket.emit("sendMessage", payload);

    // ❌ এখানে আর setMessages করবো না, শুধু socket এর response এ append হবে
    setInput("");
  };

  const formatTime = (time?: string) => {
    if (!time) return "";
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // If not logged in
  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center my-20">
        <Card className="w-full max-h-max text-center shadow-lg rounded-2xl border border-gray-200 p-6">
          <CardHeader>
            <div className="flex justify-center mb-3">
              <div className="bg-red-100 text-red-600 p-3 rounded-full">
                <Lock size={28} />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              You’re not logged in
            </CardTitle>
            <CardDescription className="text-gray-500 mt-2">
              Please log in to continue and start chatting with the Admin.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              className="w-full rounded-xl text-base font-medium shadow-md"
              onClick={() => router.push("/login")}
            >
              🔑 Log in to Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] border rounded-lg overflow-hidden max-w-8xl mx-auto mt-6 shadow">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const user = conv.participants.find((p) => p._id !== ADMIN_ID);
            const active = currentConversation?._id === conv._id;
            return (
              <div
                key={conv._id}
                onClick={() => openConversation(conv)}
                className={`grid grid-cols-7 items-center gap-3 p-3 cursor-pointer ${
                  active ? "bg-cyan-100" : "hover:bg-gray-100"
                }`}
              >
                <div className="col-span-1 overflow-hidden">
                  <Image
                    src={"/images/profile-mini.jpg"}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover w-full aspect-square rounded-full"
                  />
                </div>
                <div className="col-span-5 flex-1">
                  <p
                    className={`font-medium truncate ${
                      active ? "text-cyan-700" : ""
                    }`}
                  >
                    {user?.name || user?.email || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {conv.lastMessage || "No messages"}
                  </p>
                </div>
                <span className="col-span-1 text-xs text-gray-400">
                  {formatTime(conv.updatedAt)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center gap-3 p-3 border-b bg-white">
          {currentConversation ? (
            <>
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={"/images/profile-mini.jpg"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="object-cover w-10 h-10 rounded-full"
                />
              </div>
              <p className="font-semibold truncate max-w-[calc(100%-3rem)]">
                {currentConversation.participants
                  .filter((p) => p._id !== ADMIN_ID)
                  .map((p) => p.name || p.email || p._id)
                  .join(", ")}
              </p>
            </>
          ) : (
            <p className="text-gray-500">Choose a chat to view messages</p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="h-full flex items-center justify-center  ">
                <div className="bg-white shadow-lg rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 max-w-sm text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-cyan-100 animate-pulse">
                    <MessageCircle className="w-8 h-8 text-cyan-600" />
                  </div>
                  <p className="text-xl font-semibold text-gray-700">
                    No Conversation Selected
                  </p>
                  <p className="text-sm text-gray-500">
                    Choose a conversation from the left or start a new chat to
                    see messages here.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((m, i) => {
              const senderId =
                typeof m.sender === "object" ? m.sender._id : m.sender;
              const isAdmin = senderId === ADMIN_ID;

              return (
                <div
                  key={m._id || i}
                  className={`mb-4 flex ${
                    isAdmin ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xl px-3 py-2 rounded-2xl relative break-words whitespace-pre-wrap ${
                      isAdmin
                        ? "bg-cyan-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className="absolute -bottom-4 right-2 text-xs text-gray-400">
                      {formatTime(m.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {/* Input */}
        {currentConversation && messages.length > 0 && (
          <div className="flex items-center gap-2 p-3 border-t bg-white">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message"
            />
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer"
              onClick={sendMessage}
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
