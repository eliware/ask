# Configuration and Discord access

Set these environment values before you start Ask. A source install reads `.env` from the repository root. Docker Compose reads `.env` from the directory where `docker compose` runs.

| Variable            | Required | Description                                            |
| ------------------- | -------- | ------------------------------------------------------ |
| `DISCORD_CLIENT_ID` | Yes      | The Discord application ID.                            |
| `DISCORD_TOKEN`     | Yes      | The bot token for that application.                    |
| `OPENAI_API_KEY`    | Yes      | The API key for OpenAI requests.                       |
| `HEALTH_HOST`       | No       | The health server address. The default is `127.0.0.1`. |

Copy `.env.example` to `.env` for a source install. Replace every example value. Ask stops before it creates clients if a required value is missing or empty.

Keep `.env` out of Git. Use a deployment secret store for deployed instances. Do not include credentials in logs, screenshots, or support requests.

## Health server

Ask serves `GET /health` and `GET /ready` on port `3000`. The health route returns `200` while its server responds. The readiness route returns `503` until Discord connects.

Set `HEALTH_HOST=0.0.0.0` when a Kubernetes HTTP check must access the health server through a Pod IP. Keep the default for local runs. Docker Compose checks the route inside the container and does not publish the health port.

## Discord access

Invite Ask with the `bot` and `applications.commands` scopes. Give the bot View Channels, Send Messages, and Read Message History in channels where it requires context or sends replies. Give the bot Attach Files for generated image files and Embed Links for linked image previews. Ask does not require Administrator permission.

Enable the privileged Message Content intent in the Discord Developer Portal. Ask requests these intents:

- `Guilds`
- `GuildMessages`
- `MessageContent`
- `DirectMessages`

Ask does not request server member lists, online status, voice, reactions, or scheduled-event data. Slash commands support server, bot direct-message, and group direct-message contexts. Server message triggers require channel access.

## Locale behavior

Slash commands use the Discord request locale first, then the server locale, then English (United States). Server message triggers use the server locale. Direct-message triggers use English (United States). Users can request a different response language in their prompt.

Ask provides command and help translations for these locales:

`bg`, `cs`, `da`, `de`, `el`, `en-GB`, `en-US`, `es-419`, `es-ES`, `fi`, `fr`, `hi`, `hr`, `hu`, `id`, `it`, `ja`, `ko`, `lt`, `nl`, `no`, `pl`, `pt-BR`, `ro`, `ru`, `sv-SE`, `th`, `tr`, `uk`, `vi`, `zh-CN`, and `zh-TW`.
