import express, { Router } from "express";
import { getAllTickets, getTicketUrgency } from "../controllers/ticketController";

const router: Router = express.Router();

router.get("/", getAllTickets);
router.get("/:ticketId/urgency", getTicketUrgency);

export default router;
