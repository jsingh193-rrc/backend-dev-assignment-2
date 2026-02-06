import express, { Router } from "express";
import { getAllTickets, getTicketUrgency, createTicket } from "../controllers/ticketController";

const router: Router = express.Router();

router.get("/", getAllTickets);
router.post("/", createTicket);
router.get("/:ticketId/urgency", getTicketUrgency);

export default router;
