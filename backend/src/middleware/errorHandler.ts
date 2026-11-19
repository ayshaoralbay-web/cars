import { Request, Response, NextFunction } from "express";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "API бағыты табылмады (404)" });
}

export function globalErrorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error("Server Error:", err);
  res.status(500).json({ error: err.message || "Серверлік қате шықты" });
}
