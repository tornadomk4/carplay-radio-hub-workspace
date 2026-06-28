---
name: "obstacle-recovery"
description: "Keep tasks moving through errors with diagnosis, workarounds, and lessons learned."
---

# Obstacle Recovery

Use this workflow when a task hits an error, missing dependency, unavailable tool, blocked command, stale config, failed API call, or ambiguous obstacle.

## Principle

Do not stop the task just because the first route failed. Treat obstacles as part of the work: diagnose, adapt, continue, and capture the lesson.

## Procedure

1. Identify the obstacle clearly: what failed, what was expected, and whether the failure is local, external, permissions-related, configuration-related, or unknown.
2. Preserve safety boundaries. Do not bypass restrictions around spending money, public posting, external commitments, destructive actions, credentials, or legal/regulated actions.
3. Try a lower-risk alternative path before asking the user. Examples: use an official config API instead of a stale CLI, read local docs before web search, use another installed tool, inspect logs, or stage a config instead of applying it.
4. Continue toward the user's actual objective. Do not turn the final answer into a bare error report unless every reasonable route is blocked.
5. If truly blocked, return with a compact status: what was tried, why it is blocked, exactly what input or external state is needed, and the next action once that arrives.
6. Write down durable lessons when they matter: update MEMORY.md, a daily note, AGENTS.md, TOOLS.md, or propose/update a reusable skill through Skill Workshop.

## Response Style

Lead with the current best path forward. Mention the obstacle only as useful context, not as an excuse. Keep momentum.
