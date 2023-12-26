import {ModuleService} from "../../services/Module.service";
import {ModuleRepository} from "../../repository/Module.repository";
import {IModule} from "../../models/interfaces/IModule";

jest.mock('../repository/ModuleRepository');
describe('ModuleService', (): void => {
    let moduleService: ModuleService;
    let mockModuleRepository: jest.Mocked<ModuleRepository>;

    beforeEach((): void => {
        mockModuleRepository = new ModuleRepository() as jest.Mocked<ModuleRepository>;

        moduleService = new ModuleService(mockModuleRepository);
    });

    test('should retrieve a module by ID', async (): Promise<void> => {
        const mockModule: IModule = {
            moduleId: 1,
            title: 'Test Module',
            description: 'This is just testing module',
            difficultyLevel: 'low',
            duration: 30,
            prerequisites: 'none',
            createdAt: new Date(),
            updatedAt: new Date(),
            contents: [
                {
                    contentId: 101,
                    moduleId: 1,
                    contentType: 'Video',
                    content: 'Introduction Video',
                    sequence: 1
                },
                {
                    contentId: 102,
                    moduleId: 1,
                    contentType: 'Article',
                    content: 'Getting Started with Programming',
                    sequence: 2
                }
            ]
        };

        // Set up the mock to return the mock module
        mockModuleRepository.findModuleById.mockResolvedValue(mockModule);

        // Call the method being tested
        const module: IModule | null = await moduleService.getModuleById(1);

        // Assertions
        expect(module).toEqual(mockModule);
        expect(mockModuleRepository.findModuleById).toHaveBeenCalledWith(1);
    });

    test('should retrieve a module by ID NULL type', async (): Promise<void> => {

        mockModuleRepository.findModuleById.mockResolvedValue(null);

        const module: IModule | null = await moduleService.getModuleById(1);
        expect(module).toBeNull();

    });

    test('should retrieve all modules', async (): Promise<void> => {
        const mockModules: IModule[] = [
            {
                moduleId: 1,
                title: 'Test Module 1',
                description: 'This is just testing module 1',
                difficultyLevel: 'low',
                duration: 30,
                prerequisites: 'none',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                moduleId: 2,
                title: 'Test Module 2',
                description: 'This is just testing module 2',
                difficultyLevel: 'low',
                duration: 30,
                prerequisites: 'none',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                moduleId: 3,
                title: 'Test Module 3',
                description: 'This is just testing module 3',
                difficultyLevel: 'low',
                duration: 30,
                prerequisites: 'none',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ];

        mockModuleRepository.findAllModules.mockResolvedValue(mockModules);

        const modules: IModule[] = await moduleService.getAllModules();

        expect(modules).toEqual(mockModules);
        expect(mockModuleRepository.findAllModules).toHaveBeenCalled();
    });

    test('should delete a module', async (): Promise<void> => {

        const moduleId: number = 1;
        mockModuleRepository.deleteModuleById.mockResolvedValue();

        // Call deleteModule
        await moduleService.deleteModule(moduleId);

        expect(mockModuleRepository.deleteModuleById).toHaveBeenCalledWith(moduleId);

    });

    test('should create a module and return its ID', async (): Promise<void> => {
        const title: string = "Sample Module";
        const description: string = "This is a test module";
        const difficultyLevel: string = "Beginner";
        const duration: number = 120;
        const prerequisites: string = "None";

        // Mock insertModuleData to return a mock module ID
        const mockModuleId: number = 1;
        mockModuleRepository.insertModuleData.mockResolvedValue(mockModuleId);

        const moduleId: number = await moduleService.createModule(title, description, difficultyLevel, duration, prerequisites);

        expect(moduleId).toBe(mockModuleId);
        expect(mockModuleRepository.insertModuleData).toHaveBeenCalledWith(title, description, difficultyLevel, duration, prerequisites);
    });

    test('should create module content', async (): Promise<void> => {
        const moduleId: number = 1;
        const contentType: string = "Video";
        const content: string = "http://example.com/video";
        const sequence: number = 1;

        mockModuleRepository.insertModuleContent.mockResolvedValue();

        await moduleService.createModuleContent(moduleId, contentType, content, sequence);

        expect(mockModuleRepository.insertModuleContent).toHaveBeenCalledWith(moduleId, contentType, content, sequence);
    });
});
