import {ContentRepository} from "../repository/Content.repository";
import {IModuleContents} from "../models/interfaces/IModule";

export class ContentService {
    private contentRepository: ContentRepository;

    constructor(contentRepository: ContentRepository) {
        this.contentRepository = contentRepository;
    }

    async getAllContents(moduleId: number): Promise<IModuleContents[]> {
        return this.contentRepository.findAllContents(moduleId);
    }

    async getContentById(moduleId: number, contentId: number): Promise<IModuleContents | null> {
        return this.contentRepository.findContentById(moduleId, contentId);
    }

    async createContent(moduleId: number, contentType: string, content: string, sequence: number): Promise<void> {
        return this.contentRepository.insertContentData(moduleId, contentType, content, sequence);
    }

    async deleteContent(moduleId: number, contentId: number): Promise<void> {
        return this.contentRepository.deleteContent(moduleId, contentId);
    }

    async updateContent(moduleId: number, contentId: number, contentType?: string, content?: string, sequence?: number): Promise<void> {
        return this.contentRepository.updateContentData(moduleId, contentId, contentType, content, sequence);
    }
}