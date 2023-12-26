import {Request, Response} from "express";
import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorMessage} from "../models/enums/ErrorMessage";
import {ErrorCode} from "../models/enums/ErrorCode";
import {ProgressService} from "../services/Progress.service";
import {ProgressRepository} from "../repository/Progress.repository";
import {IUserProgress, IUserProgressSummary} from "../models/interfaces/IUserProgress";

export default {

    async getUserProgress(request: Request, response: Response): Promise<Response | undefined> {
        try {
            if (!request.user) return new ErrorResponse(response, ErrorMessage.unauthorizedUser, 401, ErrorCode.unauthorizedUser, new Date()).sendAll();

            // user id extracted from jwt token
            const tokenUserId: number = request.user.userId;

            // user id extracted from params
            const userId: number = +request.params.userId;

            if (isNaN(userId)) return new ErrorResponse(response, ErrorMessage.invalidUserId, 400, ErrorCode.invalidUserId, new Date()).sendAll();

            if (userId !== tokenUserId) return new ErrorResponse(response, ErrorMessage.invalidUserId, 401, ErrorCode.invalidUserId, new Date()).sendAll();

            const progressService: ProgressService = new ProgressService(new ProgressRepository());

            const userProgress: IUserProgress[] | null = await progressService.getUserProgress(userId);

            return response.status(200).send({
                success: true,
                userProgress
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

    async getUserProgressByModule(request: Request, response: Response): Promise<Response | undefined> {
        try {
            if (!request.user) return new ErrorResponse(response, ErrorMessage.unauthorizedUser, 401, ErrorCode.unauthorizedUser, new Date()).sendAll();

            // user id extracted from jwt token
            const tokenUserId: number = request.user.userId;

            // user id extracted from params
            const userId: number = +request.params.userId;

            const moduleId: number = +request.params.moduleId;

            if (isNaN(userId) || isNaN(moduleId)) return new ErrorResponse(response, ErrorMessage.invalidUserId, 400, ErrorCode.invalidUserId, new Date()).sendAll();

            if (userId !== tokenUserId) return new ErrorResponse(response, ErrorMessage.invalidUserId, 401, ErrorCode.invalidUserId, new Date()).sendAll();

            const progressService: ProgressService = new ProgressService(new ProgressRepository());
            const userProgress: IUserProgress | null = await progressService.getUserProgressByModule(moduleId, userId);

            return response.status(200).send({
                success: true,
                userProgress
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

    async updateUserProgress(request: Request, response: Response): Promise<Response | undefined> {
        try {
            const userId: number = +request.params.userId;
            const moduleId: number = +request.params.moduleId;
            const { currentContentId, isCompleted } = request.body as Partial<IUserProgress>;

            if (isNaN(userId) || isNaN(moduleId) || !currentContentId) {
                return new ErrorResponse(response, "Invalid Input Data", 400, ErrorCode.invalidInputData, new Date()).sendAll();
            }

            const progressService: ProgressService = new ProgressService(new ProgressRepository());
            const existingProgress: IUserProgress | null = await progressService.getUserProgressByModule(userId, moduleId);

            if (!existingProgress) {
                return new ErrorResponse(response, "Progress not found", 404, ErrorCode.progressNotFound, new Date()).sendAll();
            }

            const isCompletedValue:number = isCompleted !== undefined ? isCompleted : existingProgress.isCompleted;

            let completedAt: Date | null = existingProgress.isCompleted ? existingProgress.completedAt : null;

            if (isCompletedValue) completedAt = new Date();

            await progressService.updateProgress(userId, moduleId, currentContentId, isCompletedValue, completedAt);

            return response.status(200).send({
                success: true,
                message: "User progress updated successfully"
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

    async getUserProgressSummary(request: Request, response: Response): Promise<Response | undefined> {
        try {

            if (!request.user) return new ErrorResponse(response, ErrorMessage.unauthorizedUser, 401, ErrorCode.unauthorizedUser, new Date()).sendAll();

            const userId: number = +request.params.userId;

            if (isNaN(userId)) return new ErrorResponse(response, ErrorMessage.invalidUserId, 400, ErrorCode.invalidUserId, new Date()).sendAll();

            const progressService: ProgressService = new ProgressService(new ProgressRepository());

            const progressSummary: IUserProgressSummary  = await progressService.getUserProgressSummary(userId);

            return response.send({
                success: true,
                progressSummary
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