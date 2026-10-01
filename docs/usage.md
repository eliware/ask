# Usage

Start the bot locally with `node ask.mjs`. It logs in to Discord, registers the command definitions, loads event handlers and locales, and listens for interactions and messages.

Use `/ask <question>`, mention the bot with a prompt, reply to one of its messages, or send a direct message. The bot can answer questions, summarize or rewrite text, search the web, and generate images. Message-based requests include recent channel context when it is available. Use `!help` for localized help.

The process installs signal handlers and closes the Discord client during shutdown. Do not expose a production bot while testing local changes.
