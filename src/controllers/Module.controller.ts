import {Request, Response} from "express";
import {ModuleService} from "../services/Module.service";
import {ModuleRepository} from "../repository/Module.repository";
import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorMessage} from "../models/enums/ErrorMessage";
import {ErrorCode} from "../models/enums/ErrorCode";
import {IModule} from "../models/interfaces/IModule";
import {isSQLInjections} from "../utils/restUtils";

export default {

    // TODO: Can include query parameters to filter by difficulty, topic, etc.
    async getAllModules(request: Request, response: Response): Promise<Response | undefined> {
        try {
            const moduleService: ModuleService = new ModuleService(new ModuleRepository());
            const modules: IModule[] = await moduleService.getAllModules();

            return response.status(200).send({
                success: true,
                modules
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

    async getModuleById(request: Request, response: Response): Promise<Response | undefined> {
        try {
            const moduleId: number = +request.params.moduleId;

            if (isNaN(moduleId)) return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();

            const moduleService: ModuleService = new ModuleService(new ModuleRepository());
            const module: IModule | null = await moduleService.getModuleById(moduleId);

            if (!module) return new ErrorResponse(response, ErrorMessage.moduleNotFound, 404, ErrorCode.moduleNotFound, new Date()).sendAll();

            return response.status(200).send({
                success: true,
                module
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

    // TODO: make an admin restriction
    async createModule(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const { title, description, difficultyLevel, duration, prerequisites, contents } = request.body as IModule;

            if (!title || !description || !difficultyLevel || isNaN(duration)) return new ErrorResponse(response, "Invalid module data", 400, ErrorCode.invalidModuleData, new Date()).sendAll();

            // check for sql injection
            if (isSQLInjections(title, description, difficultyLevel, prerequisites)) return new ErrorResponse(response, "An unknown error has occurred.", 400, ErrorCode.unknownError, new Date()).sendAll();

            // check if the array is in valid format
            if (!Array.isArray(contents)) return new ErrorResponse(response, "Invalid contents format", 400, ErrorCode.invalidContents, new Date()).sendAll();

            const moduleService: ModuleService = new ModuleService(new ModuleRepository());

            const moduleId: number = await moduleService.createModule(title, description, difficultyLevel, duration, prerequisites);

            for (const content of contents) {
                // Validate each content item
                if (!content.contentType || !content.content || typeof content.sequence !== 'number') return new ErrorResponse(response, "Invalid content item", 400, ErrorCode.invalidContentItem, new Date()).sendAll();

                // check for sql injection
                if (isSQLInjections(content.contentType, content.content)) return new ErrorResponse(response, "An unknown error has occurred.", 400, ErrorCode.unknownError, new Date()).sendAll();

                await moduleService.createModuleContent(moduleId, content.contentType, content.content, content.sequence);
            }

            return response.status(200).send({
                success: "Module created successfully!"
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


    // TODO: make an admin restriction
    async updateModule(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const moduleId: number = +request.params.moduleId;

            if (isNaN(moduleId)) return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();

            const { title, description, difficultyLevel, duration, prerequisites } = request.body as Partial<IModule>;

            if (!title && !description && !difficultyLevel && !duration && !prerequisites) return new ErrorResponse(response, "No update data provided", 400, ErrorCode.invalidModuleData, new Date()).sendAll();

            if (isSQLInjections(<string>title, <string>description, <string>difficultyLevel, <string>prerequisites)) return new ErrorResponse(response, "An unknown error has occurred.", 400, ErrorCode.unknownError, new Date()).sendAll();

            const moduleService: ModuleService = new ModuleService(new ModuleRepository());

            await moduleService.updateModule(moduleId, title, description, difficultyLevel, duration, prerequisites);

            return response.status(200).send({success: "Module updated successfully!"});

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


    // TODO: make an admin restriction
    async deleteModule(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const moduleId: number = +request.params.moduleId;

            if (isNaN(moduleId)) return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();

            const moduleService: ModuleService = new ModuleService(new ModuleRepository());
            await moduleService.deleteModule(moduleId);

            return response.status(200).send({
                success: "Module deleted successfully!"
            });

        } catch(error){
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