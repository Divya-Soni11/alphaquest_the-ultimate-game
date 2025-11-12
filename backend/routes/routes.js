import authenticateUser from '../middleware/AuthenticatePlayer.js';
import { CreateTeam, joinTeam , signIn , signup, submitScore } from '../controller/controller.js';
import express from 'express';

const routes = express.Router();

// The authentication middleware checks user credentials before proceeding


routes.post('/createTeam', authenticateUser, CreateTeam);
routes.post('/joinTeam', authenticateUser, joinTeam);
routes.post('/signIn',signIn);
routes.post('/playIndividually', signIn);
routes.post('/signUp', signup);
routes.post('/submitScore',submitScore);

export default routes;