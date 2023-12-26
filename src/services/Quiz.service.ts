import {QuizRepository} from "../repository/Quiz.repository";
import {IQuiz} from "../models/interfaces/IQuiz";

export class QuizService {

    private quizRepository: QuizRepository;
    constructor(quizRepository: QuizRepository) {
        this.quizRepository = quizRepository;
    }
    async listQuizzes(moduleId: number): Promise<IQuiz[]> {
        return this.quizRepository.getQuizzesByModule(moduleId);
    }

    async createQuiz(moduleId: number, quizData: IQuiz): Promise<void> {
        return this.quizRepository.createQuiz(moduleId, quizData);
    }

    async getQuiz(quizId: number, moduleId: number): Promise<IQuiz | null> {
        return this.quizRepository.getQuizById(quizId, moduleId);
    }

    async updateQuiz(quizId: number, quizData: IQuiz): Promise<void> {
        await this.quizRepository.updateQuiz(quizId, quizData);
    }

    async deleteQuiz(quizId: number, moduleId: number): Promise<void> {
        await this.quizRepository.deleteQuiz(quizId, moduleId);
    }

}