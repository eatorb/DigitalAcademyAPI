import {MysqlError, Pool} from "mysql";
import {connection} from "../config/Config";
import {IUserProgress, IUserProgressSummary} from "../models/interfaces/IUserProgress";

export class ProgressRepository {
    connection: Pool;

    constructor() {
        this.connection = connection;
    }


    async findUserProgress(userId: number): Promise<IUserProgress[] | null> {
        return new Promise<IUserProgress[] | null>((resolve, reject) => {
            this.connection.query('SELECT * FROM userprogress WHERE UserID = ?', [userId], (error: MysqlError | null, results) => {
                if (error) reject(new Error('Mysql has occurred an error'));

                if (results.length === 0) resolve(null);

                const userProgress: IUserProgress[] = results.map((row: any) => row as IUserProgress);
                resolve(userProgress);
            });
        });
    }

    async findUserProgressByModule(moduleId: number, userId: number): Promise<IUserProgress | null> {
        return new Promise<IUserProgress | null>((resolve, reject): void => {
            this.connection.query('SELECT * FROM userprogress WHERE UserID = (?) AND ModuleID = (?)', [userId, moduleId], (error: MysqlError | null, results): void => {
                if (error) reject(new Error('Mysql has occurred an error'));

                if (results.length === 0) resolve(null);

                const userProgress: IUserProgress = results[0] as IUserProgress;
                resolve(userProgress);
            });
        });
    }

    async updateUserProgress(userId: number, moduleId: number, currentContentId: number, isCompleted: number, completedAt: Date | null): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.connection.query('UPDATE userprogress SET CurrentContentID = (?), isCompleted = (?), CompletedAt = (?) WHERE UserID = (?) AND ModuleID = (?)', [currentContentId, isCompleted, completedAt, userId, moduleId], (error: MysqlError | null): void => {
                if (error){
                    reject(new Error('Mysql has occured an error.'));
                } else {
                    resolve();
                }
            })
        })
    }

    async findUserProgressSummary(userId: number): Promise<IUserProgressSummary> {
        return new Promise<IUserProgressSummary>((resolve, reject): void => {

            this.connection.query('SELECT COUNT(DISTINCT ModuleID) as totalModules, COUNT(DISTINCT CASE WHEN isCompleted = 1 THEN ModuleID END) as completedModules FROM userprogress WHERE UserID = ?', [userId], (error: MysqlError | null, results): void => {
                if (error) {
                    reject(new Error('Mysql has occurred an error'));
                } else {
                    const totalModules = results[0].totalModules;
                    const completedModules = results[0].completedModules;
                    const percentageCompleted = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

                    const summary: IUserProgressSummary = {
                        totalModules,
                        completedModules,
                        percentageCompleted
                    };
                    resolve(summary);
                }
            });
        });
    }



}