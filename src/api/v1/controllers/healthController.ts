import { Request, Response } from "express";

export const getHealth = (req: Request, res: Response): void => {
  res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });

};
