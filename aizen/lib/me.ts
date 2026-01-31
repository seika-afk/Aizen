import { NextResponse,NextRequest } from "next/server";
import jwt from "jsonwebtoken"
import User from "@/models/user";
import { connectToDB } from "@/lib/db";



export async function GET_API(req:NextRequest){

await connectToDB();

const token= req.cookies.get("token")?.value;

if(!token){

return null;
}
const {userId}=jwt.verify(token,process.env.JWT_SECRET)as any;

const user=await User.findById(userId).select("-password")
return user


}

