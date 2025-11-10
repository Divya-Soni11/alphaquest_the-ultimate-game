import playerSignup from '../schema/SignupSchema.js';
import TeamSchema from '../schema/TeamSchema.js';

const signup=async(req,res)=>{
    try{
        const{userName,email,password}=req.body;

        if(!userName||!email||!password){
            return res.status(400).json({
                message:"Incomplte SignUp details!",
                success:false
            });
        }
        else{
            const existingPlayer=await playerSignup.findOne({UserName,email});
            const existingUserName=await playerSignup.findOne({userName});
            if(existingPlayer){
                return res.json({
                    message:"Player already signed Up, sign in to play.",
                    success:true
                });
            }
            else if(existingUserName){
                return res.json({
                    message:"userName is taken, try another userName.",
                    success:false
                });
            }
            else{
                const salt=await bcrypt.genSalt(10);
                const hashedPwd=await bcrypt.hash(password,salt);
                const newPlayer= new playerSignup({
                    userName,
                    email,
                    password:hashedPwd,
                    firstScore:null,
                    updatedScore:null,
                    teamId:null
                });
            }
            await newPlayer.save();
            return res.status(200).json({
                message:"SignUp successful! Sign in to play!",
                success:true
            });
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Internal server error!",
            success:false
        });
    }
}

const individualSignIn=async(req,res)=>{
    try{
        const{userName,password}=req.body;

        if(!userName||!password){
            return res.status(400).json({
                message:"enter complete details, before signing in!",
                success:false
            });
        }
        else{
            const validUser=await playerSignup.findOne({userName});
            if(validUser){
                if(await bcrypt.compare(password,playerSignup.hashedPwd)){
                    return res.status(200).json({
                        message:"Signed in successfully!",
                        success:true
                    });
                }
                else{
                    return res.status(400).json({
                        message:"Incorrect password!",
                        success:false
                    });
                }
            }
            else{
                return res.status(404).json({
                    message:"We couldn't find you in signed up players! Sign up first!",
                    success:false
                });
            }
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Internal Server error!",
            success:false
        });
    }
}

const CreateTeam=async(req,res)=>{
    try{
        individualSignIn(req,res);
        const {teamName}=req.body;

        function generateTeamId(length = 8){
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }

        const newTeam=new TeamSchema({
            teamName,
            members:null,
            teamId:generateTeamId(),
            firstScore:null,
            updatedScore:null
        });

        await newTeam.save();
        return res.status(200).json({
            message:`Team ${teamName} created successfully! Share the code ${teamId} to let members join.`,
            success:true
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Internal server error!",
            success:false
        });
    }
}

const joinTeam=async(req,res)=>{
    try{
        individualSignIn();
        const{teamId}=req.body;

        if(!teamId){
            return res.status(400).json({
                message:"please enter teamId",
                success:false
            });
        }
        else{
            const Member=await playerSignup.findOne({userName:req.userName});
            if(Member.teamId!=null){
                Member.teamId=teamId;
            }
            else{
                return res.status(400).json({
                    message:`the user with userName ${userName} is already a part of another team!`,
                    success:false
                });
            }
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            message:"internal server error!",
            success:false
        });
    }
}

const gameController=async(req,res)=>{
    try{
        
    }
    catch{

    }
}