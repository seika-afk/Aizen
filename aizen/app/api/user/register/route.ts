import  bcrypt from "bcrypt";
import { NextResponse,NextRequest } from "next/server";
import User from "@/models/user"
import { connectToDB } from "@/lib/db";



export async function POST(req:NextRequest){

await connectToDB();

const {name_tag,password,api_key}=await req.json();

const hashPass= await bcrypt.hash(password,10);

const new_user=new User({
name_tag:name_tag,
password:hashPass,
api_key:api_key


})
await new_user.save()

return NextResponse.json(

	{message:"User created",status:200}

)

}
