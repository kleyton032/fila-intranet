/**
 * Interface base para todos os repositórios do domínio.
 * Define o contrato que qualquer implementação deve seguir.
 * Segue o Princípio da Inversão de Dependência (SOLID - D).
 */
export interface IRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(params?: unknown): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}
