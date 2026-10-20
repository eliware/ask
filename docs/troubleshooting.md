# Troubleshooting

Check that `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY` have values in the untracked `.env` file or deployment secret store. Do not share these values in logs or support requests.

If the bot cannot connect, check that the application ID and bot token belong to the same Discord application. Confirm that the bot is online and that its invite includes the `applications.commands` scope.

If `/ask` does not appear, check the command scope and that Discord has synchronized the command definitions. If message requests do not work, enable the Message Content privileged intent and grant access to the channel. Direct messages require the Direct Messages intent.

If an answer, web lookup, or image request fails, check the OpenAI API key, account access, and provider status. Check application logs for the error, but remove tokens and private message content before sharing logs.

Use the root README for required intents, permissions, and setup details.
