import {Pool} from "mysql";
import mysql from "../config/Config";

export class QuizAttemptRepository{
    private connection: Pool;
    constructor() {
        this.connection = mysql.connection;
    }

}