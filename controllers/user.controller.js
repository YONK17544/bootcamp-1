import User from "../models/users.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
       const { name, email, password } = req.body;
    
       const currentUser = await User.findOne({email});
    if (!currentUser){
     // if (name && email && password) {
       const user =  new User(req.body);
       await user.save();
    
       res.status(200).json({
          status: true,
          data: user,
          message: "user created successfully"
       })
    // }
    }else{
       res.status(400).json({
          status: false,
          message:"Email already registered",
       })
    }
       
    } catch (error) {
       res.status(400).json({
          status: false,
          error: error.message,
       })
    }
    }
    
    export const loginUser = async (req, res) => {
    try {
       const { email, password } = req.body;
    
       const user = await User.findOne({email});
    
       if (!user) {
          return res.status(401).json({
             status: false,
             message: "Invalid email or password"
          })
       } else{
          const matchPassword = await user.matchPassword(password);
          console.log(matchPassword);
          if (matchPassword){
    
             const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'} )
    
             // const decryptToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
             // console.log(decryptToken);
    
             const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},{
                   $set:{ jwt:token },
                },{
                    new:true
                }
             )
             console.log(updatedUser);
    
             return res.status(200).json({
                status: true,
                data: token,
                message: "User logged in successfully"
             })
          }else{
             return res.status(400).json({
                status: false,
                message: "Invalid password"
             })
          }
       }
    
       
    } catch (error) {
       res.status(400).json({
          status: false,
          error: error.message,
       })
    }
    }

    export const logOut = async (req, res) => {
      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
         const token = req.headers.authorization.split(" ")[1];
    
         const validatedData = jwt.verify(token, process.env.JWT_SECRET_KEY)
         const user = await User.findOneAndUpdate(
            {_id: validatedData.id},{
               $set:{ jwt: ""},
            },{
                new:true
            }
         )
         return res.status(200).json({
            status: true,
            data: user,
            message: "User logged out successfully"
         })
      } 
      
    }

    export const getUser = async (req, res) =>{
      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
         const token = req.headers.authorization.split(" ")[1];
    
         const validatedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
         const user =  await User.findOne({_id : validatedData.id})
         return res.status(200).json({
            status: true,
            data: user,
            message: "User found"
         })
      }
    }

    export const updateDetails = async (req, res) =>{
      const { email, name } = req.body;
      
      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
         const token = req.headers.authorization.split(" ")[1];
    
         const validatedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
         const user =  await User.findOneAndUpdate(
            {_id : validatedData.id},{
               $set:{ name:name, email: email},
            },{
                new:true
            }
         )
         return res.status(200).json({
            status: true,
            data: user,
            message: "User updated successfully"
         })
      }


    }