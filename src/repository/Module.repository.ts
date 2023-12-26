import {MysqlError, Pool, PoolConnection} from "mysql";
import {connection} from "../config/Config";
import {IModule, IModuleContents} from "../models/interfaces/IModule";

export class ModuleRepository {

    connection: Pool;

    constructor() {
        this.connection = connection;
    }

    async findAllModules(): Promise<IModule[]> {
        return new Promise<IModule[]>((resolve, reject): void => {
            this.connection.query('SELECT * FROM modules', (error: MysqlError | null, results): void => {
                if (error) reject(new Error('Mysql has occured an error'));
                else resolve(results as IModule[]);
            })
        });
    }

    async deleteModuleById(moduleId: number): Promise<void> {
        return new Promise<void>(async (resolve, reject): Promise<void> => {

            const conn: PoolConnection = await this.getConnectionFromPool();

            try {

                await conn.beginTransaction();
                await conn.query('DELETE FROM modulecontents WHERE moduleId = ?', [moduleId]);
                await conn.query('DELETE FROM modules WHERE ModuleID = ?', [moduleId]);
                await conn.commit();

                resolve();
            } catch (error) {
                await conn.rollback();
                reject(error);
            } finally {
                conn.release();
            }

        });
    }


    async findModuleById(moduleId: number): Promise<IModule | null> {
        return new Promise<IModule | null>((resolve, reject): void => {
            this.connection.query('SELECT * FROM modules WHERE ModuleID = (?)', [moduleId], (error: MysqlError | null, results): void => {

                if (error) reject(new Error('Mysql has occured an error'));

                if (results.length === 0) {
                    resolve(null);
                    return;
                }

                const module: IModule = {
                    moduleId: results[0].ModuleID,
                    title: results[0].Title,
                    description: results[0].Description,
                    difficultyLevel: results[0].DifficultyLevel,
                    duration: results[0].Duration,
                    prerequisites: results[0].Prerequisites,
                    createdAt: results[0].CreatedAt,
                    updatedAt: results[0].UpdatedAt,
                    contents: []
                };

                results.forEach((row: IModuleContents): void => {
                    if (row.contentId != null) {
                        module.contents!.push({
                            contentId: row.contentId,
                            moduleId: row.moduleId,
                            contentType: row.contentType,
                            content: row.content,
                            sequence: row.sequence
                        });
                    }
                });

                resolve(module);
            })
        });
    }

    private getConnectionFromPool(): Promise<PoolConnection> {
        return new Promise((resolve, reject): void => {
            this.connection.getConnection((err: MysqlError | null, connection: PoolConnection): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });
    }

    async insertModuleData(title: string, description: string, difficultyLevel: string, duration: number, prerequisites: string): Promise<number> {
        return new Promise<number>((resolve, reject): void => {
            this.connection.query('INSERT INTO modules (Title, Description, DifficultyLevel, Duration, Prerequisites) VALUES (?, ?, ?, ?, ?)', [title, description, difficultyLevel, duration, prerequisites], (error: MysqlError | null, result): void => {
                    if (error) reject(new Error('Mysql has occured an error'));
                    else resolve(result.insertId); // we need to retrieve the id of the inserted module
                })
        });
    }

    async insertModuleContent(moduleId: number, contentType: string, content: string, sequence: number): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.connection.query('INSERT INTO modulecontents (ModuleID, ContentType, Content, Sequence) VALUES (?, ?, ?, ?)', [moduleId, contentType, content, sequence], (error: MysqlError | null): void => {
                if (error) reject(new Error('Mysql has occured an error'));
                else resolve();
            })
        })
    }

    async updateModuleData(moduleId: number, title?: string, description?: string, difficultyLevel?: string, duration?: number, prerequisites?: string): Promise<void> {
        return new Promise<void>((resolve, reject): void => {

            const fieldsToUpdate = {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(difficultyLevel !== undefined && { difficultyLevel }),
                ...(duration !== undefined && { duration }),
                ...(prerequisites !== undefined && { prerequisites })
            };

            if (Object.keys(fieldsToUpdate).length === 0) {
                reject(new Error("No fields provided for update"));
                return;
            }

            const setClause = Object.keys(fieldsToUpdate)
                .map(key => `${key} = ?`)
                .join(', ');
            const query = `UPDATE modules SET ${setClause} WHERE ModuleID = ?`;

            const values = [...Object.values(fieldsToUpdate), moduleId];

            this.connection.query(query, values, (error: MysqlError | null) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }


}