import { Request, Response, NextFunction } from "express";
import * as ticketService from "../services/ticketService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { TicketPriority, TicketStatus } from "../services/ticketTypes";

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

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, priority, status } = req.body ?? {};

    const errors: string[] = [];
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      errors.push("Missing required field: title");
    }
    if (!description || typeof description !== "string") {
      errors.push("Missing required field: description");
    }
    const allowedPriorities: TicketPriority[] = ["critical", "high", "medium", "low"];
    if (!allowedPriorities.includes(priority as TicketPriority)) {
      errors.push("Invalid priority. Must be one of: critical, high, medium, low");
    }

    if (errors.length) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors,
      });
      return;
    }

    const created = await ticketService.createTicket({
      title: (title as string).trim(),
      description: description as string,
      priority: priority as TicketPriority,
      status: status as TicketStatus | undefined,
    });

    res.status(HTTP_STATUS.CREATED).json({
      message: "Ticket created",
      data: created,
    });
    return;
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
          res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Error 404: Ticket not found", data: null });
          return;
        }

        const { ticket, score } = result;
        res.status(HTTP_STATUS.OK).json({
          message: "Ticket urgency calculated",
          data: {
            id: isNaN(Number(ticket.id)) ? ticket.id : Number(ticket.id),
            title: ticket.title,
            priority: ticket.priority,
            status: ticket.status,
            createdAt: ticket.createdAt,
            ticketAge: score.ticketAge,
            urgencyScore: score.urgencyScore,
            urgencyLevel: score.urgencyLevel,
          },
        });
        return;
      })
      .catch(next);
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ticketId: string = Array.isArray((req.params as any).ticketId)
      ? (req.params as any).ticketId[0]
      : (req.params as any).ticketId as string;

    const { priority, status } = req.body ?? {};

    const errors: string[] = [];
    const allowedPriorities: TicketPriority[] = ["critical", "high", "medium", "low"];
    const allowedStatus: TicketStatus[] = ["open", "resolved"];

    if (priority !== undefined && !allowedPriorities.includes(priority as TicketPriority)) {
      errors.push("Invalid priority. Must be one of: critical, high, medium, low");
    }

    if (status !== undefined && !allowedStatus.includes(status as TicketStatus)) {
      errors.push("Invalid status. Must be one of: open, resolved");
    }

    if (errors.length) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Validation failed", errors });
      return;
    }

    const updated = await ticketService.updateTicket(ticketId, {
      priority: priority as TicketPriority | undefined,
      status: status as TicketStatus | undefined,
    });

    if (!updated) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ message: "Ticket updated", data: updated });
    return;
  } catch (error) {
    next(error);
  }
};
