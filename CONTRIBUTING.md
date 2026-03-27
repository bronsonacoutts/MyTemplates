# Contributing to MyTemplates

Thank you for your interest in contributing! This guide will help you get started.

## 📋 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/YOUR_USERNAME/MyTemplates.git
   cd MyTemplates
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🌿 Branch Naming

Branch names must follow these patterns:

- `feature/<description>` - New features
- `fix/<description>` - Bug fixes
- `hotfix/<description>` - Urgent production fixes
- `docs/<description>` - Documentation changes
- `refactor/<description>` - Code refactoring
- `test/<description>` - Test additions or modifications
- `chore/<description>` - Build process or auxiliary tool changes

Example: `feature/add-user-authentication`

## 💻 Development Workflow

1. **Make your changes** following our coding standards
2. **Write tests** for new functionality
3. **Run linting and formatting**
   ```bash
   npm run lint:fix
   npm run format
   ```
4. **Run tests** to ensure everything works
   ```bash
   npm run validate:local
   ```
5. **Commit your changes** using conventional commits
   ```bash
   git commit -m "feat(component): add new feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a draft Pull Request** on GitHub, then mark it ready when you want the workflow chain to start

## 📝 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

```bash
# Feature
git commit -m "feat(auth): add JWT authentication"

# Bug fix
git commit -m "fix(api): handle null response from endpoint"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api): change authentication flow

BREAKING CHANGE: The authentication endpoint now requires a refresh token"
```

## ✅ Code Quality Standards

### TypeScript

- Use strict TypeScript settings (already configured)
- Avoid `any` types - use proper typing
- Use type imports: `import type { User } from './types'`

### ESLint & Prettier

- All code must pass ESLint with zero warnings
- Code must be formatted with Prettier
- Pre-commit hooks will automatically fix most issues

### Testing

- Write unit tests for all new functionality
- Maintain or improve code coverage (minimum 80%)
- No network calls in unit tests - use mocks
- Tag E2E tests with `@smoke` for critical paths

### Documentation

- Update README.md if adding features
- Add JSDoc comments for public APIs
- Update relevant documentation in `docs/`

## 🧪 Testing Guidelines

### Unit Tests

```typescript
import { describe, expect, it, vi } from 'vitest';

describe('MyComponent', () => {
  it('should render correctly', () => {
    // Test implementation
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('feature workflow @smoke', async ({ page }) => {
  // Test implementation
});
```

## 🔒 Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Client-side env vars must use `VITE_` prefix
- Server secrets must NOT use `VITE_` prefix
- Report security vulnerabilities privately (see [SECURITY.md](SECURITY.md))

## 📦 Pull Request Process

1. **Ensure all checks pass**
   - PR Validation workflow
   - CI Checks workflow
   - Tests workflow
   - Coverage requirements met

2. **Update documentation**
   - README.md if needed
   - Relevant docs in `docs/`
   - RELEASE_NOTES.md for user-facing changes

3. **Request review**
   - At least one approval required
   - Address review feedback promptly

4. **Merge**
   - Squash and merge is preferred
   - Delete branch after merge

## 🎯 What to Contribute

### Good First Issues

Look for issues labeled `good first issue` - these are great for newcomers!

### Areas for Contribution

- Bug fixes
- New features (discuss in an issue first)
- Documentation improvements
- Test coverage improvements
- Performance optimizations
- Accessibility improvements

### Before Starting Large Changes

For significant changes:

1. Open an issue to discuss your idea
2. Wait for feedback from maintainers
3. Get approval before investing significant time

## 🤖 AI-Assisted Contributions

AI-generated code is welcome. Treat it exactly like code you wrote by hand — you are responsible for it.

### Rules for AI-assisted PRs

1. **Run `npm run validate:local` before pushing.** This matches the preferred Husky-first path and adds the validation signal that lets cloud checks skip duplicate work.
2. **Generate tests alongside code.** Never submit AI-generated source without corresponding unit tests.
3. **Walk the [AI change checklist](vibe-coding/guardrails/ai-change-checklist.md)** before opening the PR.
4. **Fill in the PR template's AI-Assisted Changes section.** Reviewers use this to decide how carefully to read the diff.
5. **Use the prompt templates** in [vibe-coding/prompts/](vibe-coding/prompts/) — they already include the repo's constraints.
6. **No `any` types, no `@ts-ignore`.** Use `unknown` with type guards instead.
7. **Mock all network calls in tests.** The [test/setup.ts](test/setup.ts) harness rejects tests that forget.
8. **Use Australian English** in documentation and user-facing strings.
9. **Review every line.** Do not commit code you cannot explain. AI output can look correct while being subtly wrong.
10. **Use the `copilot/` branch prefix** for AI-generated branches (e.g. `copilot/fix-typo-in-readme`).

### Recommended workflow

See the [Vibe Coding Guide](docs/VIBE_CODING.md) for the full golden-path workflow covering prompt selection, validation, and PR submission.

### Preferred PR flow

1. Open the PR as `draft`.
2. Let Husky complete the local validation suite.
3. Mark the PR as `ready for review` when you want the GitHub workflow chain to start.
4. If you push more commits afterwards, rerun the workflows manually or move the PR back to draft and then to ready again.

## 💬 Getting Help

- Open an issue for bugs or feature requests
- Ask questions in discussions
- Check existing documentation in `docs/`

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## 🙏 Thank You

Thank you for contributing to MyTemplates! Your efforts help make this project better for everyone.
