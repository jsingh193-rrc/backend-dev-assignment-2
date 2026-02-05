import { Request, Response, NextFunction } from "express";
import * as ticketService from "../services/ticketService";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const getAllTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.status(HTTP_STATUS.OK).json({
      message: "Tickets retrieved",
      count: Array.isArray(tickets) ? tickets.length : 0,
      data: tickets,
    });
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
