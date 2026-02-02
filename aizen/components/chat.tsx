'use client';
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import PromptBox from "./PromptBox";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
      <div className="relative w-full h-full flex flex-col text-[#e0ddcf] bg-[#313638] overflow-hidden">


      {/* Messages */}
      <div
        ref={containerRef}
        className="flex flex-col h-full overflow-y-auto px-2 py-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
	    <Image
                  src="/logo.png"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="h-16 w-16  invert brightness-200 "
                />

            <p className="text-2xl font-kode font-medium">aizen</p>
            <p className="text-sm mt-4 opacity-80">Rewrite your images.</p>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-2">
            {messages.map((msg, ind) => (
              <div
                key={ind}
                className={`py-2 px-3 rounded-lg text-sm border border-transparent hover:border-gray-500/50 ${
                  msg.role === "user"
                    ? "bg-[#555B5E] text-white self-end"
                    : "bg-[#383D3F]/80 text-white self-start"
                }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 py-3 items-center">
                <Image
                  className="h-9 w-9 p-1 border  invert brightness-200 border-white/15 rounded-full"
                  src="/logo.png"
                  alt="Logo"
                  width={36}
                  height={36}
                />
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:200ms]" />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:400ms]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prompt box */}
      <div className="w-full z-20  p-2">
        <PromptBox
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setMessages={setMessages}
        />
      </div>

      {/* Footer */}
      <p className="text-xs text-white text-center pb-1">
        Contact{" "}
        <a
          href="mailto:talk2gagan09@gmail.com"
          className="underline hover:text-gray-700"
        >
          Me
        </a>
        .
      </p>
    </div>
  );
};

export default Chat;

