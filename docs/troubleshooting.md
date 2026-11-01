# Troubleshooting

## Ask will not start

Check that `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY` have values. Confirm that the application ID and bot token belong to the same Discord application. Keep the values private when you inspect logs.

## A command does not appear

Confirm that you invited Ask with the `applications.commands` scope. Start Ask again after changing command definitions. Discord may require time to refresh command data.

## Ask cannot read or answer a message

Enable Message Content in the Discord Developer Portal. Check that the bot can view the channel, send messages, and read message history. For direct messages, confirm that the user opened a conversation with the bot.

## OpenAI requests fail

Check the OpenAI API key, account access, and provider status. Check the application error logs for the request failure. Remove tokens and private message content before sharing logs.

## An image or web lookup does not appear

Confirm that the request asks for a web lookup or image. Check that Discord allows Ask to send the reply or file. Check application logs for provider errors.

For setup and permission steps, see [Configuration](configuration.md). For supported request forms, see [Commands](commands.md).
