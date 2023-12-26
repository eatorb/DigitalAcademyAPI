import {Request, Response} from "express";
import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorCode} from "../models/enums/ErrorCode";
import {ErrorMessage} from "../models/enums/ErrorMessage";
import {ContentService} from "../services/Content.service";
import {ContentRepository} from "../repository/Content.repository";
import {IModuleContents} from "../models/interfaces/IModule";
import {isSQLInjections} from "../utils/restUtils";

export default {

    // List all contents within a module.
    async getAllContents(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const moduleId: number = +request.params.moduleId;

            if (isNaN(moduleId)) return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();

            const contentService: ContentService = new ContentService(new ContentRepository());

            const contents: IModuleContents[] = await contentService.getAllContents(moduleId);

            return response.status(200).send({
                success: true,
                contents
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

    // Add new content or a lesson to a module. // TODO: add admin check
    async createContent(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const moduleId: number = +request.params.moduleId;

            if (isNaN(moduleId)) return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();

            const {contentType, content, sequence} = request.body as IModuleContents;

            if (!contentType || !content || !sequence) return new ErrorResponse(response, "No content data provided.", 400, ErrorCode.invalidContentData, new Date()).sendAll();

            if (isSQLInjections(contentType, content)) return new ErrorResponse(response, "An unknown error has occurred.", 400, ErrorCode.unknownError, new Date()).sendAll();

            const contentService: ContentService = new ContentService(new ContentRepository());

            await contentService.createContent(moduleId, contentType, content, sequence);

            return response.status(200).send({
                success: "Module content created successfully!"
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

    // Retrieve a specific lesson or content item.
    async getContentById(request: Request, response: Response): Promise<Response | undefined> {
        try {
            const moduleId: number = +request.params.moduleId;
            const contentId: number = +request.params.contentId;

            if (isNaN(moduleId)) {
                return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();
            } else if (isNaN(contentId)) {
                return new ErrorResponse(response, ErrorMessage.invalidContentId, 400, ErrorCode.invalidContentId, new Date()).sendAll();
            }

            const contentService: ContentService = new ContentService(new ContentRepository());
            const content: IModuleContents | null = await contentService.getContentById(moduleId, contentId);

            if (!content) return new ErrorResponse(response, ErrorMessage.contentNotFound, 404, ErrorCode.contentNotFound, new Date()).sendAll();

            return response.status(200).send({
                success: true,
                content
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

    // Update a specific lesson or content item. // TODO: add admin check
    async updateContent(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const moduleId: number = +request.params.moduleId;
            const contentId: number = +request.params.contentId;

            if (isNaN(moduleId)) {
                return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();
            } else if (isNaN(contentId)) {
                return new ErrorResponse(response, ErrorMessage.invalidContentId, 400, ErrorCode.invalidContentId, new Date()).sendAll();
            }

            const {contentType, content, sequence} = request.body as Partial<IModuleContents>;

            if (!contentType || !content || !sequence) return new ErrorResponse(response, "No content data provided.", 400, ErrorCode.invalidContentData, new Date()).sendAll();

            if (isSQLInjections(contentType, content)) return new ErrorResponse(response, "An unknown error has occurred.", 400, ErrorCode.unknownError, new Date()).sendAll();

            const contentService: ContentService = new ContentService(new ContentRepository());
            await contentService.updateContent(moduleId, contentId, contentType, content, sequence);

            return response.send({
                success: "Module content updated successfully!"
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

    // Remove a lesson or content item from the module. // TODO: add admin check
    async deleteContent(request: Request, response: Response): Promise<Response | undefined> {
        try {

            const moduleId: number = +request.params.moduleId;
            const contentId: number = +request.params.contentId;

            if (isNaN(moduleId)) {
                return new ErrorResponse(response, ErrorMessage.invalidModuleId, 400, ErrorCode.invalidModuleId, new Date()).sendAll();
            } else if (isNaN(contentId)) {
                return new ErrorResponse(response, ErrorMessage.invalidContentId, 400, ErrorCode.invalidContentId, new Date()).sendAll();
            }

            const contentService: ContentService = new ContentService(new ContentRepository());
            await contentService.deleteContent(moduleId, contentId);

            return response.send({
                success: "Content deleted successfully!"
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