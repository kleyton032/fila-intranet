/**
 * Entidade base do domínio.
 * Todas as entidades de domínio devem estender esta classe.
 */
export abstract class BaseEntity {
  id: string | number;
  createdAt?: Date;
  updatedAt?: Date;

  equals(other: BaseEntity): boolean {
    if (!(other instanceof BaseEntity)) return false;
    return this.id === other.id;
  }
}
