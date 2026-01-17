# 🥗 NutriFlow

O **NutriFlow** é uma solução multiplataforma (Web e Mobile) projetada para transformar a maneira como as pessoas lidam com a alimentação e o desperdício de alimentos. Através de **Inteligência Artificial**, o sistema cria uma ponte entre os ingredientes disponíveis e uma nutrição consciente, prática e sustentável.

---

## 🚧 Status do Projeto

> **Status:** Em desenvolvimento ativo (Fase de Infraestrutura e Backend).

Atualmente, o foco está na base do **backend e arquitetura**, com atenção especial para:

* Arquitetura limpa e modular.
* Autenticação e autorização segura (JWT).
* Validação de dados e consistência da API.
* Boas práticas com NestJS e Prisma ORM.

---

## 🚀 Funcionalidades Principais

### 🔐 Autenticação & Segurança (Em progresso)

* Registro e login de usuários.
* Autenticação baseada em JWT.
* Endpoint de validação de token (`/auth/validate`).
* Rotas protegidas com Guards e Middlewares.

### 🍽️ Gerador de Receitas Inteligente (Planejado)

* **IA de Sugestão:** O usuário informa os ingredientes e a IA sugere receitas personalizadas.
* **Substituições Inteligentes:** Adaptações baseadas no que realmente está na despensa e restrições alimentares.

### 📊 Gestão & Nutrição (Planejado)

* **Cálculo Nutricional Automático:** Geração de tabelas nutricionais para cada receita.
* **Gestão de Insumos:** Relatórios de uso de ingredientes para auxiliar no controle de gastos e redução de desperdício.

---

## 🛠️ Stack Tecnológica

### **Frontend & Mobile**

| Plataforma | Tecnologias |
| --- | --- |
| **Web** | [React](https://reactjs.org/) / [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| **Mobile** | [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) |

### **Backend & Inteligência Artificial**

| Camada | Tecnologias |
| --- | --- |
| **Servidor / API** | [Node.js](https://nodejs.org/) + [NestJS](https://nestjs.com/) + [TypeScript](https://www.typescriptlang.org/) |
| **Banco de Dados** | [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) |
| **Cache / Performance** | [Redis](https://redis.io/) |
| **IA / Machine Learning** | Integração com [OpenAI API](https://openai.com/) |

---

## 🧱 Princípios de Arquitetura

O backend segue as melhores práticas da indústria:

* **Design Modular:** Organização por módulos independentes no NestJS.
* **Separação de Preocupações:** Divisão clara entre rotas, lógica de negócio (services) e acesso a dados.
* **Tipagem Forte:** Uso integral de TypeScript para reduzir erros em tempo de execução.
* **Validação Centralizada:** Uso de DTOs e Pipes para garantir a integridade dos dados.

---

## 📌 Notas

* Este projeto está em estágio inicial de desenvolvimento.
* Algumas funcionalidades descritas estão em fase de planejamento.
* A documentação será atualizada conforme o projeto amadurecer.