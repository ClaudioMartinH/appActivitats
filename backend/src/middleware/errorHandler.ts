import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  console.error(`[Error] ${status} - ${message}`);

  res.status(status).json({
    success: false,
    status,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

export default errorHandler;
