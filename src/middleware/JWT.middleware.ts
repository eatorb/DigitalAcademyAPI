import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {jwtSecret} from "../config/Config";
import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorCode} from "../models/enums/ErrorCode";
import {ErrorMessage} from "../models/enums/ErrorMessage";

interface JWTPayload {
    email: string;
    userId: number;
    keyid: string;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

export const JWTMiddleware = (requiredKeyid?: string) => async (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return new ErrorResponse(response, ErrorMessage.tokenMissing, 403, ErrorCode.tokenMissing, new Date()).sendAll();

    try {
        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

        if (requiredKeyid && decoded.keyid !== requiredKeyid) {
            return new ErrorResponse(response, ErrorMessage.keyIdMissing, 403, ErrorCode.tokenInvalid, new Date()).sendAll();
        }

        request.user = decoded;
        next();
    } catch (error) {
        return new ErrorResponse(response, ErrorMessage.tokenInvalid, 403, ErrorCode.tokenInvalid, new Date()).sendAll();
    }
};