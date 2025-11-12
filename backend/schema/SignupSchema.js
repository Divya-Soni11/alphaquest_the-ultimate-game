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
    Score:{
        type:Number
    },
    teamId:{
        type:String,
        ref:'team'
    }
});

export default mongoose.model('player', playerSignup, 'players');