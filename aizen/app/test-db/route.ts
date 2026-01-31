import { connectToDB } from "@/lib/db";

import User from "@/models/user";


export async function GET(){
await connectToDB();

const user=new User({
name_tag:"test_user",
password:"1232454235",
api_key:"1sfafs241242141413"


})
await user.save()


const users=await User.find();
console.log("all users",users);



return new Response(JSON.stringify({users}),{status:200,headers: { "Content-Type": "application/json" }})





}
