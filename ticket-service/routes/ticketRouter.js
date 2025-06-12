import express from 'express'
import { getPaginatedTickets } from '../src/controllers/ticketController.js';
const ticketRouter=express.Router();
ticketRouter.get('/get-distribution',getPaginatedTickets);
export default ticketRouter;