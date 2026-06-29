import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator para definir os perfis necessários para acessar uma rota.
 * @example @Roles('ADMIN', 'GESTOR')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
