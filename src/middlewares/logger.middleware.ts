import { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log("➡️ Incoming Request:");
  console.log(`${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  const oldSend = res.send;
  res.send = function (data) {
    console.log("⬅️ Response Body:", data);
    // @ts-ignore
    return oldSend.apply(res, arguments);
  };

  next();
};
