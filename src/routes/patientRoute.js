import express from 'express';
import { getAllPosts } from '../controllers/patientCotroller.js';

const patientRoutes = express.Router();

patientRoutes.get('/posts', getAllPosts);

// patientRoutes.post('/singup', signup);

export default patientRoutes;


