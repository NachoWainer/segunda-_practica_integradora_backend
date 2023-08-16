import { Router } from "express";
import userModel from "../dao/models/Users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";


const router = Router()
router.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})

router.get("/githubcallback", passport.authenticate("github",{failureRedirect:"/"}),async(req,res)=>{
    req.session.user=req.user
    res.redirect("/products")

})

router.post("/register", passport.authenticate("register",{failureRedirect:"/failregister"}),async(req,res)=>{
    res.send({status:"success",message:"User Registered"})
})

router.get("/failregister",async(req,res)=>{
    res.send({error:"failed"})
})

router.post("/login",passport.authenticate("login",{failureRedirect:"/faillogin"}),async(req,res)=>{
    const {email , password} = req.body
    if (!req.user) return res.status(400).send({status:"error", error:"Wrong password"})
    req.session.user={
    first_name:req.user.first_name,
    last_name:req.user.last,
    age: req.user.age,
    email:req.user.email,
    cart:req.user.cart._id,
    rol:req.user.rol}

    res.send({status:"success",payload: req.user})
})

    

router.get("/faillogin",async(req,res)=>{
    res.send({error:"failed"})
})


router.post("/recover", async (req,res) => {
    const {email,password} = req.body
    if (!email||!password) return res.status(400).send({status:"error", error:"Missing user credentials"})
    const user = await userModel.findOne({email})
    if (!user) return res.status(400).send({status:"error",error:"Incorrect credentials"})
    await userModel.updateOne({ _id: user._id}, { password: createHash(password) })    
    return res.status(200).send({status:"ok",message:"Contraseña actualizada"})
})
router.get("/current",async(req,res)=>{
    const currentUser = req.session.user
    console.log(req.session)
    res.send({staturs:"ok",message: currentUser})
})
export default router 