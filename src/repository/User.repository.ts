import {MysqlError, Pool} from "mysql";
import mysql from "../config/Config";
import {IUser} from "../models/interfaces/IUser";

export class UserRepository {
    private connection: Pool;
    constructor() {
        this.connection = mysql.connection;
    }
    async createUser(email: string, password: string, createdAt: string, role: string): Promise<void> {
        return new Promise<void>((resolve, reject: (reason?: any) => void): void => {
            this.connection.query('INSERT INTO user (`email`, `password`, `CreatedAt`, `Role` ) VALUES (?, ?, ?, ?)', [email, password, createdAt, role], (error: MysqlError | null): void => {
                if (error) reject(new Error('Mysql has occured an error'));
                else resolve();
            });
        });
    }
    async findByEmail(email: string): Promise<IUser | null> {
        return new Promise((resolve, reject): void => {
            this.connection.query('SELECT * FROM user WHERE email = (?)', [email],  (error: MysqlError | null, results): void => {
                if (error) {
                    reject(new Error('Mysql has occured an error'));
                } else {
                    const user = results.length > 0 ? results[0] : null;
                    resolve(user);
                }
            })
        });
    }
}