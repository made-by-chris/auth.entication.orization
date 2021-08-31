import User from '../models/User.js';
import { registrationValidator, loginValidator } from '../helpers/validation.js'

export async function register(req, res) {
    try {
        const { error } = registrationValidator(req.body);
        if (error) {
            return res.status(400).json({error});
        }
        const user = await User.create(req.body);
        req.session.user = user
        res.redirect("/confirm")
    } catch (error) {
        res.status(500).send(error);
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
        res.render('index', { user: req.session.user });
    } catch (error) {
        res.status(500).send(error);
    }
}
export async function logout(req, res) {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/')
        });
    } catch (error) {
        res.status(500).send(error);
    }
}