import {Request, Response} from "express";
import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorCode} from "../models/enums/ErrorCode";
import {ErrorMessage} from "../models/enums/ErrorMessage";

export default {
    async recordQuizAttempt(request: Request, response: Response): Promise<Response | undefined> {
        try {

            return response.status(200).send({});

        } catch (error) {
            if (error instanceof Error) {
                return new ErrorResponse(response, error.message, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            } else {
                return new ErrorResponse(response, ErrorMessage.unknownServerError, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            }
        }
    },

    async getQuizAttempts(request: Request, response: Response): Promise<Response | undefined> {
        try {

            return response.status(200).send({});

        } catch (error) {
            if (error instanceof Error) {
                return new ErrorResponse(response, error.message, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            } else {
                return new ErrorResponse(response, ErrorMessage.unknownServerError, 500, ErrorCode.serverError, new Date())
                    .sendAll();
            }
        }
    }
}