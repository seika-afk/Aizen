'use client'
import { useState,useEffect } from "react";
export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');

    const update = () => setIsMobile(media.matches);
    update();

    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  if (isMobile === null) return null;
if(isMobile) { 

return(
<div className="flex justify-center items-center h-screen">
<p className="text-white">Currently not available on smaller devices. 
	</p>
	</div>
)
       }
else{


 
	return (



<div className="flex  w-full h-screen ">
<div className="bg-[#383D3F] flex items-center justify-center w-full h-full m-2 p-2 rounded-lg">
  <div className="bg-[#313638] flex items-center justify-center w-full h-full p-2 rounded-lg">
    <img id="src" className="w-full h-full object-contain" src="./file.svg" />
  </div>
</div>

<div className="bg-[#383D3F] w-1/2 m-2 p-2 rounded-lg">
right
</div>


</div>
  );

 }
 
 
 }



