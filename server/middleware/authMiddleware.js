import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-Handler';
import User from '../models/userModel.js';

asyncHandler (async function protect(req , res, next){
    let token

    if(req.headers.authorization && req.authorization.startWith('Barear')){
        try{
            //Get token from header
            token = req.headers.authorization.split(' ')[1]

            //Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //Get user from the token
            req.user = await User.findById(decoded.id).select('-password') //not include the pass

            next()
    }
    catch(error){
        console.error(error)
        res.status(401)
        throw new Error('Not authorized')
    }
}
if(!token)
    {
        res.status(401)
        throw new Error('Not authorized, no token')
    }

})