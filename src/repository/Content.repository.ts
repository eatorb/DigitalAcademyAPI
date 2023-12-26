import {MysqlError, Pool} from "mysql";
import {connection} from "../config/Config";
import {IModuleContents} from "../models/interfaces/IModule";

export class ContentRepository {

    connection: Pool;

    constructor() {
        this.connection = connection;
    }

    async findAllContents(moduleId: number): Promise<IModuleContents[]> {
        return new Promise<IModuleContents[]>((resolve, reject): void => {
            this.connection.query('SELECT * FROM modulecontents WHERE ModuleID = (?)', [moduleId], (error: MysqlError | null, results): void => {
                if (error) reject(new Error('Mysql has occured an error'));
                else resolve(results as IModuleContents[]);
            });
        });
    }

    async findContentById(moduleId: number, contentId: number): Promise<IModuleContents | null> {
        return new Promise<IModuleContents | null>((resolve, reject): void => {
            this.connection.query('SELECT * FROM modulecontents WHERE ModuleID = (?) AND ContentID = (?)', [moduleId, contentId], (error: MysqlError | null, results) => {
                if (error) reject(new Error('Mysql has occured an error'));
                else resolve(results as IModuleContents || null);
            });
        })
    }

    async insertContentData(moduleId: number, contentType: string, content: string, sequence: number): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.connection.query('INSERT INTO modulecontents (ModuleID, ContentType, Content, Sequence) VALUES (?, ?, ?, ?)', [moduleId, contentType, content, sequence], (error: MysqlError | null): void => {
                if (error) reject(new Error('Mysql has occured an error'));
                else resolve();
            });
        });
    }

    async deleteContent(moduleId: number, contentId: number): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            this.connection.query('DELETE FROM modulecontents WHERE ModuleID = (?) AND ContentID = (?)', [moduleId, contentId], (error: MysqlError | null): void => {
                if (error) reject(new Error('Mysql has occured an error'));
                else resolve();
            })
        });
    }

    async updateContentData(moduleId: number, contentId: number, contentType?: string, content?: string, sequence?: number): Promise<void> {
        return new Promise<void>((resolve, reject): void => {

            const fieldsToUpdate = {
                ...(contentType !== undefined && { contentType }),
                ...(content !== undefined && { content }),
                ...(sequence !== undefined && { sequence })
            };

            if (Object.keys(fieldsToUpdate).length === 0) {
                reject(new Error("No fields provided for update"));
                return;
            }

            const setClause = Object.keys(fieldsToUpdate)
                .map(key => `${key} = ?`)
                .join(', ');
            const query = `UPDATE modulecontents SET ${setClause} WHERE ModuleID = ? AND ContentID = ?`;

            const values = [...Object.values(fieldsToUpdate), moduleId, contentId];

            this.connection.query(query, values, (error: MysqlError | null) => {
                if (error) reject(error);
                else resolve();
            });
        });
    }

}