# AGENTS.md

## Project

Repository: `eliware/ask`. Purpose: provide a Discord assistant for answers, web searches, and image generation through `/ask` and message interactions.

## Scope and boundaries

Scope: this repository owns the Ask Discord application, its command and event handlers, localization, and container definition. It does not own shared package behavior, company-wide release procedures, production credentials, or deployment execution. This AGENTS.md applies repository-wide; any nearer AGENTS.md applies within its subdirectory. Read README.md, AGENTS.md, and applicable documentation before changing files.

## Layout

The required application structure includes `src/` and its mirrored `tests/`, root `README.md`, `AGENTS.md`, `specs/README.md`, and `docs/README.md`. `ask.mjs` starts the bot. `commands/`, `events/`, and `locales/` contain Discord integration code and data. `docs/` contains user documentation, `specs/` indexes structured repository requirements, and `.knit/deploy.yaml` defines deployment commands.

## Development

Read README.md, AGENTS.md, and applicable documentation before changing files. These instructions apply repository-wide; any nearer AGENTS.md applies within its subdirectory. The single-responsibility requirement means one cohesive purpose and one reason to change. Business-logic modules and coordinators are valid, including coordinators of coordinators, when each module owns one distinct responsibility. Put every distinct new responsibility in a focused submodule wired through its owner; do not add the new responsibility to an existing module. Refactor mixed responsibilities you find during ordinary review. Line counts do not establish single responsibility; passing the 100-line source and 200-line test maxima does not prove cohesion or permit mixed responsibilities. Keep each source module paired with its mirrored test, refactor them when their responsibilities mix, and remember that passing them does not prove cohesion.

Project-specific requirements add detail without weakening shared requirements. They do not waive shared requirements. Maintain the files and structure required by the application and Discord profiles.

## Validation

Use Node.js 26 and npm. Implementation modules use native ESM `.mjs` files; runtime environment settings are loaded from `.env` and the process environment. Run validation with `npm ci` after dependency changes and `npm test` before handoff. Aggregate validation runs Jest and coverage, lint, format-check, audit, and applicable profile checks through `eliware-test`. Use `npm run lint`, `npm run audit`, `npm run format`, and `npm run format:check` for individual stages. `npm run format` writes files; `format:check` is read-only. CI runs `npm ci` followed by `npm test`.

## Security

Protect Discord tokens, OpenAI keys, message content, and machine-specific values. Keep runtime credentials in untracked `.env` files or the authorized secret store. Do not commit plaintext secrets or log credentials or private message content. Grant only the Discord intents and permissions documented in README.md.

## Changes

Keep changes actionable, current, and concise. Preserve documented behavior and test coverage. Record approved deviations with their reason, approver, and expiry. Do not publish, deploy, or change external systems without explicit authorization through the Eliware Operations handoff.

## Application

The executable entrypoint is `ask.mjs`; it starts the Discord client and registered handlers. Runtime configuration is loaded from `.env` and the environment; `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY` are all required and have no defaults. The process lifecycle registers signal handlers that close the Discord client safely and idempotently. Validation is read-only and does not modify external state. Package metadata and `.knit/deploy.yaml` are not runtime configuration. Operational boundaries are documented in the README.

## Discord

`commands/` contains command definitions and handlers, `events/` contains gateway event handlers, and `locales/` contains translations. The bot uses Guilds, GuildMessages, MessageContent, and DirectMessages intents. The Message Content privileged intent must be enabled in the Discord Developer Portal. Required channel permissions are View Channels, Send Messages, and Read Message History. Keep bot credentials private and review intent and permission changes against README.md.

## GHCR publication

The image name is `ghcr.io/eliware/ask`; it is built from the repository-root Dockerfile and context for `linux/amd64`. Image visibility is public. `.github/workflows/publish.yml` validates exact package-version tags, publishes the image, creates a signed GitHub artifact provenance attestation, and verifies the tag and digest. GitHub must protect the `ghcr-publish` environment with Eli as a required reviewer. Publication requires the Operations release handoff. Any rollout requires a separate GitOps deployment handoff; publication alone does not deploy. The workflow uses its scoped `GITHUB_TOKEN` for registry credentials.
