import express, {Express, Router} from 'express';
import {connection} from '../config/Config';
import mysql from 'mysql';
import MainRouting from './main';
import {JWTMiddleware} from "../middleware/JWT.middleware";
import ModuleController from "../controllers/Module.controller";
import ContentController from "../controllers/Content.controller";
import ProgressController from "../controllers/Progress.controller";
import QuizController from "../controllers/Quiz.controller";
import QuizAttemptController from "../controllers/QuizAttempt.controller";
import AuthController from "../controllers/Auth.controller";

export default class Routing {

    app: Express;
    sql: mysql.Pool;
    config: Map<String, any> = new Map<String, any>();

    constructor(app: Express) {
        this.app = app;
        this.sql = connection;

        this.config.set('app', this.app);
        this.config.set('sql', this.sql);

        this.init();
    }

    init(): void {
        this.app.use(express.json());
        this.app.use("/v1/", new MainRouting(this.config).getRouter);

        let router: Router = express.Router();

        this.initRoutes(router);

        this.app.use("/v1", router);
    }

    initRoutes(router: Router): void  {
        this.initAuthRoutes(router);
        this.initContentRoutes(router);
        this.initModuleRoutes(router);
        this.initProgressRoutes(router);
        this.initQuizRoutes(router);
        this.initQuizAttemptRoutes(router);
    }

    initAuthRoutes(router: Router): void {
        router.post('/auth/login', AuthController.login);
        router.post('/auth/register', AuthController.register);
    }

    initModuleRoutes(router: Router): void {
        router.get('/modules', JWTMiddleware, ModuleController.getAllModules);
        router.post('/modules', JWTMiddleware, ModuleController.createModule);
        router.get('/modules/:moduleId', JWTMiddleware, ModuleController.getModuleById);
        router.put('/modules/:moduleId', JWTMiddleware, ModuleController.updateModule);
        router.delete('/modules/:moduleId', JWTMiddleware, ModuleController.deleteModule);
    }
    initContentRoutes(router: Router): void {
        router.get('/modules/:moduleId/contents', JWTMiddleware, ContentController.getAllContents);
        router.post('/modules/:moduleId/contents', JWTMiddleware, ContentController.createContent);
        router.get('/modules/:moduleId/contents/:contentId', JWTMiddleware, ContentController.getContentById);
        router.put('/modules/:moduleId/contents/:contentId', JWTMiddleware, ContentController.updateContent);
        router.delete('/modules/:moduleId/contents/:contentId', JWTMiddleware, ContentController.deleteContent);
    }

    initProgressRoutes(router: Router): void {
        router.get('/users/:userId/progress', JWTMiddleware, ProgressController.getUserProgress);
        router.get('/users/:userId/progress/:moduleId', JWTMiddleware, ProgressController.getUserProgressByModule);
        router.post('/users/:userId/progress/:moduleId', JWTMiddleware, ProgressController.updateUserProgress);
        router.get('/users/:userId/progress/summary', JWTMiddleware, ProgressController.getUserProgressSummary);
    }

    initQuizRoutes(router: Router): void {
        router.get('/modules/:moduleId/quizzes', JWTMiddleware, QuizController.getAllQuizzes);
        router.post('/modules/:moduleId/quizzes', JWTMiddleware, QuizController.createQuiz);
        router.get('/modules/:moduleId/quizzes/:quizId', JWTMiddleware, QuizController.getQuizById);
        router.put('/modules/:moduleId/quizzes/:quizId', JWTMiddleware, QuizController.updateQuiz);
        router.delete('/modules/:moduleId/quizzes/:quizId', JWTMiddleware, QuizController.deleteQuiz);
    }

    initQuizAttemptRoutes(router: Router): void {
        router.post('/users/:userId/quizzes/:quizId/attempts', JWTMiddleware, QuizAttemptController.recordQuizAttempt);
        router.get('/users/:userId/quizzes/:quizId/attempts', JWTMiddleware, QuizAttemptController.getQuizAttempts);
    }

}