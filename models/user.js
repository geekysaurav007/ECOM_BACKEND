const { string, boolean } = require('joi')
const mongoose=require('mongoose')
const Schema=mongoose.Schema
const userSchema=new Schema({
    name:{type:String,required:true},
    isAdmin:{type:Boolean,default:false},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    active:{type:Boolean ,required:true,default:true},
    phone:{type:String}
},{timestamps:{createdAt:'created_at',updatedAt:'updated_at'}})

userSchema.statics.isExists=async function isExists(email){
    console.log("Is exists Method")
    const user=await this.findOne({email:email})
    return (user)? true:false
}
 const User=(mongoose.model("user",userSchema))
 module.exports={User}