// events/messageCreate.mjs
export default async function ({ client, log, msg, commandHandlers, ...contextData }, message) {
    log.debug('messageCreate', { id: message.id });
    // ignore messages from other bots to avoid loops
    if (message.author?.bot) return;

    const locale = message.guild?.preferredLocale || 'en-US';

    // Helper to produce localized msg function for handlers
    const localeMsg = (key, defaultMsg) => msg(locale, key, defaultMsg, log);

    // Simple !help fallback
    if (message.content === '!help') {
        const response = localeMsg('help', 'This is the help text.');
        await message.reply(response);
        log.debug('!help Response', { response });
        return;
    }

    // Determine whether to handle this message as an implicit /ask invocation
    const isDirect = !message.guild; // DMs have no guild
    const isMentioned = message.mentions?.has?.(client.user) || false;
    // Also respond if this message is a reply to a message from the bot
    let isReplyToBot = false;
    try {
        if (message.reference && (message.reference.messageId || message.reference.message?.id)) {
            // message.fetchReference() will retrieve the referenced message when available
            const ref = await (message.fetchReference ? message.fetchReference() : (message.channel?.messages?.fetch ? message.channel.messages.fetch(message.reference.messageId || message.reference.message?.id) : null)).catch(() => null);
            if (ref && ref.author && ref.author.id === client.user?.id) isReplyToBot = true;
        }
    } catch (e) {
        log.debug('failed to resolve referenced message', { error: e?.message || e });
    }
    if (!isDirect && !isMentioned && !isReplyToBot) return;

    // Build the text to send to the ask handler: remove the mention if present
    let text = message.content || '';
    if (isMentioned) {
        // strip bot mention tokens like <@id> or <@!id>
        const mentionRegex = new RegExp(`<@!?\\${client.user.id}>`, 'g');
        text = text.replace(mentionRegex, '').trim();
    }

    // If no text remains (e.g., user only mentioned the bot), show a short prompt
    if (!text) text = 'Hello!';

    // Create a lightweight mock interaction that our command handler understands
    const interaction = {
        commandName: 'ask',
        locale,
        client,
        guild: message.guild || undefined,
        guildId: message.guild?.id || null,
        channelId: message.channel?.id || null,
        channel: message.channel,
        user: message.author,
        member: message.member || null,
        data: { options: [{ value: text }] },
        options: { getString: (name) => text },
        deferReply: async () => {
            // indicate thinking in channel (non-blocking)
            try {
                // send an immediate typing indicator if possible
                await message.channel?.sendTyping?.();
            } catch (e) { /* ignore */ }

            // If sendTyping is supported, keep resending it every 8 seconds to keep indicator alive
            try {
                if (message.channel?.sendTyping && !interaction._typingInterval) {
                    // setInterval returns a Timer object; store it so we can clear later
                    interaction._typingInterval = setInterval(() => {
                        try { message.channel.sendTyping?.(); } catch (_) { /* ignore */ }
                    }, 8000);
                }
            } catch (e) { /* ignore */ }
            return;
        },
        reply: async (resp) => {
            try {
                // stop any typing interval when we are about to reply
                try { if (interaction._typingInterval) { clearInterval(interaction._typingInterval); interaction._typingInterval = null; } } catch (_) {}

                const content = resp?.content ?? resp;
                const files = resp?.files ?? null;
                // if ephemeral flag present, DM the author when possible
                const flags = resp?.flags ?? 0;

                // prepare text
                let textOut = typeof content === 'string' ? content : JSON.stringify(content);
                // add per-line blockquote formatting so message-originated replies match /ask behavior
                const addBlockquote = (t) => t.split(/\r?\n/).map(line => (line.trim() === '' ? '> ' : `> ${line}`)).join('\n');
                textOut = addBlockquote(textOut);

                // split into 2000-char chunks (Discord message limit for normal messages)
                const MAX = 2000;
                let splitFn = null;
                try { const mod = await import('@eliware/discord').catch(() => null); if (mod && typeof mod.splitMsg === 'function') splitFn = (t, m) => mod.splitMsg(t, m); } catch (e) {}
                if (!splitFn) splitFn = (t, m) => { const out=[]; for (let i=0;i<t.length;i+=m) out.push(t.slice(i,i+m)); return out; };
                const chunks = splitFn(textOut, MAX);

                if (flags & (1 << 6)) {
                    // ephemeral -> DM the author
                    try {
                        if (files && files.length) {
                            // send first chunk with files, remaining as separate messages
                            await message.author.send({ content: chunks[0], files });
                            for (let i = 1; i < chunks.length; i++) await message.author.send(chunks[i]);
                            return;
                        }
                        for (const c of chunks) await message.author.send(c);
                        return;
                    } catch (_) { /* fallback below */ }
                }

                // Not ephemeral: reply in-channel. Attach files only to first chunk if present.
                if (files && files.length) {
                    await message.reply({ content: chunks[0], files });
                } else {
                    await message.reply(chunks[0]);
                }
                for (let i = 1; i < chunks.length; i++) await message.reply(chunks[i]);
                return;
            } catch (e) {
                log.error('mock interaction.reply failed', { error: e?.message || e });
            }
        },
        editReply: async (resp) => {
            try {
                // stop any typing interval when editing/replying
                try { if (interaction._typingInterval) { clearInterval(interaction._typingInterval); interaction._typingInterval = null; } } catch (_) {}

                let content = resp?.content ?? resp;
                const files = resp?.files ?? null;
                // editReply not available on Message; send a follow-up instead
                if (files && files.length) return await message.reply({ content: typeof content === 'string' ? content : JSON.stringify(content), files });
                if (typeof content !== 'string') content = JSON.stringify(content, null, 2);

                // add per-line blockquote formatting
                const addBlockquote = (t) => t.split(/\r?\n/).map(line => (line.trim() === '' ? '> ' : `> ${line}`)).join('\n');
                content = addBlockquote(content);

                const MAX = 2000;
                let splitMsgFn = null;
                try { splitMsgFn = (await import('@eliware/discord')).splitMsg; } catch (err) { /* fallback below */ }
                if (typeof splitMsgFn !== 'function') {
                    // fallback simple chunking
                    const chunks = [];
                    for (let i = 0; i < content.length; i += MAX) chunks.push(content.slice(i, i + MAX));
                    for (const c of chunks) await message.reply(c);
                    return;
                }
                const chunks = splitMsgFn(content, MAX);
                for (const c of chunks) await message.reply(c);
                return;
            } catch (e) {
                log.error('mock interaction.editReply failed', { error: e?.message || e });
            }
        },
    };
    // mark that this mock interaction originates from a message event so the handler
    // can avoid double-quoting when replying in-channel
    interaction._omitBlockquote = true;

    // Call the ask command handler if available. If the framework didn't provide commandHandlers
    // (some event contexts may not include them), dynamically import the command module as a fallback.
    try {
        let handler = commandHandlers?.ask;
        if (!handler) {
            try {
                // dynamic import relative to events directory
                const mod = await import('../commands/ask.mjs');
                handler = mod?.default || null;
            } catch (err) {
                log.debug('failed to dynamically import ask command', { error: err?.message || err });
            }
        }

        if (handler) {
            try {
                await handler({ client, log, msg: localeMsg, ...contextData }, interaction);
            } finally {
                // ensure we clear any typing interval left behind if the handler didn't already clear it
                try { if (interaction._typingInterval) { clearInterval(interaction._typingInterval); interaction._typingInterval = null; } } catch (_) {}
            }
        } else {
            // fallback: reply with short help (ephemeral)
            // clear any typing interval before sending fallback
            try { if (interaction._typingInterval) { clearInterval(interaction._typingInterval); interaction._typingInterval = null; } } catch (_) {}
            await interaction.reply({ content: localeMsg('help', 'Try /ask <anything>.'), flags: 1 << 6 });
        }
    } catch (e) {
        log.error('messageCreate handler invocation failed', { error: e?.message || e, stack: e?.stack });
        // make sure typing is cleared on error
        try { if (interaction._typingInterval) { clearInterval(interaction._typingInterval); interaction._typingInterval = null; } } catch (_) {}
    }
}
