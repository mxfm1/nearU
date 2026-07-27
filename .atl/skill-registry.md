# Skill Registry — nearU

Generated: 2026-06-26

## User Skills (global)

| Skill                    | Trigger                                                                                                         | Description                                                                                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| branch-pr                | Creating a pull request, opening a PR, preparing changes for review                                             | PR creation workflow for Agent Teams Lite                                                                                                                                  |
| chained-pr               | PRs over 400 lines, stacked PRs, review slices                                                                  | Split oversized changes into chained PRs                                                                                                                                   |
| cognitive-doc-design     | Writing guides, READMEs, RFCs, onboarding, architecture, or review-facing docs                                  | Design docs that reduce cognitive load                                                                                                                                     |
| comment-writer           | PR feedback, issue replies, reviews, Slack messages, or GitHub comments                                         | Write warm, direct collaboration comments                                                                                                                                  |
| react-clean-architecture | Implementing or modifying a component, page, or UI feature                                                      | Clean React/Next.js component architecture — page as orchestrator, components with single responsibility, logic in hooks, data in services, types in types/, utils in lib/ |
| go-testing               | Writing Go tests, using teatest, or adding test coverage                                                        | Go testing patterns for Gentleman.Dots                                                                                                                                     |
| issue-creation           | Creating a GitHub issue, reporting a bug, or requesting a feature                                               | Issue creation workflow for Agent Teams Lite                                                                                                                               |
| judgment-day             | "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | Parallel adversarial review protocol                                                                                                                                       |
| skill-creator            | User asks to create a new skill, add agent instructions, or document patterns for AI                            | Creates new AI agent skills                                                                                                                                                |
| skill-improver           | Improve skills, audit skills, refactor skills, skill quality                                                    | Audit and upgrade existing LLM-first skills                                                                                                                                |
| work-unit-commits        | Implementation, commit splitting, chained PRs, or keeping tests and docs with code                              | Plan commits as reviewable work units                                                                                                                                      |

## SDD Skills (global)

sdd-init, sdd-explore, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive, sdd-onboard, skill-registry, _shared

## Project-Level Skills

None detected.

## Project Conventions

See `react-clean-architecture` skill for React/Next.js component architecture conventions:

- Pages orchestrate only, components own their logic, hooks encapsulate state, services handle data
- Reusable utilities in `lib/`, shared types in `types/`
- Always check existing code before creating new implementations

## Stack

Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, pnpm
