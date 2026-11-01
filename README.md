# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/ask [![License](https://img.shields.io/github/license/eliware/ask)](https://github.com/eliware/ask/blob/main/LICENSE) [![CI](https://github.com/eliware/ask/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/ask/actions/workflows/ci.yaml)

A Discord assistant for short answers, web lookup, and image generation. Supports slash commands, direct-message triggers, and localization.

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

Ask answers questions, looks up web results, and creates images through Discord. It supports localized commands, direct messages, address mentions, replies, and channel context.

## Requirements

Use Node.js 26 or later and npm 12 or later. Bot startup requires a Discord application and an OpenAI API key.

## Setup

Follow the [setup guide](docs/README.md) to configure Discord, set environment values, and start the bot.

## Usage

Read the [user guides](docs/README.md) for commands, configuration, and deployment. Read [release notes](RELEASE_NOTES.md) for release history.

## Development

Read [AGENTS.md](AGENTS.md), [the documentation index](docs/README.md), and [the specifications index](specs/README.md) before changing files.

## Testing

Run `npm test` for aggregate validation. CI installs dependencies with `npm ci` and runs `npm test`.

## Troubleshooting

Use the [troubleshooting guide](docs/troubleshooting.md) to check credentials, Discord access, and provider errors.

## Security

Keep Discord and OpenAI credentials in an untracked `.env` file or an approved secret store. Do not share tokens or private message content.

## Configuration

Set `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY`. See the [configuration guide](docs/configuration.md).

## Operations

Run `node bin/ask.mjs` for a local start. The public GHCR image packages Ask for container use. Pull it with a version tag or deploy by its recorded SHA-256 digest. Publication does not deploy the bot. See the [deployment guide](docs/deployment.md) for container commands and shutdown behavior.

## Commands

Use `/ask` with a required question or prompt. Use `/help` or `!help` for localized help. See the [command guide](docs/commands.md).

## Events

The bot handles command interactions, messages, readiness, warnings, errors, debug events, and invalidation. It ignores bot messages and unrelated server messages.

## Intents and permissions

The bot requests the `Guilds`, `GuildMessages`, `MessageContent`, and `DirectMessages` intents. Enable Message Content in the Discord Developer Portal. Grant View Channels, Send Messages, and Read Message History. Do not grant administrator access. Supported locales are `bg`, `cs`, `da`, `de`, `el`, `en-GB`, `en-US`, `es-419`, `es-ES`, `fi`, `fr`, `hi`, `hr`, `hu`, `id`, `it`, `ja`, `ko`, `lt`, `nl`, `no`, `pl`, `pt-BR`, `ro`, `ru`, `sv-SE`, `th`, `tr`, `uk`, `vi`, `zh-CN`, and `zh-TW`.

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
