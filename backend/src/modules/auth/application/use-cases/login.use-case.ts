import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as ldap from 'ldapjs';
import { LoginDto } from '../dtos/login.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import { AppLoggerService } from '@shared/infrastructure/logger/app-logger.service';

/**
 * Caso de uso: Autenticação de usuário via Active Directory + JWT.
 *
 * Responsabilidades:
 *  1. Validar credenciais no Active Directory (LDAP)
 *  2. Buscar permissões do usuário no banco de dados
 *  3. Gerar e retornar o token JWT
 *
 * Segue o princípio SRP: apenas orquestra o fluxo de autenticação.
 */
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const { username, password } = dto;

    // 1. Autenticar no Active Directory
    await this.authenticateInAD(username, password);

    // 2. Buscar usuário e permissões no banco
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      this.logger.warn(
        `Usuário "${username}" autenticado no AD mas não encontrado na base`,
        LoginUseCase.name,
      );
      throw new UnauthorizedException(
        'Usuário não possui acesso ao sistema. Contate o administrador.',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo. Contate o administrador.');
    }

    // 3. Gerar JWT
    const expiresIn = this.configService.get<string>('jwt.expiresIn', '8h');
    const payload = { sub: user.id, username: user.username, roles: user.roles };
    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Usuário "${username}" autenticado com sucesso`, LoginUseCase.name);

    return {
      accessToken,
      username: user.username,
      roles: user.roles,
      expiresIn,
    };
  }

  private authenticateInAD(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const adUrl = this.configService.get<string>('ad.url');
      const adBaseDn = this.configService.get<string>('ad.baseDn');
      const domain = this.configService.get<string>('ad.domain', 'fav.com.br');

      const client = ldap.createClient({ url: adUrl ?? '' });
      const userDn = `${username}@${domain}`;

      client.bind(userDn, password, (err) => {
        client.destroy();

        if (err) {
          this.logger.warn(
            `Falha na autenticação AD para "${username}": ${err.message}`,
            LoginUseCase.name,
          );
          reject(new UnauthorizedException('Usuário ou senha inválidos'));
        } else {
          resolve();
        }
      });
    });
  }
}
