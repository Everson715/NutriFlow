# 🥗 NutriFlow – Backend API

Backend oficial do **NutriFlow**, responsável por autenticação, gerenciamento de usuários e regras de negócio da plataforma.  
A API foi desenvolvida com foco em **segurança**, **escalabilidade**, **manutenibilidade** e **boas práticas de engenharia de software**.

---

## 📌 Visão Geral

Esta API fornece endpoints REST para:
- Cadastro e autenticação de usuários
- Geração e validação de tokens JWT
- Acesso a rotas protegidas
- Recuperação do contexto do usuário autenticado

O backend é desacoplado do frontend e pode ser consumido por aplicações **Web**, **Mobile** ou **terceiros**.

---

## 🏗️ Arquitetura

O projeto segue uma **arquitetura modular em camadas**, conforme recomendado pelo NestJS:

```

Controller → Service → Repository → Database

```

### Padrões de Projeto Utilizados
- **Repository Pattern**
- **Strategy Pattern** (JWT / Passport)
- **Decorator Pattern**
- **Dependency Injection**
- **Guards (Chain of Responsibility)**
- **Layered Architecture**

Essa abordagem garante baixo acoplamento, alta coesão e facilidade de testes.

---

## 🚀 Tecnologias

- **Node.js**
- **NestJS**
- **TypeScript**
- **Prisma ORM**
- **JWT (JSON Web Token)**
- **Passport**
- **bcryptjs**
- **PostgreSQL** (ou outro banco compatível com Prisma)

---

## 📂 Estrutura de Diretórios

```

src/
├── auth
│   ├── dto
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   └── decorators
│       └── current-user.decorator.ts
│
├── users
│   ├── user.repository.ts
│   └── users.module.ts
│
├── profile
│   └── profile.controller.ts
│
├── prisma
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── common
│   ├── constants
│   ├── decorators
│   └── types
│
├── app.module.ts
└── main.ts

```

---

## 🔐 Autenticação

A autenticação é feita via **JWT (stateless)**.

### Fluxo de autenticação
1. Usuário realiza login
2. API retorna um `access_token`
3. O token deve ser enviado no header das requisições protegidas:
```

Authorization: Bearer <access_token>

````
4. O token é validado pela `JwtStrategy`

---

## 📡 Endpoints

### 🔑 Autenticação

#### **POST** `/auth/register`
Cria um novo usuário.

**Request Body**
```json
{
"name": "João Silva",
"email": "joao@email.com",
"password": "123456",
"confirmPassword": "123456"
}
````

**Response – 201**

```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com"
}
```

---

#### **POST** `/auth/login`

Autentica o usuário e retorna um token JWT.

**Request Body**

```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Response – 200**

```json
{
  "access_token": "jwt_token_aqui"
}
```

---

### 👤 Perfil (Rota Protegida)

#### **GET** `/profile`

Retorna os dados do usuário autenticado.

**Headers**

```
Authorization: Bearer <access_token>
```

**Response – 200**

```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@email.com"
}
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nutriflow"
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="1h"
```

---

## 🧬 Prisma ORM

### Comandos úteis

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Criar e aplicar migrações
npx prisma migrate dev

# Abrir interface visual do banco
npx prisma studio
```

---

## ▶️ Executando o Projeto

```bash
# Ambiente de desenvolvimento
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod
```

---

## 🔒 Boas Práticas de Segurança

* Senhas criptografadas com bcrypt
* JWT assinado com chave secreta
* Mensagens de erro genéricas para login inválido
* Validação de dados via DTOs
* Remoção de campos não permitidos (`ValidationPipe`)

---

## 📈 Próximas Evoluções Planejadas

* Refresh Token
* Controle de roles e permissões
* Swagger (OpenAPI)
* Testes unitários e e2e
* Rate limiting e proteção contra brute force

---

## 📄 Licença

Projeto de caráter acadêmico e experimental, desenvolvido como base para evolução do **NutriFlow**.

---

**NutriFlow Backend**
API desenvolvida com foco em qualidade técnica, clareza arquitetural e escalabilidade.

```