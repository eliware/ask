# Commands and message triggers

Ask answers prompts in the channel or direct message that received them.

## Slash commands

| Command             | Use                              | Result                                                              |
| ------------------- | -------------------------------- | ------------------------------------------------------------------- |
| `/ask query:<text>` | Ask a question or give a prompt. | Returns an answer, web results, or generated images when requested. |
| `/help`             | Ask for command help.            | Shows localized usage guidance in a private reply.                  |

The `query` option is required. The slash commands support servers, bot direct messages, and group direct messages.

## Message triggers

- In a server, start a message with Ask's name and include a prompt.
- In a server, tag Ask or reply to one of Ask's messages with a prompt.
- In a direct message, send a prompt. In a group direct message, use a slash command when Discord offers it.
- Send the exact text `!help` to receive localized help in a message.

Ask ignores messages from bots. In a server, Ask ignores other messages unless they tag Ask, start with its name, reply to Ask, or contain the exact text `!help`. Ask removes user, role, and channel references before it sends the prompt. If a message trigger contains no prompt text, Ask uses `Hello!` as the prompt.

When Discord allows channel history access, Ask adds no more than 100 earlier text messages as context. Ask omits the message that started a message-trigger request. If Discord denies history access, Ask answers without that context.

## Responses

Ask can answer questions, summarize text, rewrite text, look up web results, and create images. Ask creates images when the prompt asks for them.

Message-trigger replies use plain text. Ask splits long replies into messages of no more than 2,000 characters. The first message replies to the request. Later messages appear separately. Slash-command replies use blockquote formatting and can span multiple messages.

Ask follows the request locale when Discord provides one. Ask follows the server locale for server messages and uses English (United States) for message triggers without a server locale. Users can request a different language or answer length in the prompt.
