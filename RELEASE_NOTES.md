# Release Notes

## 15.1.1 — 2026-11-01

### Changed

- Added optional `HEALTH_HOST` configuration for health server binding. The default remains `127.0.0.1`.

## 15.1.0 — 2026-11-01

### Added

- Added `/health` and `/ready` endpoints. The `/ready` endpoint returns `503` until Discord emits `clientReady`.
- Added a Docker Compose health check for the readiness endpoint.
- Added setup, command, configuration, deployment, and troubleshooting guides.

### Changed

- Updated the Discord integration and Eliware dependencies from version 1 to version 15.
- Updated the runtime entry point to `bin/ask.mjs` and grouped source modules and tests by purpose.
- Changed response generation to use `gpt-6-luna` with low reasoning.
- Added server locale fallback when Discord does not provide an interaction locale.
- Added the 100 most recent earlier channel messages to conversation context and excluded the request message.
- Updated shutdown to close Discord and health server resources cleanly.
- Updated GHCR publication to use version tags and record the image digest. Publication does not deploy the bot.
- Removed runnable examples and their documentation links.

### Fixed

- Fixed slash-command image replies that displayed `[object Object]` as text.
- Split long quoted replies to keep each message under Discord's 2,000-character limit.
- Fixed Docker Compose health-check command quoting.
- Improved response parsing and log sanitization.
- Excluded local `.env` files from Docker builds, kept `.env.example`, and added image validation.
- Cleared readiness when Discord invalidates its session. A later `clientReady` event restores readiness.
