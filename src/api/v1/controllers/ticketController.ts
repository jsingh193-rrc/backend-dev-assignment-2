import { Request, Response, NextFunction } from "express";

export const getAllTickets = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.send("Hello, world!");
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
