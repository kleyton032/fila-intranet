import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUseCase } from '@modules/auth/application/use-cases/login.use-case';
import { USER_REPOSITORY } from '@modules/auth/domain/repositories/user.repository.interface';
import { UserEntity } from '@modules/auth/domain/entities/user.entity';
import { AppLoggerService } from '@shared/infrastructure/logger/app-logger.service';

/**
 * Exemplo de teste unitário seguindo TDD.
 * Testa o caso de uso de login de forma isolada — sem banco ou AD.
 */
describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;

  const mockUserRepository = {
    findByUsername: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      const config: Record<string, string> = {
        'jwt.expiresIn': '8h',
        'ad.url': 'ldap://mock',
        'ad.baseDn': 'dc=test,dc=com',
        'ad.domain': 'test.com',
      };
      return config[key];
    }),
  };

  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AppLoggerService, useValue: mockLogger },
      ],
    }).compile();

    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  describe('execute()', () => {
    it('deve lançar UnauthorizedException se o usuário não existir na base', async () => {
      // Arrange
      mockUserRepository.findByUsername.mockResolvedValue(null);
      jest
        .spyOn(loginUseCase as unknown as { authenticateInAD: () => Promise<void> }, 'authenticateInAD')
        .mockResolvedValue(undefined);

      // Act & Assert
      await expect(
        loginUseCase.execute({ username: 'inexistente', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException se o usuário estiver inativo', async () => {
      // Arrange
      const inactiveUser = new UserEntity({
        id: 1,
        username: 'joao.silva',
        name: 'João Silva',
        email: 'joao@fav.com.br',
        roles: ['FILA_ESPERA'],
        isActive: false,
      });

      mockUserRepository.findByUsername.mockResolvedValue(inactiveUser);
      jest
        .spyOn(loginUseCase as unknown as { authenticateInAD: () => Promise<void> }, 'authenticateInAD')
        .mockResolvedValue(undefined);

      // Act & Assert
      await expect(
        loginUseCase.execute({ username: 'joao.silva', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve retornar token JWT para usuário ativo com acesso', async () => {
      // Arrange
      const activeUser = new UserEntity({
        id: 1,
        username: 'joao.silva',
        name: 'João Silva',
        email: 'joao@fav.com.br',
        roles: ['FILA_ESPERA', 'CIRURGIA'],
        isActive: true,
      });

      mockUserRepository.findByUsername.mockResolvedValue(activeUser);
      jest
        .spyOn(loginUseCase as unknown as { authenticateInAD: () => Promise<void> }, 'authenticateInAD')
        .mockResolvedValue(undefined);

      // Act
      const result = await loginUseCase.execute({
        username: 'joao.silva',
        password: '123456',
      });

      // Assert
      expect(result.accessToken).toBe('mock.jwt.token');
      expect(result.username).toBe('joao.silva');
      expect(result.roles).toContain('FILA_ESPERA');
    });
  });
});
