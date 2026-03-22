## Repository-Specific Override

Use this file shape in downstream template repos when consuming the shared AI instructions pack.

Include only repo-local details such as:

- project overview
- toolchain and stack
- long-lived branches
- validation commands
- file placement rules
- deployment caveats
- template-specific anti-patterns

Do not repeat or weaken the shared global sections.

### Project Overview

Describe what the repository is for and who it serves.

### Tech Stack

List the runtime, language, test tools, build tools, and CI platform used by this repo.

### Repository Branching Notes

Document any long-lived branches or extra branch rules specific to this repo.

### Repository Validation Commands

List the exact commands contributors and agents should run before merge.

### Repository-Specific Guardrails

Document stack-specific anti-patterns, file placement rules, or deployment caveats.
