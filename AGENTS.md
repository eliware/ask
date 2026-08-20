# AGENTS.md (/opt/ask)

Project: @eliware/ask

## Purpose

Ask is a Discord bot with a primary `/ask` command plus mention/reply/DM fallbacks. It provides concise answers, rewrites, summaries, web-search style help, and images. It uses ES modules, localization, optional MySQL persistence, and supports systemd and Docker deployment.

## Key files

- `ask.mjs` — app entry point
- `commands/` — command definitions and handlers
- `events/` — Discord event handlers
- `locales/` — localized command/help strings
- `tests/` — Jest tests
- `ask.service` — systemd unit
- `Dockerfile` — container build
- `.env.example` — runtime config template
- `README.md` — project docs

## Working rules

- Read `README.md` and `package.json` before changing behavior.
- Inspect the relevant command/event/locale/schema file before editing.
- Keep changes narrow and match the existing style.
- Preserve concise bot responses unless asked otherwise.
- Update `.env.example` and `README.md` together when config or runtime behavior changes.

## Runtime notes

- Entry startup order: OpenAI client, Discord client.
- Presence format: `ask v<version>`.
- Bot intents include `Guilds`, `GuildMessages`, `MessageContent`, and `DirectMessages`.

## Discord notes

- `/ask` is the main path.
- Mention/reply/DM fallback behavior matters and should keep working.
- Keep Discord message length and attachment limits in mind.
- Localization is required for command names, descriptions, and option metadata.

- Be careful: schema changes affect rate limiting, auditing, and image storage.

## Testing

- Run `npm test` for command, event, locale, or schema-related changes.
- Add or update tests when behavior changes.
- If tests cannot cover the change, document manual validation.

## Deployment / ops

- Do not run deployment, sync, tagging, or cluster-wide maintenance commands unless explicitly requested.
- Avoid changing `ask.service` or `Dockerfile` unless the task is deployment-related.
- Keep documentation changes single-purpose.
- Do not over-engineer simple tasks.
- Do not guess when confused.
- Do not make random, pointless changes.
- Check your own work before saying you're done.
