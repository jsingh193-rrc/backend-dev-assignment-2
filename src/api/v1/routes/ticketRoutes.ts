import express, { Router } from "express";
import { getAllTickets, getTicketUrgency, createTicket, updateTicket } from "../controllers/ticketController";

const router: Router = express.Router();

router.get("/", getAllTickets);
router.post("/", createTicket);
router.get("/:ticketId/urgency", getTicketUrgency);
router.put("/:ticketId", updateTicket);

export default router;
