import authenticateUser from '../middleware/AuthenticateSignIn.js';
import { createTeam, joinTeam, signIn, signup } from '../controller/controller.js';
import express from 'express';
import { signIn } from '../controller/controller.js';

const routes = express.Router();

// The authentication middleware checks user credentials before proceeding


routes.post('/createTeam', authenticateUser, createTeam);
routes.post('/joinTeam', authenticateUser, joinTeam);
routes.post('/playIndividually', signIn);
routes.post('signUp', signup);

export default routes;