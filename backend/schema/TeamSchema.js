import mongoose, { Schema, trusted } from "mongoose";
import playerSignup from "./SignupSchema.js";

const team= new Schema({
    teamName:{
        type:String,
        required:true
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref:'playerSignup'
    }],
    teamId:{
        type:String,
        required:true
    },
    firstScore:{
        type:Number
    },
    updatedScore:{
        type:Number
    }
});

export default mongoose.model('team',team, 'teams');