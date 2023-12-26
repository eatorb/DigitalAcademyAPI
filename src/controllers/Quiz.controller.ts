import {Request, Response} from "express";
import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorCode} from "../models/enums/ErrorCode";
import {ErrorMessage} from "../models/enums/ErrorMessage";
import {QuizService} from "../services/Quiz.service";
import {QuizRepository} from "../repository/Quiz.repository";
import {IQuiz} from "../models/interfaces/IQuiz";
import {isSQLInjections} from "../utils/restUtils";

export default {

    async getAllQuizzes(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const moduleId: number = +request.params.moduleId;

            if (isNaN(moduleId)) return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();

            const quizService: QuizService = new QuizService(new QuizRepository());

            const quizzes: IQuiz[] = await quizService.listQuizzes(moduleId);

            return response.status(200).send({
                success: true,
                quizzes
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

    async createQuiz(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const moduleId: number = +request.params.moduleId;
            
            const {title, description} = request.body as Partial<IQuiz>;

            if (isNaN(moduleId)) return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();

            if (!title || !description) return new ErrorResponse(response, "Invalid data", 400, ErrorCode.invalidModuleData, new Date()).sendAll();

            if (isSQLInjections(title, description)) return new ErrorResponse(response, "An unknown error has occurred.", 400, ErrorCode.unknownError, new Date()).sendAll();

            const quizData: IQuiz = {
                quizId: 0,
                moduleId: moduleId,
                title: title,
                description: description,
                createdDate: new Date(),
                updatedAt: new Date()
            }

            const quizService: QuizService = new QuizService(new QuizRepository());

            await quizService.createQuiz(moduleId, quizData);

            return response.status(200).send({
                success: "Quiz created successfully!"
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

    async getQuizById(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const moduleId: number = +request.params.moduleId;
            const quizId: number = +request.params.quizId;

            if (isNaN(moduleId) || isNaN(quizId)) return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();

            const quizService: QuizService = new QuizService(new QuizRepository());

            const quiz: IQuiz | null = await quizService.getQuiz(quizId, moduleId);

            return response.status(200).send({
                success: true,
                quiz
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

    async updateQuiz(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const moduleId: number = +request.params.moduleId;
            const quizId: number = +request.params.quizId;

            const {title, description} = request.body as Partial<IQuiz>;

            if (isNaN(moduleId) || isNaN(quizId)) return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();

            if (!title || !description) return new ErrorResponse(response, "Invalid data", 400, ErrorCode.invalidModuleData, new Date()).sendAll();

            if (isSQLInjections(title, description)) return new ErrorResponse(response, "An unknown error has occurred.", 400, ErrorCode.unknownError, new Date()).sendAll();

            const quizData: IQuiz = {
                quizId: 0,
                moduleId: moduleId,
                title: title,
                description: description,
                createdDate: new Date(),
                updatedAt: new Date()
            }

            const quizService: QuizService = new QuizService(new QuizRepository());


            await quizService.updateQuiz(quizId, quizData);


            return response.status(200).send({
                success: "Quiz updated successfully!"
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

    async deleteQuiz(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const moduleId: number = +request.params.moduleId;
            const quizId: number = +request.params.quizId;

            if (isNaN(moduleId) || isNaN(quizId)) return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();

            const quizService: QuizService = new QuizService(new QuizRepository());

            await quizService.deleteQuiz(quizId, moduleId);

            return response.status(200).send({
                success: "Quiz deleted successfully!"
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