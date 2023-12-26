import {ModuleRepository} from "../repository/Module.repository";
import {IModule} from "../models/interfaces/IModule";

export class ModuleService {

    private moduleRepository: ModuleRepository;
    constructor(moduleRepository: ModuleRepository) {
        this.moduleRepository = moduleRepository;
    }

    async getAllModules(): Promise<IModule[]> {
        return await this.moduleRepository.findAllModules();
    }

    async getModuleById(moduleId: number): Promise<IModule | null> {
        return await this.moduleRepository.findModuleById(moduleId);
    }

    async createModule(title: string, description: string, difficultyLevel: string, duration: number, prerequisites: string): Promise<number> {
        return await this.moduleRepository.insertModuleData(title, description, difficultyLevel, duration, prerequisites);
    }

    async createModuleContent(moduleId: number, contentType: string, content: string, sequence: number): Promise<void> {
        return await this.moduleRepository.insertModuleContent(moduleId, contentType, content, sequence);
    }

    async updateModule(moduleId: number, title?: string, description?: string, difficultyLevel?: string, duration?: number, prerequisites?: string): Promise<void> {
        return await this.moduleRepository.updateModuleData(moduleId, title, description, difficultyLevel, duration, prerequisites);
    }

    async deleteModule(moduleId: number): Promise<void> {
        return await this.moduleRepository.deleteModuleById(moduleId);
    }
}