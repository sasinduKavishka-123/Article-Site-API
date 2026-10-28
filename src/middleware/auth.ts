import { NextFunction, Request, Response } from "express";
import { verifyAccessToken, AuthPayload } from "../util/jwt";

export interface AuthRequest extends Request {
    user?: AuthPayload
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Malformed or missing token" })
    }

    const tocken = authHeader.split(" ")[1]

    try {
        req.user = verifyAccessToken(tocken)
        next()
    }
    catch (err) {
        res.status(401).json({ message: "Invalid or expired token" })
    }
}
