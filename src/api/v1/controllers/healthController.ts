import { Request, Response, NextFunction } from "express";

export const getHealth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.send("Hello, world!");
  } catch (error) {
    next(error);
  }
};
