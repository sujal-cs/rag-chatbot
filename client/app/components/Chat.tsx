"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    // add user bubble
    setMessages((m) => [...m, { sender: "user", text }]);
    setInput("");

    try {
      const res = await fetch(`/api/chat?q=${encodeURIComponent(text)}`);
      const { message } = await res.json();
      setMessages((m) => [...m, { sender: "bot", text: message }]);
    } catch {
      setMessages((m) => [
        ...m,
        { sender: "bot", text: "Error contacting server" },
      ]);
    }
  };

const scrollToBottom = () => {
  endRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  if (messages.length > 0) {
    scrollToBottom();
  }
}, [messages]);


  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-lg shadow-lg">
      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-full px-4 py-2 rounded-2xl break-words whitespace-pre-wrap ${
              m.sender === "user"
                ? "bg-slate-800 self-end text-white"
                : "bg-gray-600 self-start text-gray-200"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-center p-3 border-t border-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-2 focus:outline-none mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-slate-800 hover:bg-blue-500 text-white rounded-xl px-5 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}

