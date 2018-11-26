const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var User=new Schema({
    name:{
        type:String
    },
    emailID:{
        type:String
    },
    password:{
        type:String
    }
})

module.exports=User=mongoose.model('users',User);
