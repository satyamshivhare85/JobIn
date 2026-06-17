import { Request, Response, NextFunction, RequestHandler } from "express";
import ErrorHandler from "./errorHandler.js";

export const TryCatch =
  (
    controller: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<any>
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        message: error.message,
      });
    }
  };