import { Request, Response, NextFunction } from "express";
import * as ticketService from "../services/ticketService";

export const getAllTickets = (req: Request, res: Response, next: NextFunction): void => {
  try {
    ticketService
      .getAllTickets()
      .then((tickets) => res.json(tickets))
      .catch(next);
  } catch (error) {
    next(error);
  }
};

export const getTicketUrgency = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.send("Hello, world!");
  } catch (error) {
    next(error);
  }
};
