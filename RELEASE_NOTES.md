# Release Notes

## 15.1.1 — 2026-11-01

### Added

- Added `HEALTH_HOST` to configure the address used by `/health` and `/ready`.
- Added Read Message History to the permissions declared for `/ask` and `/help`.

### Changed

- Reorganized application modules and tests into focused directories by responsibility.
- Updated setup, usage, configuration, and deployment guidance for the current application behavior.
- Updated the package version and lockfile to 15.1.1.

### Fixed

- Fixed health server cleanup when startup fails or shutdown arrives during startup.
- Fixed stale readiness after health server listener errors and Discord session invalidation.
- Fixed message responses that combine maximum-length text with image URLs.
- Rejected malformed base64 image data and image URLs that do not use HTTP or HTTPS.
- Rejected empty locale catalog values during validation.

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
