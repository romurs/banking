/* eslint-disable @typescript-eslint/no-explicit-any */
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

if (!SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export function generateToken(payload: Record<string, any>): string {
  return jwt.sign(payload, SECRET, {
    expiresIn: "15m",
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch (e) {
    console.error(
      "Token verification failed:",
      e instanceof Error ? e.message : String(e),
    );
    return null;
  }
}
