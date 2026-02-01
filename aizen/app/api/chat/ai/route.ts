import { NextRequest,NextResponse } from "next/server";
import { GET_API } from "@/lib/me";
const GEMINI_API_URL = process.env.GEMINI_URL

export const maxDuration =60;


export async function  POST(req:NextRequest){

	try{
	//const user=await GET_API(req);
	//if(!user){
	//console.warn("USER NOT AUTHENTICATED")

	//return NextResponse.json({
	//	success:false,
	//	message:"user not authenticated",
	//})
	//}

	const {prompt}= await req.json();
	
	const userPrompt={
		role:"user",
		content:prompt,
		timestamp:Date.now(),
	};

	

		
	//const GEMINI_API_KEY= user.api_key;
	
const GEMINI_API_KEY="AIzaSyDVPmFLH3s5EPrEL1-v6olrEQtJpd9xkMk"
	console.log("CALL TO API###")
	const response = await fetch(GEMINI_API_URL + `?key=${GEMINI_API_KEY}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			contents: [
				{
					role: "user",
					parts: [{ text: prompt }],
				},
			],
			generationConfig: { maxOutputTokens: 400 },
		}),
	});

	console.log(`RESPONSE STATUS FROM AI ",${response.status}`);
	
console.log("STATUS:", response.status);

if (!response.ok) {
  const t = await response.text();
  throw new Error(t);
}
	const geminiData = await response.json();
	const curResponse =
		geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

	return NextResponse.json({
		success:true,
		data:{
		content:
			curResponse ||
			curResponse?.toString?.() ||
			JSON.stringify(curResponse),

		},
	})

	} 
catch (err: any) {
  return NextResponse.json({
    success: false,
    error: err?.message || "Something went wrong",
  });
}
}
