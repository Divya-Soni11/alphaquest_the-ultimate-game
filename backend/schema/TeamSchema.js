import mongoose, { Schema, trusted } from "mongoose";
import playerSignup from "./SignupSchema.js";

const team= new mongoose.model({
    teamName:{
        type:String,
        required:true
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref:playerSignup,
        required:true
    }],
    teamId:{
        type:String,
        required:true
    },
    firstScore:{
        type:Int16Array,
        required:true
    },
    updatedScore:{
        type:Int16Array,
        required:true
    }
});

export default mongoose.model('team',team, 'teams');