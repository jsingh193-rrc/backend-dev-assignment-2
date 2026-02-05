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
    const ticketId: string = Array.isArray((req.params as any).ticketId)
      ? (req.params as any).ticketId[0]
      : (req.params as any).ticketId as string;
    ticketService
      .getTicketUrgency(ticketId)
      .then((result) => {
        if (!result) {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Ticket not found", data: null });
        }

        const { ticket, metrics } = result;
        return res.status(HTTP_STATUS.OK).json({
          message: "Ticket urgency calculated",
          data: {
            id: isNaN(Number(ticket.id)) ? ticket.id : Number(ticket.id),
            title: ticket.title,
            priority: ticket.priority,
            status: ticket.status,
            createdAt: ticket.createdAt,
            ticketAge: metrics.ticketAge,
            urgencyScore: metrics.urgencyScore,
            urgencyLevel: metrics.urgencyLevel,
          },
        });
      })
      .catch(next);
  } catch (error) {
    next(error);
  }
};
