import { Request, Response } from "express";
import { Connection } from "typeorm";

export default interface Context {
  req: Request;
  res: Response;
  user: { id: string; count: number; premium: string[] } | undefined;
  connection: Connection;
}
