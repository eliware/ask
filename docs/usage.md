# Setup and first run

Ask requires a Discord application, a bot token, and an OpenAI API key. Use Node.js 26 or later and npm 12 or later for a local install.

## Create the Discord application

1. Create an application in the Discord Developer Portal.
2. Add a bot to the application and copy its token.
3. Copy the application ID from the application page.
4. Enable the privileged Message Content intent on the Bot page.
5. Invite the bot with the `bot` and `applications.commands` scopes.
6. Grant View Channels, Send Messages, and Read Message History in each server channel where Ask can send replies.

Ask requires the Message Content intent for message triggers and channel context. Do not grant Administrator permission.

## Configure a local install

1. Clone the repository and open its root directory.
2. Copy `.env.example` to `.env`.
3. Set `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY` in `.env`.
4. Run `npm ci` to install the locked dependencies.
5. Run `node bin/ask.mjs` to start Ask.
6. Invite the bot to a test server before you try server commands.

See [Configuration](configuration.md) for each value and [Commands](commands.md) for ways to use Ask.

## Stop a local install

Send `SIGINT` or `SIGTERM` to the process. Ask closes its Discord client during shutdown.

## Data sent for a response

Ask sends the current question and available recent channel messages to the OpenAI API. The API request sets `store` to `false`. Discord receives the response in the channel or direct message that started the request.
