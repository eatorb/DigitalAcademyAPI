export interface IUserProgress {
    progressId: number,
    userId: number,
    moduleId: number,
    currentContentId: number,
    isCompleted: number,
    startedAt: Date,
    completedAt: Date
}

export interface IUserProgressSummary {
    totalModules: number;
    completedModules: number;
    percentageCompleted: number;
}