# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/ask [![License](https://img.shields.io/github/license/eliware/ask)](https://github.com/eliware/ask/blob/main/LICENSE) [![CI](https://github.com/eliware/ask/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/ask/actions/workflows/ci.yaml)

A Discord assistant for short answers, web lookup, and image generation. Supports slash commands, direct-message triggers, localization, and usage tracking.

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

Ask answers questions, looks up web results, and creates images through Discord. It supports address mentions, replies, direct messages, localized help, and recent channel context.

## Requirements

Use Node.js 26 or later and npm 12 or later for repository validation. Bot startup requires a Discord application and an OpenAI API key.

## Setup

Copy `.env.example` to an untracked `.env` file. Set `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY` in that file. Run `npm ci` from the repository root.

## Usage

Run `node bin/ask.mjs` to start the bot. Use `/ask <question>`, address the bot, reply to its message, or send a direct message. Use `!help` for localized help. Read the [release notes](RELEASE_NOTES.md) for release history.

The GHCR image packages this Discord assistant. The image builds for `linux/amd64` and uses the public `ghcr.io/eliware/ask` package. Pull a version with `docker pull ghcr.io/eliware/ask:v13.0.0`. Image publication does not deploy the bot. Deploy with an immutable version tag and record its SHA-256 digest.

## Development

Read [AGENTS.md](AGENTS.md), [docs/README.md](docs/README.md), and [specs/README.md](specs/README.md) before you change files. Command adapters live in `commands/`. Event adapters live in `events/`. Handlers live in `src/commands/` and `src/events/`. Locale files live in `locales/`.

## Testing

Run focused tests first during development. Run one test file with `npm test -- tests/path/to/example.test.mjs`. Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`. Run `npm test` for final validation. CI runs `npm ci` and `npm test`.

## Troubleshooting

If the bot cannot connect, verify the Discord application ID, token, and enabled intents. If OpenAI requests fail, verify the API key and provider status.

## Security

Keep Discord and OpenAI credentials in an untracked `.env` file or an approved secret store. Do not commit credentials or log tokens or private message content.

## Configuration

The application requires `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY`. The `.env.example` file lists these variables. The application has no optional environment variables.

## Operations

Run `node bin/ask.mjs` to start the bot. A termination signal closes the Discord client. Build a local image with `docker build -t ask .`. Run it with `docker run --env-file .env ask`.

The root [Dockerfile](Dockerfile) starts the bot as the unprivileged `node` user. Image publication does not deploy the bot. Use a separate GitOps handoff to deploy it.

## Commands

The bot provides the `/ask` command with one required `query` string. It can answer, summarize, rewrite, look up web results, and create images. The `!help` command provides localized usage details. Command definitions and adapters are in `commands/`. Handlers are in `src/commands/`.

## Events

The bot handles interactions, messages, readiness, warnings, errors, debug events, and invalidation. It ignores messages from bots and unrelated server messages. It uses recent channel messages when Discord provides them.

## Intents and permissions

The bot requests the `Guilds`, `GuildMessages`, `MessageContent`, and `DirectMessages` intents. Enable the privileged Message Content intent in the Discord Developer Portal. Grant View Channels, Send Messages, and Read Message History permissions. Do not grant administrator permissions.

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
