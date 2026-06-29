# Intranet FAV — Arquitetura de Microsserviço

> Estrutura base e APIs de referência para evolução gradual do sistema Intranet FAV.
> Este repositório é focado exclusivamente no backend (APIs e Microsserviços), projetado para ser executado em containers Docker e consumido por aplicações externas.

---

## Estrutura do Projeto

```
intranet/
├── backend/          # Microsserviço NestJS (TypeScript + Clean Architecture + DDD)
├── intranet/         # Aplicação atual (legado — backend Express + frontend React integrado)
├── docker-compose.yml
├── docker-compose.dev.yml
└── .github/
    └── workflows/
        └── ci.yml
```

---

## Backend Novo (`/backend`)

O novo microsserviço de backend é construído sobre o ecossistema **NestJS** e estruturado segundo os princípios de **Clean Architecture** e **DDD (Domain-Driven Design)**.

### Tecnologias Utilizadas
- **NestJS** + TypeScript
- **Clean Architecture** + **DDD**
- **JWT** para autenticação e segurança
- **Oracle DB** com pool de conexões otimizado
- **Passport.js** + **JWT Strategy**
- **Winston** para logs estruturados por níveis
- **Swagger/OpenAPI** para documentação de endpoints
- **Jest** para testes unitários e de integração

### Estrutura de Pastas por Módulo
```
src/modules/<dominio>/
├── domain/               # Entidades de negócio e interfaces de repositórios (100% puro)
│   ├── entities/
│   └── repositories/
├── application/          # Casos de uso, orquestradores e DTOs
│   ├── use-cases/
│   └── dtos/
├── infrastructure/       # Implementações concretas (bancos de dados, guards, strategies, etc)
│   ├── repositories/
│   ├── guards/
│   ├── strategies/
│   └── decorators/
└── presentation/         # Camada de entrada (Controllers da API REST)
    └── controllers/
```

### Camadas Compartilhadas (`/src/shared`)
```
src/shared/
├── domain/               # BaseEntity, interfaces genéricas, value objects globais
├── application/          # Interceptors e filtros de exceção globais
└── infrastructure/       # Utilitários de Logger, conexões de banco de dados
```

### Comandos para Execução Local
```bash
cd backend
cp .env.example .env      # Configure suas credenciais e chaves do banco/AD
npm install
npm.cmd run start:dev     # Inicia o servidor em modo de desenvolvimento (hot-reload)
npm.cmd run test          # Executa a suite de testes unitários
npm.cmd run test:cov      # Gera o relatório de cobertura de testes
npm.cmd run build         # Compila o projeto para produção
```

---

## Sistema Legado (`/intranet`)

A pasta `intranet/` mantém a aplicação atual para transição e suporte contínuo:
* **`intranet/api/`**: Servidor Express legada que fornece endpoints e autenticação AD.
* **`intranet/client/`**: Painel legado em React integrado.

### Execução do Legado (API)
```bash
cd intranet/api
cp config/config.env.example config/config.env    # Configure as variáveis locais
npm install
npm.cmd run dev                                   # Executa a API com nodemon
```

---

## Execução via Docker

A infraestrutura está preparada para rodar o microsserviço de forma isolada e padronizada usando Docker:

```bash
# Ambiente de Desenvolvimento (com logs adicionais e debug mapeado na porta 9229)
docker compose -f docker-compose.dev.yml up --build

# Ambiente de Produção
docker compose up --build
```

---

## CI/CD Pipeline

O pipeline configurado em `.github/workflows/ci.yml` executa automaticamente as seguintes verificações a cada push ou pull request nas branches `main` e `develop`:
1. Lint do código TypeScript no backend
2. Verificação de tipos estáticos (`tsc --noEmit`)
3. Testes unitários com validação de cobertura
4. Geração automática da imagem de build de produção no Docker (apenas no push para a branch `main`)
