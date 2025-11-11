import mongoose, { Schema } from "mongoose";
import team from "./TeamSchema.js";

const playerSignup=new Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:
    {
        type:String,
        required:true
    },
    firstScore:{
        type:Number
    },
    updatedScore:{
        type:Number
    },
    teamId:{
        type:Schema.Types.ObjectId,
        ref:'team'
    }
});

export default mongoose.model('player', playerSignup, 'players');