import passport from "passport"
import local from "passport-local"
import GitHubStrategy from "passport-github2"
import "dotenv/config"

import cartsModel from "../dao/models/carts.js"
import userModel from "../dao/models/Users.model.js"
import { createHash, isValidPassword } from "../utils.js"

const LocalStrategy = local.Strategy

const initializedPassport = ()=>{
    passport.use("github", new GitHubStrategy({
    clientID:`${process.env.GITHUB_CLIENTID}`,
    clientSecret:`${process.env.GITHUB_CLIENTSECRET}`,
    callbackURL:`${process.env.GITHUB_CALLBACKURL}`
    },async(accessToken,refreshToken,profile,done)=>{
        try {
            let user = await userModel.findOne({email:profile._json.email})
            if(!user){
              let cart = {
                "products": []
              }
               let newCart = await cartsModel.create(cart)
                let newUser = {
                    first_name: profile._json.name,
                    last_name: " ",
                    email:profile._json.email,
                    age: "",
                    password:" ",
                    cart: newCart
                }
                let result = await userModel.create(newUser)
                done(null,result)
            }else{
                done(null,user)
            }

            
        } catch (error) {
            return done(error)
            
        }
    }))


    passport.use("register",new LocalStrategy(
    {passReqToCallback:true,usernameField:"email"},async(req,email,password,done) =>{

        const {first_name,last_name,age} = req.body 
        try {
            let user = await userModel.findOne({email:email})
            if (user) {
                console.log("User already registered")
                return done ("Error usuario registrado ya", error)
            }
            let cart = {
              "products": []
            }
             let newCart = await cartsModel.create(cart)
            console.log(newCart)
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: newCart
            }
            let result = await userModel.create(newUser)
            return done(null,result)
        } catch (error) {
            return done ("Error ususario", error)
        }
    }
    ))

    passport.use(
        "login",
        new LocalStrategy(
          {
            passReqToCallback: true,
            usernameField: "email",
          },
          async (req, email, password, done) => { 
            try {
              const user = await userModel.findOne({ email: email }); 
              if (!user) {
                return done(null, false);
    
              }
            if (!isValidPassword(user, password)) return done(null, false);
              return done(null, user);
            } catch (error) {
              return done(null, false);
            }
          }
        )
      );
    passport.serializeUser((user,done) =>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        let user = await userModel.findById(id)
        done(null,user)
    })
    
    




  
}

export default initializedPassport