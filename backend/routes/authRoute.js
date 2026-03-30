const express=require('express');
const router=express.Router();
const db=require('../db/db');
const bcrypt = require('bcryptjs');


router.post('/signup',async(req,res)=>{
    const{fullname,address,mobile,email,password}=req.body;
    try{
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if(existingUser.length > 0){
        return res.status(400).json({error:"Email Register already"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql="INSERT INTO users(fullname,address,mobile,email,password)VALUES(?,?,?,?,?)";
    await db.query(sql,[fullname,address,mobile,email,password]);
    res.status(201).json({ message: "User successfully register" });
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Server Error"});
    }
});

module.exports = router;