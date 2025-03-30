import express from 'express';
import { createPost, getAllPosts } from '../controllers/patientCotroller.js';

const patientRoutes = express.Router();

patientRoutes.get('/posts', getAllPosts);
patientRoutes.post('/posts', createPost);
// patientRoutes.post('/singup', signup);

export default patientRoutes;


