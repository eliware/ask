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

Ask answers questions, looks up web results, summarizes text, rewrites text, and creates images in Discord.

## Requirements

Use Node.js 26 or later and npm 12 or later to run Ask from source. Create a Discord application and an OpenAI API key.

## Setup

Follow the [setup guide](docs/usage.md) to configure Discord, set credentials, and start Ask.

## Usage

Read the [user guides](docs/README.md) for commands, configuration, and deployment. Read [release notes](RELEASE_NOTES.md) for release history.

## Development

Read [AGENTS.md](AGENTS.md) for repository instructions. Read [the documentation index](docs/README.md) and [the specifications index](specs/README.md) for maintained guidance and requirements.

## Testing

Run `npm test` to validate the repository.

## Troubleshooting

Use the [troubleshooting guide](docs/troubleshooting.md) to resolve setup, Discord, and provider issues.

## Security

Keep Discord and OpenAI credentials private. Do not share tokens or private message content.

## Configuration

Set the required environment values. See the [configuration guide](docs/configuration.md) for details.

## Operations

Run `node bin/ask.mjs` from source or use Docker Compose. See the [deployment guide](docs/deployment.md) for container instructions.

## Commands

Use `/ask query:<text>` or `/help`. You can tag Ask, reply to an Ask message, or message Ask directly. See the [command guide](docs/commands.md).

## Events

Ask handles commands and messages. It marks readiness after Discord connects and clears readiness when Discord invalidates a session. It logs warnings, errors, and debug events. See the [user guides](docs/README.md).

## Intents and permissions

Ask requests the `Guilds`, `GuildMessages`, `MessageContent`, and `DirectMessages` intents. Enable Message Content and grant View Channels, Send Messages, and Read Message History. Grant Attach Files for generated images and Embed Links for image previews. Ask does not require Administrator permission. See [Discord access](docs/configuration.md#discord-access).

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
