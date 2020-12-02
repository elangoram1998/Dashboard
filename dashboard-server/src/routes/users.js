const express=require('express');
const User=require('../model/user');

const router=express.Router();

router.post('/signUpUser',async(req,res)=>{
    console.log(req.body);
    try{
        const user=new User(req.body);
        await user.save();
        res.status(200).send();
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send(error);
    }
});

router.post('/signInUser',async(req,res)=>{
    console.log(req.body);
    try{
        const user=await User.findByCredentials(req.body.username,req.body.password);
        const token=await user.generateToken();
        res.status(200).send({
            user,token
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(404).send("Failed to login");
    }
});

module.exports=router;