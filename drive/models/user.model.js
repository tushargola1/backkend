const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
        trim:true,
        lowercase:true,
        unique:true,
        minLength:[3 , 'user name must be atleast 3 characters long']
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        minLength:[10 , 'email must be atleast 10 characters long']
    },
        password:{
        type:String,
        required:true,
        trim:true,
        minLength:[8 , 'email must be atleast 8 characters long']
    },
})

const user = mongoose.model('user' , userSchema)

module.exports = user;