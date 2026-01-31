import mongoose from "mongoose"

const userSchema= new mongoose.Schema({
	usertag:{
		type:String,
		require:true 
		
	},

	password:{
		type:String,
		require:true

	},
	api_key:{
		type:String,
		require:true

	}

	



},{timestamps:true})


const User=mongoose.models.User || mongoose.model('User',userSchema)

export default User;
