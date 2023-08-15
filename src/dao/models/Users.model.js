import mongoose from "mongoose"

const userCollection = "Users"
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name:String,
    email:String,
    age: String,
    password: String,
    cart:
        {
          _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts'}
      },
    rol:{type:String, default:"usuario"}    
})
const userModel = mongoose.model(userCollection,userSchema)
export default userModel; 

