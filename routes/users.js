import Router from 'express';
import {
    register,
    login,
    logout,
    verify,
    me,
} from "../controllers/users.js"

const userRoutes = Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login)
userRoutes.get("/logout", logout)
userRoutes.get("/verify", verify)
userRoutes.get("/me", me)

export default userRoutes;