import Router from 'express';
import {
    register,
    login,
    logout,
} from "../controllers/users.js"

const userRoutes = Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login)
userRoutes.get("/logout", logout)

export default userRoutes;