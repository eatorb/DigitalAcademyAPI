import bcrypt from "bcrypt";
import {UserRepository} from "../repository/User.repository";
import {jwtSecret} from "../config/Config";
import jwt from "jsonwebtoken";
import {IUser} from "../models/interfaces/IUser";
import {PasswordValidationService} from "./PasswordValidation.service";
export class UserService {

    private userRepository: UserRepository;
    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async registerUser(email: string, password: string, createdAt: string, role: string): Promise<any> {

        if (await this.userRepository.findByEmail(email)) throw new Error('User already exists.');

        // validate the password using regex
        PasswordValidationService.validate(password);

        const hashedPassword: string = await bcrypt.hash(password, 10);

        await this.userRepository.createUser(email, hashedPassword, createdAt, role);
        const token: string = jwt.sign({ email: email}, jwtSecret, { expiresIn: '1h' });

        return { token };
    }

    async loginUser(email: string, password: string): Promise<{ token: string }> {
        const user: IUser | null = await this.userRepository.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) throw new Error('Invalid credentials');

        const token: string = jwt.sign({ email: user.email, userId: user.userID }, jwtSecret, { expiresIn: '30d' });

        return { token };
    }
}