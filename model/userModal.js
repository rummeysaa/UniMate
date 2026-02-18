const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{type:String,required:true},
    surname:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true,unique:true},
    password2:{type:String},
})

const User =mongoose.model('User',userSchema);

module.exports = User