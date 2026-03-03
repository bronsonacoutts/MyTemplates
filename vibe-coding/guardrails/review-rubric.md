# AI Code Review Rubric

> Use this rubric when reviewing pull requests that include AI-generated code.
> Score each dimension. Any "Fail" blocks the merge.

## Scoring

| Score | Meaning                                       |
| ----- | --------------------------------------------- |
| Pass  | Meets the standard. No action needed.         |
| Flag  | Minor issue. Can merge with a follow-up task. |
| Fail  | Blocks merge. Must be fixed before approving. |

## Rubric

### 1. Correctness

| Check                                | Pass                    | Flag                            | Fail                              |
| ------------------------------------ | ----------------------- | ------------------------------- | --------------------------------- |
| Feature works as described in the PR | Behaviour matches spec  | Edge case missed                | Core behaviour broken or untested |
| No regressions                       | All existing tests pass | Unrelated test flaky but passes | Existing test fails               |
| Types are sound                      | Strict TS, no `any`     | Unnecessary type assertion      | `any` or `@ts-ignore` used        |

### 2. Safety

| Check                | Pass                             | Flag                             | Fail                             |
| -------------------- | -------------------------------- | -------------------------------- | -------------------------------- |
| No secrets in diff   | Clean                            | `.env.example` key name is vague | Actual secret committed          |
| Dependencies audited | No new deps or `npm audit` clean | New dep, audit clean             | New dep with known vulnerability |
| Input validation     | External inputs validated        | Validation exists but incomplete | No validation on user input      |

### 3. Test quality

| Check                    | Pass                         | Flag                      | Fail                               |
| ------------------------ | ---------------------------- | ------------------------- | ---------------------------------- |
| Coverage maintained      | Thresholds met (80/80/80/75) | Slightly above threshold  | Below threshold                    |
| Tests are meaningful     | Assertions check behaviour   | Only check existence      | No assertions or trivial tests     |
| No network in unit tests | All mocked                   | Mock exists but leaky     | Real HTTP call in test             |
| Error paths tested       | At least one error-path test | Happy path only, low risk | No error-path tests for risky code |

### 4. Code quality

| Check        | Pass                         | Flag                             | Fail                                |
| ------------ | ---------------------------- | -------------------------------- | ----------------------------------- |
| Lint clean   | Zero warnings                | Disabled rule with justification | Disabled rule without justification |
| Readable     | Clear names, small functions | Slightly long function           | Incomprehensible one-liner          |
| No dead code | All code reachable           | Commented-out code with TODO     | Orphaned functions or imports       |
| Docs present | JSDoc on all exports         | Missing @example on complex API  | No JSDoc on public API              |

### 5. AI transparency

| Check                | Pass                                 | Flag                      | Fail                         |
| -------------------- | ------------------------------------ | ------------------------- | ---------------------------- |
| PR template filled   | AI-Assisted Changes section complete | Section present but vague | Section missing or dishonest |
| Prompt recorded      | Prompt noted in PR or linked         | Prompt summarised briefly | No mention of AI involvement |
| Human review evident | Reviewer comments show understanding | Rubber-stamp approval     | No evidence of review        |

## How to use

1. Open the PR diff.
2. Score each row in the rubric above.
3. If any row is "Fail", request changes with a clear explanation.
4. If all rows are "Pass" or "Flag", approve with notes on follow-ups.
5. Record "Flag" items as issues or TODOs for the next sprint.
