export interface IUserQuizAttempt {
    attemptId: number;
    userId: number;
    quizId: number;
    score: number;
    attemptedAt: Date;
}