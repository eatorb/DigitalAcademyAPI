import {PasswordErrorMessage} from "../models/enums/ErrorMessage";

export class PasswordValidationService {
    static validate(password: string): void {
        if (password.length < 9) {
            throw new Error(PasswordErrorMessage.invalidLenght);
        }

        if (!/\d/.test(password)) {
            throw new Error(PasswordErrorMessage.oneNumber);
        }

        if (!/[A-Z]/.test(password)) {
            throw new Error(PasswordErrorMessage.upperCaseLetter);
        }

        if (!/\W/.test(password)) {
            throw new Error(PasswordErrorMessage.specialCharacter);
        }
    }
}