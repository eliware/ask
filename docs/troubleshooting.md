# Troubleshooting

## Ask stops during startup

Set `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY`. Check that each value is nonempty and belongs to the intended account. For Docker Compose, keep `.env` in the repository root.

## Discord does not connect

Check that the bot token is current and belongs to the application ID. Enable Message Content in the Discord Developer Portal. Read startup errors with `docker compose logs -f ask` or from the terminal where Ask runs.

## A slash command does not appear

Invite Ask with both the `bot` and `applications.commands` scopes. Confirm that Discord lists Ask in the server or direct-message conversation. Start Ask again after command changes and allow Discord time to refresh the command list.

## Ask does not answer a server message

Ask replies when a message tags it, starts with its name, or replies to one of its messages. Enable the Message Content intent. Grant View Channels, Send Messages, and Read Message History where Ask requires access.

Ask ignores bot-authored messages and other server messages. Put the prompt after the tag or Ask's name. Ask removes user, role, and channel references before it sends the prompt.

## Ask does not answer in a direct message

Open a direct message with the bot and send a prompt. In a group direct message, use a slash command when Discord offers it. Ask handles message triggers only when Discord sends those messages to the bot.

## Docker reports that Ask is unhealthy

Run `docker compose ps` and `docker compose logs -f ask`. `/ready` returns `503` until Discord connects. Check the Discord token and network access before you change the health check.

## OpenAI requests fail

Check the OpenAI API key, account access, and provider result. Remove credentials and private message content before you share logs or screenshots.

## Web results or images do not appear

Ask for web lookup or image creation in the prompt. Check the OpenAI response and application logs. Confirm that Discord lets Ask send text and attach files in the channel.

See [setup](usage.md) for configuration steps. See [commands](commands.md) for request examples and [configuration](configuration.md) for permissions.
