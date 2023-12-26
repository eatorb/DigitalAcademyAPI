export interface IQuizQuestion {
    questionId?: number;
    quizId: number;
    question: string;
    answerOptions: string[];
    correctAnswer: string;
}