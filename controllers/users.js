import User from '../models/User.js';
import VerificationCode from '../models/VerificationCode.js';
import { registrationValidator, loginValidator } from '../helpers/validation.js'
import sendVerificationEmail from '../helpers/sendVerificationEmail.js';

export async function register(req, res) {
    try {
        const { error } = registrationValidator(req.body);
        if (error) {
            return res.status(400).json({message:error.details[0].message});
        }
        const user = await User.create(req.body);
        sendVerificationEmail(user);
        req.session.user = user
        res.json({message: 'User created successfully', data: user});
    } catch (error) {
        if ( error.code === 11000 ) {
            res.status(400).json({message:"Registration failed - check credentials. Maybe you already have an account?"})
        } else {
            res.status(500).json({message:error.details[0].message})
        }
    }
}
export async function login(req, res) {
    try {
        const { error } = loginValidator(req.body); 
        if (error) {
            return res.status(400).json({error});
        }
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).json({message: 'There was an error logging in. Please check your credentials.'});
        }
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).json({message: 'There was an error logging in. Please check your credentials.'});
        }
        req.session.user = user
        res.json({message: 'User logged in successfully', data: user});
    } catch (error) {
        res.status(500).end();
    }
}
export async function logout(req, res) {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({message:"Sorry about that. Maybe try again?"})
            }
            res.clearCookie('cookie.sid', { path: '/' }).json({message: "You've been logged out"})
        });
    } catch (error) {
        res.status(500).json({message:"Sorry about that. Maybe try again?"})
    }
}

export async function verify(req, res) {
    try {
        const vcode = await VerificationCode.findOneAndUpdate({code: req.query.verification_code}, {valid: false})
        const user = await User.findByIdAndUpdate(vcode.user_id, {emailConfirmed: true})
        res.redirect("http://localhost:3000/?account_verified=1")
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"failed to verify account", data: error})
    }
}

export async function me(req, res) {
    if(req.session.user){
        res.json({message:"You are logged in. Welcome back.", data: req.session.user});
    } else {
        res.json({message:"You are not logged in."});
    }
}