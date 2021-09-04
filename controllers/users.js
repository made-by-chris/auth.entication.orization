import User from '../models/User.js';
import { registrationValidator, loginValidator } from '../helpers/validation.js'

export async function register(req, res) {
    try {
        const { error } = registrationValidator(req.body);
        if (error) {
            return res.send(400)
        }
        const user = await User.create(req.body);
        req.session.user = user
        res.send(user)
    } catch (error) {
        if ( error.code === 11000 ) {
            res.send(400 , "Registration failed - check credentials. Maybe you already have an account?")
        } else {
            res.send(500 , error)
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
            return res.status(400).json({error: 'There was an error logging in. Please check your credentials.'});
        }
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).json({error: 'There was an error logging in. Please check your credentials.'});
        }
        req.session.user = user
        res.json(user);
    } catch (error) {
        res.status(500).end();
    }
}
export async function logout(req, res) {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send({message:"Sorry about that. Maybe try again?"})
            }
            res.send({message: "You've been logged out"})
        });
    } catch (error) {
        res.status(500).send({message:"Sorry about that. Maybe try again?"})
    }
}