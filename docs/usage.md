# Setup and first run

Ask needs a Discord application, a bot token, and an OpenAI API key. Use Node.js 26 or later and npm 12 or later for a source install.

## Create and invite the bot

1. Create an application in the [Discord Developer Portal](https://discord.com/developers/applications).
2. Add a bot to the application and copy its token.
3. Copy the application ID from the application page.
4. Enable the privileged Message Content intent on the Bot page.
5. Use OAuth2 URL Generator to select the `bot` and `applications.commands` scopes.
6. Select View Channels, Send Messages, and Read Message History permissions.
7. Open the generated URL and add the bot to your server.

Ask requires the Message Content intent to read message triggers and channel context. Ask does not require Administrator permission.

## Install Ask from source

1. Clone this repository and open its directory.

   ```sh
   git clone https://github.com/eliware/ask.git
   cd ask
   ```

2. Copy `.env.example` to `.env`.
3. Replace the example values with your Discord application ID, bot token, and OpenAI API key.
4. Install the locked dependencies.

   ```sh
   npm ci
   ```

5. Start Ask.

   ```sh
   node bin/ask.mjs
   ```

6. Invite the bot to a test server before you try server commands.

See [configuration](configuration.md) for each value. See [commands](commands.md) for ways to use Ask.

## Stop Ask

Use Ctrl+C in the terminal. Ask closes the Discord client when it receives a stop signal.

## Data sent for a response

Ask sends the current prompt and no more than 100 earlier text messages from the channel to the OpenAI API. Ask excludes the message that started a message-trigger request from earlier history. Earlier messages can include content from other channel members.

Ask sets the OpenAI Responses API `store` option to `false`. Discord receives the response in the channel or direct message that started the request. Get agreement from message authors before you use Ask with private channel content.
