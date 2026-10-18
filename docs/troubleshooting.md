# Troubleshooting

Confirm that `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `OPENAI_API_KEY` are set in the untracked `.env` file or deployment secret store.

If the bot cannot connect, verify the application ID, bot token, and enabled gateway intents. Message-based responses require the Message Content privileged intent and the required channel permissions. If answer, web lookup, or image-creation requests fail, verify the OpenAI key and the provider response.

Run `npm test` from the repository root to check the checkout. Do not paste tokens or private message contents into issue reports.
