const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signin", async (req,res) =>{
    try{
    const {username} = req.body;
    const {email} = req.body;

   const existingUser = await User.findOne({username});
   const existingEmail = await User.findOne({ email});
  
   if(existingUser){
    return res.status(400).json({
        message:"Username already exists"
    })
   }
  
    if(existingEmail){
        return res.status(400).json({
            message:"Email already exists"
        })
    }

    const hashPassword = await bcrypt.hash(req.body.password,10)

   const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword
   })
    await newUser.save();
    return res.status(200).json({
        message: "SignIn successfully"
    })

    }
    catch(error){
        console.log(error);
        res.status(400).json({
            message: "Internal Server error"
        })
    }
    
})

router.get("/login", async (req,res) =>{
    try{
        const {username} = req.body;
        const {password} = req.body;

        const userExists = await User.findOne({username});
        
       if( !userExists){
        return res.status(400).json({
            message: "invalid username"
        })
       }

       bcrypt.compare(password, userExists.password, (err,data)=>{
        if(data){
            const authClaims = [{name:username}, {jti: jwt.sign({}, "deep123")}];
            const token = jwt.sign({authClaims}, "deep123",{expiresIn: "2d"});
            res.status(200).json({
                id: userExists._id, token:token
            })
        }
        else{
            return res.status(400).json({
                message: "invalid password"
            })
        }
       })

    }
    catch (error){
        console.log(error);
        res.status(400).json({
            message: "Internal Server error"
        })
    }
})

module.exports = router