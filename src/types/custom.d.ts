declare namespace Express {
  interface Request {
    user?: { id: string; count?: number; premium?: string[] } | undefined;
  }
}
