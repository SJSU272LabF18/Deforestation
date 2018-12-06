const mongoose=require('mongoose');
const Schema=mongoose.Schema;

var Tender=new Schema({

    name:{
        type:String
    },
    company:{
        type:String
    },
    loc_latitude:{
        type:Number
    },
    loc_longitude:{
        type:Number
    },
    forestArea:{
        type:Number
    },
    bufferArea:{
        type:String
    },
    bufferLength:{
        type:String
    },
    resultArea:{
        type:String
    },
    Percentagecheck:{
        type:Number
    }

})

module.exports=Tender=mongoose.model('tenders',Tender);
