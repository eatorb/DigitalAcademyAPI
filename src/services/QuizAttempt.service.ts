import {QuizAttemptRepository} from "../repository/QuizAttempt.repository";
import {IUserQuizAttempt} from "../models/interfaces/IUserQuizAttempt";

export class QuizAttemptService{

    private quizAttemptRepository: QuizAttemptRepository;
    constructor(quizAttemptRepository: QuizAttemptRepository) {
        this.quizAttemptRepository = quizAttemptRepository;
    }

    async recordAttempt(userId: number, quizId: number, attemptData: any): Promise<void> {

    }
    /*async getAttempts(): Promise<IUserQuizAttempt[]> {
        return;
    }
*/
}