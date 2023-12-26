import {MysqlError, Pool} from "mysql";
import mysql from "../config/Config";
import {IQuiz} from "../models/interfaces/IQuiz";

export class QuizRepository {

    private connection: Pool;
    constructor() {
        this.connection = mysql.connection;
    }
    async getQuizzesByModule(moduleId: number): Promise<IQuiz[]> {
        return new Promise<IQuiz[]>((resolve, reject): void => {
            this.connection.query('SELECT * FROM quizzes WHERE ModuleID = (?)', [moduleId], (error: MysqlError | null, results): void => {
                if (error) reject(new Error('Mysql has occured an error'));
                else resolve(results as IQuiz[]);
            });
        });
    }

    async createQuiz(moduleId: number, quizData: IQuiz): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.connection.query('INSERT INTO quizzes (ModuleID, Title, Description, CreatedDate, UpdatedAt) VALUES (?, ?, ?, ?, ?)', [moduleId, quizData.title, quizData.description, quizData.createdDate, quizData.updatedAt], (error: MysqlError | null): void => {
                if (error) reject(new Error('Mysql has occured an error'));
                else resolve();
            });
        });
    }

    async getQuizById(quizId: number, moduleId: number): Promise<IQuiz | null> {
        return new Promise<IQuiz | null>((resolve, reject): void => {
            this.connection.query('SELECT * FROM quizzes WHERE QuizID = (?) AND ModuleID = (?)', [quizId, moduleId], (error: MysqlError | null, results) => {
                if (error) reject(new Error('Mysql has occured an error'));
                else if (results.length === 0) resolve(null);
                else resolve(results[0] as IQuiz);
            });
        });
    }

    async updateQuiz(quizId: number, quizData: IQuiz): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.connection.query('UPDATE quizzes SET Title = (?), Description = (?), UpdatedAt = (?) WHERE QuizID = (?)', [quizData.title, quizData.description, quizData.updatedAt, quizId], (error: MysqlError | null): void => {
                if (error) reject(new Error('Mysql has occured an error'));
                else resolve();
            })
        })
    }

    async deleteQuiz(quizId: number, moduleId: number): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.connection.query('DELETE FROM quizzes WHERE QuizID = (?) AND ModuleID = (?)', [quizId, moduleId], (error: MysqlError | null): void => {
                if (error) reject(new Error('Mysql has occured an error'));
                else resolve();
            })
        })
    }
}