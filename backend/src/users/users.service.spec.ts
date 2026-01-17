import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  } as unknown as UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have UserRepository injected', () => {
    expect(userRepository).toBeDefined();
  });
});
