# MyTemplates

Template and starter scaffolds with comprehensive guardrails and best practices.

[![CI](https://github.com/bronsonacoutts/MyTemplates/actions/workflows/ci.yml/badge.svg)](https://github.com/bronsonacoutts/MyTemplates/actions/workflows/ci.yml)
[![CodeQL](https://github.com/bronsonacoutts/MyTemplates/actions/workflows/codeql.yml/badge.svg)](https://github.com/bronsonacoutts/MyTemplates/actions/workflows/codeql.yml)

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Development](#development)
- [Testing](#testing)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

## 💻 Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Available Scripts

- `npm run lint` - Run ESLint with strict TypeScript rules
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests with coverage
- `npm run test:e2e` - Run E2E tests
- `npm run test:e2e:smoke` - Run smoke tests only
- `npm run type-check` - Run TypeScript type checking
- `npm run build` - Build for production
- `npm run validate:branch` - Validate branch naming
- `npm run validate:release-notes` - Validate release notes

### Git Hooks

This repository uses Husky for Git hooks:

- **pre-commit**: Runs linting and formatting on staged files
- **commit-msg**: Validates commit messages follow conventional commits
- **pre-push**: Runs tests and branch validation

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Example:
```
feat(auth): add JWT authentication

Implement JWT-based authentication with refresh tokens

Closes #123
```

## 🧪 Testing

### Unit Tests

Unit tests use Vitest with strict no-network rules. All external dependencies must be mocked.

```bash
npm run test:unit
```

Coverage thresholds:
- Lines: 80%
- Functions: 80%
- Branches: 75%
- Statements: 80%

### E2E Tests

E2E tests use Playwright with tag-based test suites.

```bash
# Run all E2E tests
npm run test:e2e

# Run smoke tests only
npm run test:e2e:smoke
```

See [TESTING.md](docs/developer/TESTING.md) for detailed testing guidelines.

## 📚 Documentation

- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Testing Guide](docs/developer/TESTING.md)
- [Environment Variables](docs/developer/ENV_SECRETS.md)
- [Release Process](docs/developer/RELEASE_PROCESS.md)
- [Documentation Standards](docs/DOC_STANDARDS.md)

## 🔒 Security

See [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏗️ Project Structure

```
.
├── .github/          # GitHub workflows and configurations
├── docs/             # Documentation
│   ├── admin/        # Administrative documentation
│   ├── api/          # API documentation
│   ├── architecture/ # Architecture decision records
│   ├── deployment/   # Deployment guides
│   ├── developer/    # Developer guides
│   ├── integration/  # Integration guides
│   ├── migration/    # Migration guides
│   ├── reference/    # Reference documentation
│   ├── testing/      # Testing documentation
│   ├── troubleshooting/ # Troubleshooting guides
│   └── user/         # User documentation
├── scripts/          # Build and utility scripts
├── src/              # Source code
├── test/             # Tests
│   ├── e2e/          # End-to-end tests
│   └── tests/        # Additional test resources
└── build/            # Build configuration

```
