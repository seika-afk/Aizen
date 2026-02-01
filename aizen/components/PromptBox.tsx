'use client';
import axios from "axios";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { useState } from "react";

interface PromptBoxProps {
  isLoading: boolean;
  setIsLoading: any;
  setMessages: any;
}

const PromptBox: React.FC<PromptBoxProps> = ({isLoading,setIsLoading,setMessages})=>{

const [prompt,setPrompt]=useState("");
const handleKeyDown=(e:any)=>{
if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();
sendPrompt(e);

}
}


const sendPrompt= async(e:any)=>{
const promptCopy=prompt;

try{

e.preventDefault();
    if (isLoading) return toast.error("Wait for the previous prompt response");

    setIsLoading(true);
      setPrompt("");

    const userPrompt = { role: "user", content: prompt, timestamp: Date.now() };
      setMessages((prev) => [...prev, userPrompt]);

         const { data } = await axios.post("/api/chat/ai", { prompt });



if (data.success) {
        const message = data.data.content;
        const messageTokens = message.split(" ");

        let assistantMessage = { role: "assistant", content: message, timestamp: Date.now() };
        setMessages((prev) => [...prev, assistantMessage]);

        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, i + 1).join(" ");
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { ...assistantMessage };
              return updated;
            });
          }, i * 50); 
        }
      } else {
        toast.error(data.error || "Failed to get AI response");
        setPrompt(promptCopy);
      }


}catch (error:any) {
      toast.error(error.message || "Something went wrong");
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };



return (   <form
      onSubmit={sendPrompt}
      className="w-full bg-[#383D3F] max-w-5xl backdrop-blur-lg border-l border-r border-gray-500 p-4 rounded-3xl mt-4 transition-all"
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Type here..."
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2"></div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`${prompt ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}
          >
            <Image
              src={prompt ? "/assets/arrow_icon.svg" : "/assets/arrow_icon_dull.svg"}
              alt="arrow icon"
              width={14}
              height={14}
            />
          </button>
        </div>
      </div>
    </form>
  );

}

export default PromptBox;
