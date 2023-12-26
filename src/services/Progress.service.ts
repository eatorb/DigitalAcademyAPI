import {ProgressRepository} from "../repository/Progress.repository";
import {IUserProgress, IUserProgressSummary} from "../models/interfaces/IUserProgress";

export class ProgressService {
    private progressRepository: ProgressRepository;

    constructor(progressRepository: ProgressRepository) {
        this.progressRepository = progressRepository;
    }
    async getUserProgress(userId: number): Promise<IUserProgress[] | null> {
        return this.progressRepository.findUserProgress(userId);
    }

    async getUserProgressByModule(moduleId: number, userId: number): Promise<IUserProgress | null> {
        return this.progressRepository.findUserProgressByModule(moduleId, userId);
    }

    async updateProgress(userId: number, moduleId: number, currentContentId: number, isCompleted: number, completedAt: Date | null): Promise<void> {
        return this.progressRepository.updateUserProgress(userId, moduleId, currentContentId, isCompleted, completedAt);
    }

    async getUserProgressSummary(userId: number): Promise<IUserProgressSummary> {
        return this.progressRepository.findUserProgressSummary(userId);
    }
}