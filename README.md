# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/ask [![npm version](https://img.shields.io/npm/v/@eliware/ask.svg)](https://www.npmjs.com/package/@eliware/ask)[![license](https://img.shields.io/github/license/eliware/ask.svg)](LICENSE)[![build status](https://github.com/eliware/ask/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/ask/actions)

Ask — a focused Discord application that provides quick answers, web searches, and image generation via a single /ask command or by mentioning the bot in chat. This repository contains the bot implementation, localization files, and deployment helpers (systemd / Docker). The project is based on the @eliware/discord foundations and is ready to adapt to your server.

---

## Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [Quick Start](#quick-start)  
- [Usage](#usage)  
  - [/ask command](#ask-command)  
  - [Message-based usage (mention/reply/DM)](#message-based-usage-mentionreplydm)  
- [Configuration](#configuration)  
- [Deployment](#deployment)  
  - [Run locally](#run-locally)  
  - [systemd service](#systemd-service)  
  - [Docker](#docker)  
- [Database & Telemetry](#database--telemetry)  
- [Localization](#localization)  
- [Development & Testing](#development--testing)  
- [Support](#support)  
- [License](#license)  
- [Links](#links)

## Overview

Ask is a concise assistant for Discord that supports:
- Short answers, summaries, and rewrites
- Quick web searches to surface sources
- Simple image generation (via the bot's image tool)
- Context-aware replies by including recent channel messages
- Usage tracking and optional persistence of generated images

The bot is intentionally concise: the system prompt instructs responses to be succinct and to not identify as "ChatGPT" or "OpenAI".

## Features

- Single `/ask` command with natural language input
- Message fallback: mention the bot, DM it, or reply to a bot message to invoke /ask
- Automatic inclusion of recent message history (up to 100 messages) for context
- Image generation support (returns images as attachments or URLs)
- Rate limiting (per-user, per-channel, per-guild) enforced via the usage DB
- Usage and response metadata stored to a `usage` table; generated images saved to `usage_images` when enabled
- Locales support for multi-language replies (see locales/)
- Ready-to-run with systemd or Docker
- Testable with Jest

## Quick Start

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/eliware/ask.git
   cd ask
   npm install
   ```

2. Copy and edit environment variables:

   ```bash
   cp .env.example .env
   # edit .env and add your Discord token, DB credentials, OpenAI/API keys, etc.
   ```

3. Start locally:

   ```bash
   npm start
   # or
   node ask.mjs
   ```

## Usage

### /ask command

Use the slash command for structured usage:

- Examples:
  - /ask explain recursion in simple terms
  - /ask summarize the last 3 messages
  - /ask draft a 3-item meeting agenda about onboarding
  - /ask generate a simple red circle on a white background --image

The handler will:
- Defer the reply (typing indicator) while contacting the backend
- Include recent channel history when available
- Return text and attach generated images (files or URLs)
- Split long replies into multiple messages when needed

### Message-based usage (mention/reply/DM)

The bot also listens for messages and will create a lightweight mock interaction when:
- The bot is mentioned in a server message
- The message is a reply to a message previously sent by the bot
- The bot receives a DM

Behavior:
- Strips the mention and uses the remaining text as the prompt (falls back to "Hello!" if empty)
- Replies in-channel (or DMs user if response is ephemeral)
- Uses blockquote formatting per-line for message-originated replies
- Respects Discord message length limits (chunks to 2000 characters)

## Configuration

All runtime configuration is via `.env`. Copy `.env.example` to `.env` and provide required values:

- DISCORD_TOKEN / DISCORD_CLIENT_ID / DISCORD_PUBLIC_KEY (Discord app credentials)
- DATABASE_URL or DB connection details (optional, required for usage tracking & image persistence)
- OPENAI_KEY or other model API credentials (if using external LLM/image tools)
- LOG_LEVEL, NODE_ENV, and other standard variables

See `.env.example` for the complete list.

## Deployment

### Run locally

Start with `npm start` or `node ask.mjs`. Ensure your `.env` is populated.

### systemd service

A sample `ask.service` (included) facilitates running the app as a systemd service:

1. Copy `ask.service` to `/usr/lib/systemd/system/ask.service` and adjust paths/user.
2. Reload and start:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable ask
   sudo systemctl start ask
   sudo systemctl status ask
   ```

### Docker

Build and run:

```bash
docker build -t ask .
docker run --env-file .env ask
```

## Database & Telemetry

When a DB is configured, the bot records usage for rate limiting, analytics, and debugging:

- `usage` (inserted pre-call, updated after response)
  - Example columns used by the code: id, user_id, user_name, channel_id, channel_name, guild_id, guild_name, query, response_text, model, model_full, tokens_used, input_tokens, output_tokens, total_tokens, response_ms, completed_at, safety_violations, error_flag, request_id, response_meta, response_status, service_tier, created_at

- `usage_images`
  - Example columns: id, usage_id, filename, mime, data (binary), meta (json), created_at

Notes:
- SQL calls use prepared statements for parameterized inputs. The code dynamically constructs queries for internal field names when counting rate limits (these field names are not user-supplied).
- Rate limits are enforced server-side with defaults (configurable): hourly and daily caps per user/channel/guild.

If you intend to enable persistence, create the tables consistent with the above columns or adapt the code to your schema.

## Localization

Responses and help text are localized via JSON files under `locales/`. The default English help (locales/en-US.json) contains the bot's quick-help text and install link:

- Example help text is in locales/en-US.json and used for ephemeral help replies and /help fallbacks.

Add or edit locale files to localize command names, descriptions, and bot responses.

## Development & Testing

- Tests are run with Jest:

  ```bash
  npm test
  ```

- Command handlers live in `commands/` (e.g., `commands/ask.mjs`).
- Event handlers live in `events/` (e.g., `events/messageCreate.mjs`).
- The ask handler expects an interaction-like object and supports both real interactions and the lightweight mock created by the messageCreate handler.

Tips:
- The code attempts to import `@eliware/discord` split helpers when available for message chunking; this is optional.
- Typing indicator is kept alive with an interval while processing message-originated requests — ensure that any custom handlers clear this interval on completion to avoid stray timers.

## Support

For help or discussion, join the community:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## License

[MIT © 2025 Eli Sterling, eliware.org](LICENSE)

## Links

- [Home Page](https://eliware.org)  
- [GitHub Repo](https://github.com/eliware/ask)  
- [GitHub Org](https://github.com/eliware)  
- [GitHub Personal](https://github.com/eli-sterling)  
- [Discord](https://discord.gg/M6aTR9eTwN)
