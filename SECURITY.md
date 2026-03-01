# Security Policy

## Supported Versions

The following versions of this project are currently supported with security updates:

| Version | Supported |
|---|---|
| 1.x (latest) | ✅ Active support |
| < 1.0 | ❌ No longer supported |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in this project, please report it responsibly using one of the following methods:

### Option 1: GitHub Security Advisories (Preferred)

1. Go to the [Security Advisories](../../security/advisories/new) page for this repository.
2. Click **"New draft security advisory"**.
3. Fill in the details of the vulnerability.
4. Submit the advisory — it will be visible only to maintainers until disclosed.

### Option 2: Direct Contact

Email the maintainer directly at the contact address listed in the repository. Include:

- **Subject:** `[SECURITY] <brief description>`
- A description of the vulnerability and its potential impact.
- Steps to reproduce or a proof-of-concept (if safe to share).
- Any suggested mitigations you are aware of.

## What to Expect

- **Acknowledgment:** You will receive acknowledgment within **48 hours**.
- **Assessment:** We will assess the severity and impact within **5 business days**.
- **Resolution:** We aim to release a patch within **30 days** for critical/high issues, and **90 days** for medium/low issues.
- **Credit:** With your permission, we will credit you in the security advisory and release notes.

## Vulnerability Severity Classification

We use the [CVSS v3.1](https://www.first.org/cvss/calculator/3.1) scale:

| Severity | CVSS Score | Response SLA |
|---|---|---|
| Critical | 9.0 – 10.0 | 7 days |
| High | 7.0 – 8.9 | 30 days |
| Medium | 4.0 – 6.9 | 90 days |
| Low | 0.1 – 3.9 | Next release |

## Security Best Practices for Contributors

When contributing to this project, please follow these security guidelines:

- **No secrets in code.** Never commit API keys, passwords, tokens, or credentials. Use environment variables.
- **Validate inputs.** Always validate and sanitize external inputs.
- **Audit dependencies.** Run `npm audit` before submitting PRs that add or update dependencies.
- **Least privilege.** Request only the permissions your code needs.
- **Keep dependencies updated.** Use Dependabot alerts and keep packages up to date.

## Security-Related Configuration

- Dependabot is configured to automatically raise PRs for dependency updates.
- CodeQL analysis runs on every push to `main` and weekly to detect vulnerabilities.
- `npm audit --audit-level=high` runs in CI and will fail the build on high/critical vulnerabilities.

## Disclosure Policy

We follow **Coordinated Vulnerability Disclosure (CVD)**. We ask that you:

1. Report the issue privately to us first.
2. Allow reasonable time to fix the issue before public disclosure.
3. Avoid exploiting the vulnerability or accessing data beyond what is needed to demonstrate the issue.

We commit to working with you in good faith and will not pursue legal action for good-faith security research conducted in accordance with this policy.
