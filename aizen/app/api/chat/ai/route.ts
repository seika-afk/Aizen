export const maxDuration =60;
import { NextRequest,NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { GET_API } from "@/lib/me";
import { addChat } from "@/lib/chatStore";
const GEMINI_API_URL = process.env.GEMINI_URL



export async function  POST(req:NextRequest){

	try{
	const user=await GET_API(req);
	if(!user){
	console.warn("USER NOT AUTHENTICATED")

	return NextResponse.json({
		success:false,
		message:"user not authenticated",
	})
	}

	const {prompt}= await req.json();
	
	const userPrompt={
		role:"user",
		content:prompt,
		timestamp:Date.now(),
	};

	addChat(user._id,userPrompt)


		
	const GEMINI_API_KEY= user.api_key;
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
	const geminiData = await response.json();

	const assistantReply =
		geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

	const message = {
		role: "assistant",
		content: assistantReply,
		timestamp: Date.now(),
	};

	addChat(user._id,message);

	return NextResponse.json({
		success:true,
		data:message,
	})

	} 
	catch (error) {
		console.error("[AI ROUTE] Error occurred:", error);
		return NextResponse.json({
			success: false,
			message: error.message || error,
		});
	}
}

