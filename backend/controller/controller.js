import playerSignup from '../schema/SignupSchema.js';
import TeamSchema from '../schema/TeamSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup=async(req,res)=>{
    try{
        const{userName,email,password}=req.body;

        if(!userName||!email||!password){
            return res.status(400).json({
                status:400,
                message:"Incomplte SignUp details!",
                success:false
            });
        }
        else{
            const existingPlayer=await playerSignup.findOne({userName,email});
            const existingUserName=await playerSignup.findOne({userName});
            if(existingPlayer){
                return res.status(400).json({
                    status:400,
                    message:"Player already signed Up, sign in to play.",
                    success:false
                });
            }
            else if(existingUserName){
                return res.status(400).json({
                    status:400,
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
                    Score:null,
                    teamId:null
                });
                await newPlayer.save();
                return res.status(200).json({
                    status:200,
                    message:"SignUp successful! Sign in to play!",
                    success:true
                });
            }
            
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            status:500,
            message:"Internal server error!",
            success:false
        });
    }
}

export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        status:400,
        message: "Enter complete details before signing in!",
        success: false
      });
    }

    const validUser = await playerSignup.findOne({ userName });

    if (!validUser) {
      return res.status(404).json({
        status:404,
        message: "We couldn't find you in signed up players! Sign up first!",
        success: false
      });
    }

    const isPasswordValid = await bcrypt.compare(password, validUser.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        status:400,
        message: "Incorrect password!",
        success: false
      });
    }

    // Create JWT payload and token
    const payload = { userId: validUser._id, userName: validUser.userName };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set cookie secure in production
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.status(200).json({
        status:200,
        message: "Signed in successfully!",
        success: true,
        token, // also send token in body for flexibility
        user:{
            id:validUser._id,
            userName:validUser.userName,
            email:validUser.email,
        }
    });

  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
        status:500,
        message: "Internal Server error!",
        success: false
    });
  }
};



function generateTeamId(length = 8){
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }


export const CreateTeam=async(req,res)=>{
    try{
        const {teamName}=req.body;
        const userName=req.user.userName;

        const existingPlayer=await playerSignup.findOne({userName});
        const teamCode=generateTeamId();

        if(existingPlayer.teamId==null){ //need to check if the person creating a team is a part of another team or not..
            existingPlayer.teamId=teamCode;
            const newTeam=new TeamSchema({
                teamName,
                members:[existingPlayer._id],
                teamId:teamCode,
                firstScore:null,
                updatedScore:null
            });

            await newTeam.save();
            return res.status(200).json({
                status:200,
                message:"Team created successfully!",
                success:true,
                teamCode:newTeam.teamId,
                teamName:newTeam.teamName
            });
        }
        else{
            return res.status(400).json({
                status:400,
                message:"Can't create your team, you are already a member in another team!",
                success:false
            });
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            status:500,
            message:"Internal server error!",
            success:false
        });
    }
}

export const joinTeam=async(req,res)=>{
    try{
        const{teamId}=req.body;
        const userName=req.user.userName;

        if(!teamId){
            return res.status(400).json({
                status:500,
                message:"please enter teamId",
                success:false
            });
        }
        else{
            const Member=await playerSignup.findOne({userName});
            if(Member.teamId==null){
                Member.teamId=teamId;
                const team=await TeamSchema.findOne({teamId});
                if(!team){
                    return res.status(404).json({
                        status:404,
                        message:"team not found! Please recheck the entered team Id!",
                        success:false
                    });
                }
                else{
                    team.members.push(Member._id);
                    await team.save();
                    await Member.save();
                    return res.status(200).json({
                        status:200,
                        message:"team joined successfully!",
                        success:true,
                        teamId,
                        teamName:team.teamName
                    });
                }                    
            }
            else{
                return res.status(400).json({
                    status:400,
                    message:`Can't join this team! you are already a member of another team!`,
                    success:false
                });
            }
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            status:500,
            message:"internal server error!",
            success:false
        });
    }
}

export const submitScore = async (req, res) => {
  try {
    const { score, teamId } = req.body;

    if (!req.user) {
      return res.status(401).json({ status: 401, message: 'Unauthorized: Missing user info', success: false });
    }

    const userId = req.user.userId;
    const player = await playerSignup.findById(userId);

    if (!player) {
      return res.status(404).json({ status: 404, message: 'User not found', success: false });
    }

    if (teamId) {
      // ✅ Team game
      const team = await TeamSchema.findOne({ teamId: teamId });
      if (!team) return res.status(404).json({ status: 404, message: 'Team not found' });

      if (team.firstScore == null) {
        team.firstScore = score;
      } else {
        team.updatedScore = score;
      }

      await team.save();
    } else {
      // ✅ Individual game
      player.Score = score;
      await player.save();
    }

    return res.status(200).json({
      status: 200,
      message: 'Score updated successfully!',
      success: true
    });

  } catch (error) {
    console.error('Error in submitScore:', error);
    return res.status(500).json({ status: 500, message: 'Internal Server Error!', success: false });
  }
};
