import mongoose, { Schema } from "mongoose";
import team from "./TeamSchema.js";

const playerSignup=new mongoose.Schema({
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
        type:Int16Array,
        required:true
    },
    updatedScore:{
        type:Int16Array,
        required:true
    },
    teamId:{
        type:Schema.Types.ObjectId,
        ref:team
    }
});

export default mongoose.model('player', player, 'players');