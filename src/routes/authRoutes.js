import express from 'express';
// import { registerUser, loginUser, logoutUser, loginDoctor, loginPatient, loginNgo } from '../controllers/authController.js';
import { login, logout, signup } from '../controllers/authSimple.js';

const authRoutes = express.Router();

authRoutes.post('/singup', signup);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);


export default authRoutes;


