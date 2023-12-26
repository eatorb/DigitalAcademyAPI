export interface IModule {
    moduleId: number;
    title: string;
    description: string;
    difficultyLevel: string;
    duration: number;
    prerequisites: string;
    createdAt: Date;
    updatedAt: Date;
    contents?: IModuleContents[];
}

export interface IModuleContents {
    contentId?: number;
    moduleId?: number;
    contentType?: string;
    content?: string;
    sequence?: number;
}
