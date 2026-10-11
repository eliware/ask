# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/ask [![License](https://img.shields.io/github/license/eliware/ask)](https://github.com/eliware/ask/blob/main/LICENSE) [![CI](https://github.com/eliware/ask/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/ask/actions/workflows/ci.yaml)

A concise Discord assistant ("/ask") for quick answers, web searches, and image generation — supports slash command, mention/DM fallbacks, localization, and usage tracking.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Configuration](#configuration)
- [Operations](#operations)
- [Commands](#commands)
- [Events](#events)
- [Intents and permissions](#intents-and-permissions)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

Ask answers questions, searches the web, and generates images through Discord. It supports mentions, replies, direct messages, localized help, and recent channel context.

## Requirements

Use Node.js 26 or later and npm. Bot startup needs a Discord application and an OpenAI API key.

## Setup

Run `npm ci`. Copy `.env.example` to an untracked `.env`. Set `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY` in `.env`.

## Usage

Run `node bin/ask.mjs` to start the bot. Use `/ask <question>`, mention the bot, reply to its message, or send it a direct message. Use `!help` for localized help. Read the [release notes](RELEASE_NOTES.md) for version changes.

Image: ghcr.io/eliware/ask
Pull command: docker pull ghcr.io/eliware/ask:v12.0.0
Supported tags: vMAJOR.MINOR.PATCH
Deployment boundary: publication does not deploy; deploy by immutable version tag and recorded sha256 digest.

## Development

Read [AGENTS.md](AGENTS.md), [docs/README.md](docs/README.md), and [specs/README.md](specs/README.md) before changes. Command adapters live in `commands/`. Event adapters live in `events/`. Handlers live in `src/commands/` and `src/events/`. Locale files live in `locales/`.

## Testing

Run `npm test` for Jest coverage and Eliware validation. Run `npm run format:check` for read-only format validation. CI runs `npm ci` and `npm test`.

## Troubleshooting

If the bot cannot connect, check the Discord application ID, token, and enabled intents. If OpenAI requests fail, check the API key and provider status.

## Security

Keep Discord and OpenAI credentials in an untracked `.env` file or an authorized secret store. Do not commit credentials or log tokens or private message content.

## Configuration

The application requires `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY`. The `.env.example` file lists these variables. The application has no optional environment variables.

## Operations

Run `node bin/ask.mjs` to start the bot. The shutdown handler closes the Discord client after a termination signal. Build a local image with `docker build -t ask .`. Run it with `docker run --env-file .env ask`. The root [Dockerfile](Dockerfile) starts the bot as the unprivileged `node` user. Image publication does not deploy the bot. Deployment needs a separate GitOps handoff.

## Commands

The bot provides the `/ask` command with one required `query` string. It can answer, summarize, rewrite, search the web, and generate images. The `!help` command provides localized usage details. Command definitions and adapters are in `commands/`. Handlers are in `src/commands/`.

## Events

The bot handles interactions, messages, readiness, warnings, errors, debug events, and invalidation. It ignores messages from bots and unrelated server messages. It uses recent channel messages when Discord provides them.

## Intents and permissions

The bot requests the `Guilds`, `GuildMessages`, `MessageContent`, and `DirectMessages` intents. Enable the privileged Message Content intent in the Discord Developer Portal. The bot needs View Channels, Send Messages, and Read Message History. It does not need administrator permissions.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/ask)
- [Bug Reports](https://github.com/eliware/ask/issues)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
