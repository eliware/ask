# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/ask [![npm version](https://img.shields.io/npm/v/@eliware/ask.svg)](https://www.npmjs.com/package/@eliware/ask)[![license](https://img.shields.io/github/license/eliware/ask.svg)](LICENSE)[![build status](https://github.com/eliware/ask/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/ask/actions)

A modern Discord app built with Node.js, based on the [@eliware/discord](https://github.com/eliware/discord) foundation.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running as a Service (systemd)](#running-as-a-service-systemd)
- [Docker](#docker)
- [Customization](#customization)
  - [Commands](#commands)
  - [Events](#events)
  - [Locales](#locales)
- [Testing](#testing)
- [Support](#support)
- [License](#license)

## Features

- Discord.js-based app with ESM support
- Command and event handler architecture
- Multi-language/localized responses
- Environment variable support via dotenv
- Logging and signal handling via `@eliware/common`
- Ready for deployment with systemd or Docker
- Jest for testing

## Getting Started

1. **Clone this project:**

   ```bash
   git clone https://github.com/eliware/ask.git
   cd ask
   npm install
   ```

2. **Set up your environment:**
   - Copy `.env.example` to `.env` and fill in your Discord app token and other secrets.
   - Edit `package.json` (name, description, author, etc.)
   - Update this `README.md` as needed.

3. **Start the app locally:**

   ```bash
   npm start
   # or
   node ask.mjs
   ```

## Configuration

- All configuration is handled via environment variables in the `.env` file.
- See `.env.example` for required and optional variables.

## Running as a Service (systemd)

1. Copy `ask.service` to `/usr/lib/systemd/system/ask.service`.
2. Edit the paths and user/group as needed.
3. Reload systemd and start the service:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable ask
   sudo systemctl start ask
   sudo systemctl status ask
   ```

## Docker

1. Build the Docker image:

   ```bash
   docker build -t ask .
   ```

2. Run the container:

   ```bash
   docker run --env-file .env ask
   ```

## Customization

### Commands

- Add new commands in the `commands/` directory.
- Each command has a `.json` definition (for Discord registration/localization) and a `.mjs` handler (for logic).

### Events

- Add or modify event handlers in the `events/` directory.
- Each Discord event (e.g., `ready`, `messageCreate`, `interactionCreate`) has its own handler file.

### Locales

- Add or update language files in the `locales/` directory.
- Localize command names, descriptions, and app responses.

## Testing

- Run tests with:

  ```bash
  npm test
  ```

- Add your tests in the `tests/` folder or alongside your code.

## Support

For help, questions, or to chat with the author and community, visit:

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
