# Configuration and Discord access

Set these environment values before starting Ask. A local install can read them from an untracked `.env` file.

| Variable            | Required | Description                           |
| ------------------- | -------- | ------------------------------------- |
| `DISCORD_CLIENT_ID` | Yes      | The Discord application ID.           |
| `DISCORD_TOKEN`     | Yes      | The bot token for that application.   |
| `OPENAI_API_KEY`    | Yes      | The API key used for OpenAI requests. |

Copy `.env.example` to `.env` for local use. Keep `.env` out of Git. Do not share its values in logs or support requests. A deployment can provide the same values through its secret store.

At startup, Ask checks that all three values are nonempty. Ask stops before creating clients when a value is missing.

## Discord setup

Invite Ask with the `bot` and `applications.commands` scopes. Grant View Channels, Send Messages, and Read Message History in channels where Ask can send replies. Ask does not require Administrator permission.

Enable the privileged Message Content intent in the Discord Developer Portal. Ask requests the `Guilds`, `GuildMessages`, `MessageContent`, and `DirectMessages` intents. It does not request data about server members, online states, voice calls, or reactions.

The slash command supports server, bot direct-message, and group direct-message contexts. Server message triggers require channel access. Direct-message triggers require the Direct Messages intent.

## Locale behavior

Ask uses the interaction locale first. It uses the server locale for server messages. It uses English (United States) when no locale is available. The locale files under `locales/` define supported command and help translations.
