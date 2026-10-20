# Ask documentation

Use this directory to learn how to configure, use, and troubleshoot the Ask Discord application. The root README describes features, requirements, permissions, and the published container image.

## Setup

Install Node.js 26 or later and npm 12 or later. Run `npm ci` from the repository root. Copy `.env.example` to an untracked `.env` file, then set `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY`.

## Run the bot

Start the bot with `node bin/ask.mjs`. Use `/ask` with a question, address the bot with a prompt, reply to one of its messages, or send it a direct message. The bot can answer, summarize, rewrite, find web results, and create images. Message requests can include recent channel context. Use `!help` for localized help.

## Connect Discord

Create a Discord application and bot. Invite it with the `applications.commands` scope and the permissions listed in the root README. Enable the privileged Message Content intent for message-based requests. Keep the application ID, token, and OpenAI key private.

## Stop the bot

Send a termination signal to stop the bot. The application closes its Discord client during shutdown.

## Support

See the troubleshooting guide for connection, permission, and provider checks. For community support, use the Discord link in the root README.

## Contents

- [Usage](usage.md)
- [Troubleshooting](troubleshooting.md)
