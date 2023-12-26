import {ICredentials} from "../models/interfaces/ICredentials";
import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorMessage} from "../models/enums/ErrorMessage";
import {ErrorCode} from "../models/enums/ErrorCode";
import {isSQLInjections} from "../utils/restUtils";
import {UserService} from "../services/User.service";
import {UserRepository} from "../repository/User.repository";
import {Request, Response} from "express";

export default {
    async register(request: Request, response: Response): Promise<Response | undefined> {
        try {
            const {email, password}: ICredentials = request.body;

            if (!email || !password) return new ErrorResponse(response, ErrorMessage.serverError, 400, ErrorCode.payloadUndefined, new Date()).sendAll();

            if (isSQLInjections(email, password)) return new ErrorResponse(response, "An unknown error has occurred.", 400, ErrorCode.unknownError, new Date()).sendAll();

            let userService: UserService = new UserService(new UserRepository());

            const token = await userService.registerUser(email, password, new Date().toISOString().slice(0, 19).replace('T', ' '), 'default');

            return response.status(200).send({
                success: 'You have been successfully registered.',
                token: token
            });

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

    async login(request: Request, response: Response): Promise<Response | undefined> {
        try {
            const {email, password}: ICredentials = request.body;

            if (!email || !password) return new ErrorResponse(response, ErrorMessage.serverError, 400, ErrorCode.payloadUndefined, new Date()).sendAll();

            if (isSQLInjections(email, password)) return new ErrorResponse(response, "An unknown error has occurred.", 400, ErrorCode.unknownError, new Date()).sendAll();

            const userService: UserService = new UserService(new UserRepository());

            const { token } = await userService.loginUser(email, password);

            return response.send({
                success: 'successfully logged in!',
                token: token
            });

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