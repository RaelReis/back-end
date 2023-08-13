import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = await req.cookies.token;

  const token = bearer?.split(" ")[1];

  try {
    const { sub } = (await verify(token, process.env.JWT_SECRET as string)) as { sub: string };
    req.user = { id: sub };
  } catch (error) {
    req.user = { id: null };
  }

  next();
};


