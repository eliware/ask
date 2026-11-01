# Commands and message triggers

Ask supports Discord slash commands and message triggers. The bot replies in the channel or direct message that received the request.

## Slash commands

| Command             | Use                              | Result                                                              |
| ------------------- | -------------------------------- | ------------------------------------------------------------------- |
| `/ask query:<text>` | Ask a question or give a prompt. | Returns an answer, web results, or generated images when requested. |
| `/help`             | Ask for command help.            | Shows localized usage guidance.                                     |

The `query` option is required. Ask may include at most 100 earlier text messages from the current channel when Discord allows access. For message triggers, Ask excludes the message that started the request.

## Message triggers

- In a server, address Ask by name and add a prompt.
- In a server, reply to an Ask message with a prompt.
- In a direct message or group direct message, send a prompt.
- Send `!help` to get localized help in a message.

Ask ignores messages from bots. Ask ignores server messages unless they address Ask by name, tag Ask, or reply to its own message. Ask removes Discord user, role, and channel references before it sends the prompt. If a message trigger has no prompt text, Ask sends `Hello!` as the prompt.

## Response behavior

Ask can answer questions, summarize text, rewrite text, look up web results, and create images. Message-trigger replies use plain text. Ask splits long replies into chunks with a 2,000-character maximum. Slash-command replies use blockquote formatting and may span multiple messages.

Ask uses the request locale or the server locale for its response language. Users can request a different language or answer length in the prompt. Localized slash-command names and help messages are available for the locale files in `locales/`.
