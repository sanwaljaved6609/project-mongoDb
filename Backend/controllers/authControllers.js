import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../model/userSchema.js';

//Register User
export const registerUser = async (req, res) => {
    try{
        const {name, email, userName, password} = req.body;

        const userExits = await User.findOne({$or: [{email},{userName}]});
        if(userExits)
            return res.status(409).json({message: "User already exists"});

        const salt = await bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password,salt);
    
        const user = await User.create({name, email, userName, password:hashPassword});

        res.status(201).json({message:"User registered successfully:",
            user : {id: user._id, name:user.name, email:user.email, userName:user.userName}
        })

    }
    catch(err){
        res.status(401).json({message:err.message});
        console.log("error")
    }
}


//Login User
export const loginUser = async (req,res) =>{
    try{
        const {userName, email, password} = req.body;

        const checkUser = await User.findOne({$or:[{userName},{email}]});
        if(!checkUser)
            return res.status(401).json({message:"Invalid Username or Email"});

        const checkPassword = await bcrypt.compare(password, checkUser.password);
        if(!checkPassword)
            return res.status(401).json({message:"Invalid Password"});

        const token = await jwt.sign({id:User._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});

        res.json({token, checkUser:{id:checkUser._id, name: checkUser.name, userName: checkUser.userName} })

    }
    catch(err){
        res.status(401).json({message:err.message})
    }
}