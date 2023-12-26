import {Response} from "express";
import {captchaSecret} from "../config/Config";
import axios from "axios";
import {ErrorResponse} from "../handlers/ErrorHandler";
import {ErrorCode} from "../models/enums/ErrorCode";

export class RecaptchaService {
    response: Response;
    secret: string;
    recaptchaResponse: string | undefined;
    constructor(recaptchaResponse: string | undefined, response: Response) {
        this.response = response;
        this.secret = captchaSecret;
        this.recaptchaResponse = recaptchaResponse;
    }

    async verifyRecaptcha(): Promise<void> {
        return new Promise<void>((resolve): void => {
            axios.post(
                'https://www.google.com/recaptcha/api/siteverify',
                `secret=${this.secret}&response=${this.recaptchaResponse}`,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' } }
            )
                .then(res => {
                    if (res.data.success !== true) {
                        return new ErrorResponse(this.response, 'reCAPTCHA verification failed!', 403, ErrorCode.recaptchaFailed, new Date()).sendAll();
                    } else {
                        resolve();
                    }
                });
        });
    }
}