# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

@eliware/ask [![License](https://img.shields.io/github/license/eliware/ask)](https://github.com/eliware/ask/blob/main/LICENSE) [![CI](https://github.com/eliware/ask/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/ask/actions/workflows/ci.yaml)

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
- [License](#license)
- [Links](#links)

## Features

Purpose:
Ask provides quick answers, web searches, and image generation through a Discord slash command or chat mention. It also supports replies to the bot, direct messages, localized responses, and recent channel context.

Ownership boundary: this repository owns the Ask Discord application and its container definition; shared package behavior, release procedures, production credentials, and deployment execution belong to their owners.

Package description: A concise Discord assistant ("/ask") for quick answers, web searches, and image generation — supports slash command, mention/DM fallbacks, localization, and usage tracking. Author: Eliware <eliware@eliware.org>. License: MIT.

## Requirements

Use Node.js 26 and npm. Running the bot requires a Discord application with a bot token and application ID, the Message Content privileged intent enabled in the Discord Developer Portal, and an OpenAI API key.

## Setup

Run `npm ci`, copy `.env.example` to an untracked `.env`, and set `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY`. Keep the `.env` file private. The [documentation index](docs/README.md) links user guidance; [specs/README.md](specs/README.md) indexes repository requirements.

## Usage

Run `node ask.mjs` to launch the bot locally. In Discord, use `/ask <question>` or mention the bot with a prompt. You can also reply to one of its messages or send it a direct message. Use `!help` for localized help. Image generation is available through `/ask` when requested.

Image: ghcr.io/eliware/ask
Pull command: docker pull ghcr.io/eliware/ask:v11.0.0
Supported tags: vMAJOR.MINOR.PATCH
Deployment boundary: publication does not deploy; deploy by immutable version tag and recorded sha256 digest.

## Development

Read [AGENTS.md](AGENTS.md), this README, and the [specification index](specs/README.md) before changing files. `commands/` contains command definitions and handlers, `events/` contains Discord event handlers, `locales/` contains translations, and `src/` contains focused application modules. Keep `tests/` mirrored to `src/`.

## Testing

Run `npm test` for Jest, 100% statement, branch, function, and line coverage of `src/`, lint, format-check, audit, and applicable convention checks through `eliware-test`. Run `npm run format:check` for read-only formatting validation. CI runs `npm ci` followed by `npm test`.

## Troubleshooting

If the bot does not connect, check that the Discord application ID and bot token are valid and that the configured intents are enabled. If requests fail, check the OpenAI API key and the provider response. Run `npm test` to validate the local checkout.

## Security

Keep Discord and OpenAI credentials in an untracked `.env` file or an authorized deployment secret store. Do not commit credentials, log tokens or private message contents, or grant Discord permissions beyond those listed below.

## Configuration

The application reads `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY` from the environment; all are required and have no defaults. `.env.example` lists these supported variables. There are no optional environment variables currently supported. `package.json` and `.knit/deploy.yaml` contain package and deployment metadata, not runtime configuration.

## Operations

Run `node ask.mjs` to start the bot locally; its shutdown handler closes the Discord client when the process receives a termination signal. For a local container, use `docker build -t ask .` and `docker run --env-file .env ask`. The root [Dockerfile](Dockerfile) runs `ask.mjs` as the unprivileged `node` user. Versioned releases use exact `vMAJOR.MINOR.PATCH` tags; the publish workflow builds the corresponding image tag after validation, then verifies its digest and signed attestation. Pull an authorized release with `docker pull ghcr.io/eliware/ask:<release-tag>`. The GHCR image is public. The bot exposes `/ask`, message mentions, replies, and direct messages; these are its externally observable workflows. Operational boundaries: validation does not publish or deploy; publication and deployment require separate authorized handoffs, and this repository does not deploy an image automatically.

## Commands

Purpose: Ask provides a single `/ask` command that accepts one required `query` string. It can answer questions, summarize or rewrite text, search the web, and generate images. `!help` sends localized usage guidance. The command definition and localized strings are in `commands/ask.json`; the handler is in `commands/ask.mjs`.

## Events

The bot handles Discord interactions, messages, client readiness, warnings, errors, debug events, and invalidation. Message handling responds to direct messages, mentions, and replies to the bot. It ignores messages from bots and unrelated server messages. Responses include recent channel messages when Discord provides them.

## Intents and permissions

The bot requests the `Guilds`, `GuildMessages`, `MessageContent`, and `DirectMessages` gateway intents. Enable the privileged Message Content intent in the Discord Developer Portal. The bot needs View Channels, Send Messages, and Read Message History in channels where it reads context and replies. Slash-command use also requires the command to be registered and available to the user. The command does not request administrator permissions.

## Support

For help or discussion, join the community:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## License

[license](LICENSE)

## Links

- Documentation: [docs](docs/README.md) · [specifications](specs/README.md)
- [Release Notes](RELEASE_NOTES.md)
- [Canonical repository profile specifications](https://github.com/eliware/test/blob/main/specs/conventions/README.md)
- [Home Page](https://github.com/eliware/ask#readme)
- [GitHub repository](https://github.com/eliware/ask.git)
- [Eliware](https://eliware.org)
- [GitHub organization](https://github.com/eliware)
- [GitHub profile](https://github.com/eli-sterling)
- [Discord](https://discord.gg/M6aTR9eTwN)
