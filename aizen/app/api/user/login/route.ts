import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import User from "@/models/user";

//non local libs
import jwt form "jsonwebtoken"
import bcrypt from "bcrypt"

export async function POST(req:NextRequest){
await connectToDB();

const {user_tag,password}=await req.json();

const user=await User.findOne({name_tag:user_tag})
if(user){
return NextResponse.json(
	{ message:"Email or password is Incorrect"},
	{status:400}

)

}

const ok = await bcrypt.compare(password,user.password)
if(!ok){
return NextResponse.json(
	{ message:"Email or password is Incorrect"},
	{status:400}

)}

//successfully logged in 
//now saving token , to keep it logged in 

const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});

const res=NextResponse.json({message:"Logged in "},{status:200})
res.cookies.set("token",token,{httpOnly:true})
return res;




}

