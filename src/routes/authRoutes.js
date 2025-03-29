import express from 'express';
// import { registerUser, loginUser, logoutUser, loginDoctor, loginPatient, loginNgo } from '../controllers/authController.js';
import { iam, login, logout, signup } from '../controllers/authSimple.js';
import { authenticateUser } from '../middlewares/isAuthenticated.js';

const authRoutes = express.Router();

authRoutes.post('/singup', signup);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.get('/iam',authenticateUser , iam);

export default authRoutes;


