import User from '../models/User.js';
import { registrationValidator, loginValidator } from '../helpers/validation.js'

export async function register(req, res) {
    try {
        const { error } = registrationValidator(req.body);
        if (error) {
            return res.status(400).render('message', {
                title: "We had an error registering you.",
                message: error.details[0].message,
                link:"/",
            });
        }
        const user = await User.create(req.body);
        req.session.user = user
        res.render('message', {
            title: "You're almost ready",
            message:"please check your email and click the confirmation link",
            link:"/",
        });
    } catch (error) {
        res.status(500).render('message', {
            title: "Something broke!",
            message: `A user with this ${Object.keys(error.keyPattern)[0]} already exists`,
            link:"/",
        });
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
            return res.status(400).json({error: 'User not found'});
        }
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).json({error: 'Password is incorrect'});
        }
        req.session.user = user
        res.render('message', {
            title: "You logged in!",
            message:"hi.",
            link:"/",
        });
    } catch (error) {
        res.status(500).render('message', {
            title: "Something broke!",
            message:"Sorry about that. Maybe try again?",
            link:"/",
        });
    }
}
export async function logout(req, res) {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).render('message', {
                    title: "Something broke!",
                    message:"Sorry about that. Maybe try again?",
                    link:"/",
                });
            }
            res.render('message', {
                title: "You've been logged out",
                message:"bye.",
                link:"/",
            });
        });
    } catch (error) {
        res.status(500).render('message', {
            title: "Something broke!",
            message:"Sorry about that. Maybe try again?",
            link:"/",
        });
    }
}