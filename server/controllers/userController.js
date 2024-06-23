import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt.js';
import asyncHandler from 'express-async-Handler';
import User from '../models/userModel';

// @desc Register new user 
// @desc POST /api/users/registration
// @desc Private

asyncHandler (async function registerUser (req , res) {
try{
    const {fullname_en, fullname_ar, email, phoneNumber, dateOfBirth, password, role, status} = req.body
    if (!fullname_en || !fullname_ar || !email || !phoneNumber || !dateOfBirth || !password || !role || !status){
        res.status(400)
        throw new Error('Please add all fields')
    }
    //Check if user exists
    const userExist = await User.findOne({email})
    if (userExist){
        res.status(400)
        throw new Error('User already exists')
    }
    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create user
    const user = await User.create({
        fullname_en,
        fullname_ar,
        email,
        phoneNumber,
        dateOfBirth,
        password: hashedPassword,
        role,
        status,
        token:generateToken(user._id)

    })

    if (user){
        res.status(201).json({
            _id: user.id,
            fullname_en: user.fullname_en,
            fullname_ar: user.fullname_ar,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            role:user.role,
            status: user.status
            
        })
        } else {
            res.status(400)
            throw new Error('Invalid user Data')
        }

    res.json({message: 'User created successfully'})
}
catch(err){
    res.status(400).json({err})
}
})

// @desc Login user  (Authenticate)
// @desc POST /api/users/login
// @desc Public

asyncHandler ( async function loginUser (req , res) {
    try{
        const {email, password}= req.body

        //check for user email
        const user=await User.findOne({email})

        if(user && (await bcrypt.compare(password, user.password))){
            res.json({
                _id: user.id,
                fullname_en: user.fullname_en,
                fullname_ar: user.fullname_ar,
                email: user.email,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth,
                role:user.role,
                status: user.status,
                token:generateToken(user._id)
                                
            })
        }else {
            res.status(400)
            throw new Error ('Invalid credentials')
            
        }




        res.json({message: 'Logged in successfully'})
    }
    catch{}
    }
)

// @desc Get user data
// @desc GET /api/users/me
// @desc Private

asyncHandler (async function getMe (req , res) {
    try{
        res.json({message: 'Your data loaded'})
    }
    catch{}
    }
)

//generate JWT

asyncHandler(async function generateToken (id){
    return jwt.sign({id}, process.env.JWT_SECRET),{expiresIn:'3d',


    }
}


)



const user ={ registerUser , loginUser , getMe}

export default user