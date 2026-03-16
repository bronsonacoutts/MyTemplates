# Copilot Coding Agent — Firewall & Allowlist Reference

> **Status:** Firewall is currently **disabled** for this repository.
> Re-enable it by following the steps in [Re-enabling the Firewall](#re-enabling-the-firewall) below.

---

## Overview

GitHub Copilot's coding agent runs in an ephemeral GitHub Actions environment. A built-in
firewall restricts outbound network access to reduce data-exfiltration risks. The firewall
ships with a **recommended allowlist** enabled by default that covers common OS package
repositories, container registries, language package managers, certificate authorities, and
Playwright browser download CDNs.

This document records every external address this repository requires, confirms coverage
by the recommended allowlist, and provides step-by-step instructions to re-enable the
firewall.

---

## Address Scan Results

The repository was scanned on **2026-03-08**. The table below lists every external service
the Copilot agent needs to reach when working on this project.

### npm Package Registry

Required by `npm ci` (all workflows install Node.js dependencies).

| Address              | Purpose                       | In Recommended Allowlist? |
| -------------------- | ----------------------------- | ------------------------- |
| `registry.npmjs.org` | npm package downloads         | ✅ Yes                    |
| `registry.npmjs.com` | npm package downloads (alias) | ✅ Yes                    |
| `npmjs.org`          | npm                           | ✅ Yes                    |
| `npmjs.com`          | npm                           | ✅ Yes                    |
| `skimdb.npmjs.com`   | npm metadata                  | ✅ Yes                    |
| `npm.pkg.github.com` | GitHub npm packages           | ✅ Yes                    |

### Node.js Runtime

Required by `actions/setup-node@v4`.

| Address              | Purpose                    | In Recommended Allowlist? |
| -------------------- | -------------------------- | ------------------------- |
| `nodejs.org`         | Node.js binary downloads   | ✅ Yes                    |
| `deb.nodesource.com` | NodeSource Debian packages | ✅ Yes                    |

### Playwright Browser Downloads

Required by `npm run test:e2e` (Playwright installs Chromium, Firefox, WebKit).

| Address                                            | Purpose                          | In Recommended Allowlist? |
| -------------------------------------------------- | -------------------------------- | ------------------------- |
| `cdn.playwright.dev`                               | Playwright browser CDN           | ✅ Yes                    |
| `playwright.azureedge.net`                         | Playwright browser CDN (Azure)   | ✅ Yes                    |
| `playwright.download.prss.microsoft.com`           | Playwright browser downloads     | ✅ Yes                    |
| `playwright-akamai.azureedge.net`                  | Playwright browser CDN (Akamai)  | ✅ Yes                    |
| `playwright-verizon.azureedge.net`                 | Playwright browser CDN (Verizon) | ✅ Yes                    |
| `storage.googleapis.com/chrome-for-testing-public` | Chrome for Testing               | ✅ Yes                    |

### GitHub Infrastructure

Always allowed by the Copilot agent's built-in base allowlist (not part of the
recommended allowlist toggle).

| Address                         | Purpose                       | Always Allowed? |
| ------------------------------- | ----------------------------- | --------------- |
| `github.com`                    | GitHub authentication & clone | ✅ Yes (base)   |
| `api.github.com`                | GitHub API                    | ✅ Yes (base)   |
| `*.githubusercontent.com`       | Raw content, object storage   | ✅ Yes (base)   |
| `codeload.github.com`           | Archive downloads             | ✅ Yes (base)   |
| `uploads.github.com`            | Artifact uploads              | ✅ Yes (base)   |
| `objects.githubusercontent.com` | Git object storage            | ✅ Yes (base)   |

### GitHub Actions Artifact Storage

Required for GitHub Actions to store and retrieve job artifacts and caches.

| Address                                      | Purpose                         | In Recommended Allowlist? |
| -------------------------------------------- | ------------------------------- | ------------------------- |
| `productionresultssa*.blob.core.windows.net` | Actions artifact storage (0–19) | ✅ Yes                    |

### CodeQL Analysis

Required by the `codeql.yml` workflow (`github/codeql-action`).

| Address                   | Purpose                 | In Recommended Allowlist? |
| ------------------------- | ----------------------- | ------------------------- |
| `scanning-api.github.com` | CodeQL upload endpoint  | ✅ Yes                    |
| `*.githubusercontent.com` | CodeQL bundle downloads | ✅ Yes (base)             |

### Ubuntu / Debian Package Managers

Required if the agent installs system-level tools (e.g., via `apt-get`).

| Address                  | Purpose                         | In Recommended Allowlist? |
| ------------------------ | ------------------------------- | ------------------------- |
| `archive.ubuntu.com`     | Ubuntu package index            | ✅ Yes                    |
| `security.ubuntu.com`    | Ubuntu security updates         | ✅ Yes                    |
| `deb.debian.org`         | Debian packages                 | ✅ Yes                    |
| `packages.microsoft.com` | Microsoft packages (e.g., .NET) | ✅ Yes                    |

### Certificate Authorities

Required for TLS certificate validation.

| Address                                      | Purpose        | In Recommended Allowlist? |
| -------------------------------------------- | -------------- | ------------------------- |
| `crl3.digicert.com` / `crl4.digicert.com`    | DigiCert CRL   | ✅ Yes                    |
| `ocsp.digicert.com`                          | DigiCert OCSP  | ✅ Yes                    |
| `crl.globalsign.com` / `ocsp.globalsign.com` | GlobalSign     | ✅ Yes                    |
| `crl.sectigo.com` / `ocsp.sectigo.com`       | Sectigo        | ✅ Yes                    |
| `oneocsp.microsoft.com`                      | Microsoft OCSP | ✅ Yes                    |

---

## Custom Allowlist Additions

**None required.** This repository uses only standard npm packages, Playwright for E2E
testing, and GitHub-hosted services. All required addresses are covered by GitHub's
recommended allowlist.

No entries need to be added to the **Custom allowlist** in the repository settings.

---

## Re-enabling the Firewall

The Copilot coding agent firewall is configured in the repository settings UI.

1. Navigate to **Settings** → **Copilot** → **coding agent**
   (direct link: `https://github.com/bronsonacoutts/MyTemplates/settings/copilot/coding_agent`)

2. Under **Firewall**, toggle **Enable firewall** to **on**.

3. Confirm that **Recommended allowlist** is also toggled **on** (this is the default).

4. Because no custom addresses are required, the **Custom allowlist** can remain empty.

5. Click **Save changes**.

The firewall will now be active for all future Copilot agent sessions in this repository.
All addresses listed in this document are covered by the recommended allowlist, so the
agent will be able to install npm packages, download Node.js, run Playwright tests, and
perform CodeQL analysis without being blocked.

---

## Ongoing Maintenance

- If new dependencies are added that require a private or non-standard registry, add the
  registry host to the **Custom allowlist** in Settings → Copilot → coding agent →
  Custom allowlist.
- Re-run this scan after significant dependency changes.
- For the full GitHub recommended allowlist reference, see:
  [Copilot allowlist reference](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)

---

## Related Files

- Setup steps: [`.github/workflows/copilot-setup-steps.yml`](../../.github/workflows/copilot-setup-steps.yml)
- CI workflow: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)
- Playwright config: [`playwright.config.ts`](../../playwright.config.ts)
