# 🚀 NestJS PostgreSQL Template

<div align="center">

**A production-ready NestJS backend template demonstrating efficient organization and modern design patterns**

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.1+-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue.svg)](https://www.postgresql.org/)

_Built with ❤️ using Domain-Driven Design and Event-Driven Architecture_

[Quick Start](#-getting-started) • [Documentation](#-documentation) • [Features](#-features)

</div>

## 👥 Who Is This For?

This template is designed for **backend engineers** building:

- RESTful APIs with NestJS and clean separation between controllers, business logic, and data access
- Event-driven microservices with async message processing (SQS/SNS)
- Type-safe codebases with comprehensive TypeScript types and fast unit tests (Vitest)
- Production-ready systems with proper transaction management and error handling
- Containerized applications with Docker and Docker Compose

## ✨ Features

- **3-Tier Architecture**: Clear separation between presentation, domain, and infrastructure layers
- **Domain-Driven Design**: Business logic encapsulated in domain services with rich domain models
- **Event-Driven Architecture**: Decoupled communication via domain events and message queues
- **Type Safety**: End-to-end type safety from database schema to API responses
- **Type-Safe Database**: Kysely query builder with auto-generated TypeScript types
- **Comprehensive Testing**: Organized test structure with separate unit and integration tests (Vitest)
- **Docker Support**: Full Docker Compose setup with PostgreSQL, LocalStack, and app container
- **Local Development**: Easy local testing with docker-compose for building and running tests
- **AWS CDK**: Infrastructure as code for provisioning AWS resources
- **Structured Logging**: JSON-formatted logs with pino for easy parsing and analysis
- **Fastify Adapter**: High-performance HTTP adapter for NestJS

## 📚 Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - Architecture overview, design patterns, and event system
- **[Development Guide](docs/DEVELOPMENT.md)** - Local setup, Docker, and development workflows
- **[Database](docs/DATABASE.md)** - Schema, migrations, and type generation
- **[Migration Guide](docs/MIGRATION.md)** - Guide for migrating from Python/FastAPI template
- **[CDK Infrastructure](resources/infra/cdk/README.md)** - AWS infrastructure deployment

## 📁 Project Structure

```
nestjs-postgres-template/
├── entry/
│   ├── api/
│   │   └── main.ts                 # NestJS API server entrypoint
│   └── worker/
│       └── main.ts                 # Async event consumer entrypoint
│
├── src/
│   ├── config/
│   │   ├── settings.ts             # Environment/config variables
│   │   └── settings.module.ts      # Settings module
│   │
│   ├── domain/
│   │   ├── user/                   # User domain
│   │   │   ├── model.ts            # User domain model
│   │   │   ├── repo/               # Repository implementations
│   │   │   │   ├── base.ts         # Repository interface
│   │   │   │   └── kysely.ts       # Kysely implementation
│   │   │   ├── service.ts          # User domain service
│   │   │   ├── events/             # Domain events
│   │   │   │   ├── constants.ts
│   │   │   │   ├── schema.ts       # Zod schemas for events
│   │   │   │   └── handlers/       # Event handlers
│   │   │   ├── validators.ts
│   │   │   ├── diff.ts
│   │   │   └── user.module.ts      # User domain module
│   │   │
│   │   ├── exceptions.ts
│   │   └── types.ts
│   │
│   ├── infrastructure/
│   │   ├── db/                     # Database access
│   │   │   ├── kysely/             # Kysely-specific implementations
│   │   │   │   ├── schema.ts       # Auto-generated schema types
│   │   │   │   ├── context.ts
│   │   │   │   └── pool.ts
│   │   │   ├── database.module.ts
│   │   │   ├── transaction-manager.ts
│   │   │   └── update-mapper.ts
│   │   ├── messaging/              # Event publishing/consumption
│   │   │   ├── base.ts             # BaseEvent and Zod serialization
│   │   │   ├── publisher/          # SNS publisher
│   │   │   ├── consumer/           # SQS consumer
│   │   │   └── messaging.module.ts
│   │   ├── aws/                    # AWS SDK client configuration
│   │   └── di/                     # Dependency injection tokens
│   │
│   ├── presentation/
│   │   ├── user/                   # User API
│   │   │   ├── dto/                # Data Transfer Objects
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── patch-user.dto.ts
│   │   │   │   ├── user-response.dto.ts
│   │   │   │   └── ...
│   │   │   ├── user.controller.ts  # NestJS controller
│   │   │   └── user.module.ts      # User presentation module
│   │   ├── app.module.ts           # Root application module
│   │   ├── deps.ts                 # Dependency injection
│   │   ├── exceptions/             # Exception filters
│   │   ├── health/                 # Health check endpoints
│   │   ├── pagination.ts           # Pagination helpers
│   │   └── ...
│   │
│   └── observability/
│       └── logging.ts              # Structured logging with pino
│
├── tests/
│   ├── unit/                       # Fast unit tests with mocks
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── integration/                # Slower tests with real dependencies
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── presentation/
│   └── utils/                      # Test utilities
│
├── resources/
│   ├── db/migrations/              # Database migrations
│   ├── docker/                     # Dockerfiles
│   │   └── app.Dockerfile          # Multi-stage Dockerfile
│   ├── infra/cdk/                  # AWS CDK infrastructure code
│   │   ├── bin/                    # CDK app entry point
│   │   ├── lib/                    # Stack definitions
│   │   └── test/                   # CDK unit tests
│   └── scripts/                    # Utility scripts
│       ├── migrate.sh
│       └── setup_localstack.sh
│
├── docker-compose.yml              # Docker Compose configuration
├── eslint.config.ts                # ESLint flat config
├── vitest.config.mjs               # Vitest test configuration
├── Makefile                        # Common development commands
├── package.json
├── tsconfig.json
├── kysely-codegen.config.ts        # Kysely codegen configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (install via `npm install -g pnpm` or `corepack enable`)
- PostgreSQL 15+
- Docker (for local development)

### Quick Start

1. **Clone and install:**

   ```bash
   git clone <repository-url>
   cd nestjs-postgres-template
   pnpm install
   ```

2. **Set up environment:**

   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start services with Docker Compose:**

   ```bash
   # Start PostgreSQL and LocalStack
   docker-compose up -d postgres localstack
   
   # Run database migrations
   make migrate
   
   # Setup LocalStack resources (SNS topics and SQS queues)
   make localstack-setup
   ```

4. **Run the API locally:**

   ```bash
   pnpm run start:dev
   # or
   make run-api
   ```

   API available at `http://localhost:8000/api`, docs at `http://localhost:8000/docs`

5. **Or run the API in Docker:**

   ```bash
   # Build and start the app container
   docker-compose up --build app
   ```

### Docker Compose Services

The `docker-compose.yml` includes three services:

- **postgres**: PostgreSQL 16 database
- **localstack**: Local AWS services (SNS/SQS) for development
- **app**: Application container (can be used for running tests or the API)

**Useful Docker Compose commands:**

```bash
# Build the app container
docker-compose build app

# Run the API server in Docker
docker-compose up app

# Run tests in Docker
docker-compose run --rm app pnpm test

# Run unit tests only
docker-compose run --rm app pnpm exec vitest run tests/unit

# Run integration tests only
docker-compose run --rm app pnpm exec vitest run tests/integration
```

For detailed setup instructions, see the [Development Guide](docs/DEVELOPMENT.md).

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. ✅ Follow the existing code structure and patterns
2. ✅ Maintain type safety throughout (TypeScript must pass)
3. ✅ Write tests for new features:
   - Unit tests in `tests/unit/` with mocked dependencies (fast, use in CI)
   - Integration tests in `tests/integration/` for real dependencies (slower)
   - Run tests with `make test` or `pnpm test`
4. ✅ Run linting and type checking before committing (`make lint`)
5. ✅ Follow the Makefile commands for common tasks
6. ✅ Update documentation for any architectural changes
7. ✅ Use TypeBox for presentation layer schemas (DTOs), Zod for event schemas
8. ✅ Test your changes with Docker Compose when applicable

**Testing:**

```bash
# Run all tests
make test

# Run unit tests only
make test-unit

# Run integration tests only
make test-integration

# Run tests in watch mode
make test-watch

# Run tests in Docker
docker-compose run --rm app pnpm test
```

See the [documentation](docs/) for detailed guides on architecture, development, and database management.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for the Node.js backend community**

⭐ Star this repo if you find it useful!

</div>
