import {IQuizQuestion} from "./IQuizQuestion";

export interface IQuiz {
    quizId: number;
    moduleId: number;
    title: string;
    description: string;
    createdDate: Date;
    updatedAt: Date;
    questions?: IQuizQuestion[];
}