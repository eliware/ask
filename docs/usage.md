# Usage

Start the bot with `node bin/ask.mjs`. The application loads its settings, registers its command definitions, loads event handlers and locales, then connects to Discord.

Use `/ask` with a question. You can also address the bot with a prompt, reply to one of its messages, or send a direct message. The bot can answer questions, summarize or rewrite text, look up web results, and create images. Message-based requests can use recent channel context when Discord provides it.

Use `!help` to see localized help. The bot ignores messages from other bots and unrelated server messages.

Send a termination signal to stop the process. The application closes the Discord client during shutdown. Do not expose a production bot while testing local changes.
