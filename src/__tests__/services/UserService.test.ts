import { UserRepository } from "../../repository/User.repository";
import { UserService } from "../../services/User.service";
import bcrypt from 'bcrypt';
import {IUser} from "../../models/interfaces/IUser";

jest.mock('../repository/UserRepository');
jest.mock('bcrypt');

describe('UserService', () => {
    let userService: UserService;
    let userRepositoryMock: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepositoryMock = new UserRepository() as any;
        userService = new UserService(userRepositoryMock);
    });

    test('should register a user', async (): Promise<void> => {
        // Arrange
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        userRepositoryMock.findByEmail.mockResolvedValue(null);
        userRepositoryMock.createUser.mockResolvedValue(undefined);

        // Act
        const result = await userService.registerUser('test@example.com', 'TestPassword123!', new Date().toISOString(), 'default');

        // Assert
        expect(result).toHaveProperty('token');
        expect(userRepositoryMock.createUser).toHaveBeenCalledWith(
            'test@example.com', 'hashedPassword', expect.any(String), 'default'
        );
    });

    test('should not register a user with previously used email', async (): Promise<void> => {
        const existingUser: IUser = {
            email: 'test@example.com',
            password: 'existingUserPassword',
            userID: 1,
            createdAt: new Date().toISOString(),
            role: 'default'
        };
        userRepositoryMock.findByEmail.mockResolvedValue(existingUser);

        // Act & Assert: Expect userService.registerUser to throw an error
        await expect(userService.registerUser('test@example.com', 'TestPassword123!', new Date().toISOString(), 'default'))
            .rejects
            .toThrow('User already exists.');
    });


    test('should login a user', async (): Promise<void> => {

        // Create a mock user object that matches the IUser interface
        const mockUser: IUser = {
            email: 'test@example.com',
            password: await bcrypt.hash('TestPassword123!', 10),
            userID: 1,
            createdAt: new Date().toISOString(),
            role: 'default'
        };

        // Mock findByEmail to return the mock user
        userRepositoryMock.findByEmail.mockResolvedValue(mockUser);

        // Mock bcrypt.compare to return true
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        // Act
        const result = await userService.loginUser('test@example.com', 'TestPassword123!');

        // Assert
        expect(result).toHaveProperty('token');
        expect(bcrypt.compare).toHaveBeenCalledWith('TestPassword123!', mockUser.password);
    });

    test('should not login a user with incorrect password', async (): Promise<void> => {
        const mockUser: IUser = {
            email: 'test@example.com',
            password: await bcrypt.hash('CorrectPassword123!', 10),
            userID: 1,
            createdAt: new Date().toISOString(),
            role: 'default'
        }

        // Mock findByEmail to return the mock user
        userRepositoryMock.findByEmail.mockResolvedValue(mockUser);

        // Mock bcrypt.compare to return false, simulating a failed password comparison
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        // Act & Assert
        await expect(userService.loginUser('test@example.com', 'NotCorrectPassword123!'))
            .rejects
            .toThrow('Invalid credentials');
    })
});