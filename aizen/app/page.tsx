'use client'
import Chat from "@/components/chat";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft, faLink, faCamera, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage,setUploadedImage]=useState<string|null>(null)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(media.matches);
    update();

    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const handleClick = () => {
    inputRef.current?.click(); // opens file picker
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Uploaded URL:", data.url);
 
  setUploadedImage(data.url);
  };

  if (isMobile === null) return null;
  if (isMobile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-grey">
          Currently not available on smaller devices.
        </p>
      </div>
    )
  } else {
    return (
      <div className="flex w-full h-screen gap-2 p-2">
        {/* Left image */}
        <div className="flex-1 bg-[#383D3F] rounded-lg p-2 flex justify-center">
          {/* Hidden input for file upload */}
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={handleUpload}
          />

          <div className="absolute bg-[#383D3F] rounded-lg p-1 flex gap-4 text-white top-7 z-10">
            <span>
              <FontAwesomeIcon
                icon={faPlus}
                className="text-white text-2xl cursor-pointer hover:scale-110 hover:bg-[#313638] rounded-lg p-2 text-sm transform transition duration-200"
                onClick={handleClick} // triggers hidden input
              />
            </span>

            <span>
              <FontAwesomeIcon
                icon={faArrowRotateLeft}
                className="text-gray-500 hover:scale-125 hover:bg-[#313638] rounded-lg p-2 text-sm transform transition duration-200 cursor-pointer"
              />
            </span>

            <span>
              <FontAwesomeIcon
                icon={faCamera}
                className="text-gray-500 hover:scale-125 hover:bg-[#313638] rounded-lg p-2 transform transition duration-200 cursor-pointer"
              />
            </span>

            <span>
              <FontAwesomeIcon
                icon={faLink}
                onClick={() => { window.location.href = "https://texin.vercel.app/donate.html" }}
                className="text-gray-500 hover:scale-125 hover:bg-[#313638] rounded-lg p-2 transform transition duration-200 cursor-pointer"
              />
            </span>
          </div>

          <div className="bg-[#313638] w-full h-full rounded-lg flex items-center justify-center">
            <div className="bg-[#313638] pointer-events-none">  
              <img
                id="src"
                className="w-full h-full object-cover pointer-events-none"
                src={uploadedImage || "file.png"}
                alt="Main"
              />
            </div>
          </div>
        </div>

        {/* Right chat */}
        <div className="w-1/3 bg-[#383D3F] rounded-lg p-2 flex flex-col overflow-hidden">
          <Chat />
        </div>
      </div>
    );
  }
}

