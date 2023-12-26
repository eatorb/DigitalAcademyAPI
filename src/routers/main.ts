import Routing from "../models/Routing";
import express from "express";
export default class MainRouting extends Routing {

    router: express.Router;
    startTime: number;

    constructor(props:any) {
        super(props);

        this.router = this.newRouter();

        this.startTime = Date.now();

        this.init();
    }
    init(): void {
        this.router.all('/', (request, result, next) => {

            const uptime: string = this.formatUptime(process.uptime());

            return result.send({
                status: "OK",
                message: "DigitalAcademy API is up and running.",
                uptime: uptime
            });
        });
    }

    get getRouter(): express.Router {
        return this.router;
    }

    formatUptime(uptimeInSeconds: number): string {
        const pad = (s: number) => (s < 10 ? '0' : '') + s;
        const days = Math.floor(uptimeInSeconds / (24 * 60 * 60));
        const hours = Math.floor(uptimeInSeconds % (24 * 60 * 60) / (60 * 60));
        const minutes = Math.floor(uptimeInSeconds % (60 * 60) / 60);
        const seconds = Math.floor(uptimeInSeconds % 60);

        return `${pad(days)}D:${pad(hours)}H:${pad(minutes)}M:${pad(seconds)}S`;
    }
}
