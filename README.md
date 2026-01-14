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
  - [Schema and tables](#schema-and-tables)
  - [Create the database and user](#create-the-database-and-user)
  - [Backup and restore](#backup-and-restore)
  - [Docker / docker-compose tips](#docker--docker-compose-tips)
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

This bot optionally integrates with a MySQL/MariaDB database to record usage, enforce rate limits, and persist generated images. If you do not need persistence, you can run the bot without a configured DB (image persistence, rate-limits, and usage analytics will be disabled).

Key points:
- The app records a pre-call row in a `usage` table and updates it after the LLM response.
- Generated images (when present) may be stored in `usage_images` as binary BLOBs with JSON metadata.
- Schema dump for the database is included at `/opt/ask/schema.sql` in this repository (or generated by the maintainer).

### Schema and tables

The code expects the following tables (see `/opt/ask/schema.sql` for the exact CREATE statements):

- `usage` — records queries and responses plus metadata
- `usage_images` — stores image blobs and metadata with a FK to `usage`

You can consult `/opt/ask/schema.sql` for the complete table definitions and character-set options.

### Create the database and user

Example commands to create the `ask` database and a dedicated `ask` user with restricted privileges (run as a MySQL root user):

```sql
-- run in mysql shell as root
CREATE DATABASE IF NOT EXISTS `ask` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'ask'@'%' IDENTIFIED BY 'your_strong_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON `ask`.* TO 'ask'@'%';
-- Optional: grant LOCK TABLES and SHOW VIEW if you plan to run full dumps or use views
GRANT LOCK TABLES, SHOW VIEW ON `ask`.* TO 'ask'@'%';
FLUSH PRIVILEGES;
```

After creating the DB and user, apply the schema (from the repo) as root or a user with CREATE privileges:

```bash
mysql -u root -p ask < /opt/ask/schema.sql
# or, if you have the schema locally
mysql -u root -p ask < schema.sql
```

Notes:
- The code performs INSERT/UPDATE via prepared statements; ensure the DB user has INSERT and UPDATE rights.
- If you will allow the bot to write image BLOBs, ensure your MySQL instance has appropriate max_allowed_packet and disk capacity.

### Backup and restore

Backup (schema + data) with mysqldump:

```bash
# full dump (schema + data)
mysqldump -u root -p ask > ask_full_dump.sql

# schema only
mysqldump --no-data -u root ask > ask_schema.sql
```

Restore:

```bash
# restore schema/data
mysql -u root -p ask < ask_full_dump.sql
```

Permissions for dumps:
- For logical backups, mysqldump needs SELECT on all tables. LOCK TABLES is required for consistent dumps unless you use --single-transaction.

### Docker / docker-compose tips

If using a MySQL container, set the corresponding env vars in `.env` (MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE). Example docker-compose service snippet:

```yaml
services:
  mysql:
    image: mariadb:10.11
    environment:
      MYSQL_ROOT_PASSWORD: example_root_pw
      MYSQL_DATABASE: ask
      MYSQL_USER: ask
      MYSQL_PASSWORD: ask_pw
    volumes:
      - mysql-data:/var/lib/mysql

  ask:
    build: .
    env_file: .env
    depends_on:
      - mysql
```

When running in containers, use `docker exec` to run mysqldump inside the DB container if network access is restricted.

## Localization

Responses and help text are localized via JSON files under `locales/`. The default English help (locales/en-US.json) contains the bot's quick-help text and install link.

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
