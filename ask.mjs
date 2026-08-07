#!/usr/bin/env node
import 'dotenv/config';
import { closeDb, createDb, verifyConnection } from '@eliware/mysql';
import { createDiscord } from '@eliware/discord';
import { log, fs, path, registerHandlers, registerSignals, safeSerialize } from '@eliware/common';
import { initializeOpenAI } from './src/openaiClient.mjs';

let db;
let client;
let shuttingDown = false;
registerHandlers({ log });
registerSignals({
    log,
    shutdownHook: async () => {
        if (shuttingDown) return;
        shuttingDown = true;
        try {
            if (client?.shutdown) await client.shutdown();
            else client?.destroy();
        } catch (err) {
            log.warn('Discord shutdown failed', { error: err?.message || String(err) });
        }
        if (db) await closeDb(db);
    }
});

const packageJson = JSON.parse(fs.readFileSync(path(import.meta, 'package.json')), 'utf8');
const version = packageJson.version;

const presence = { activities: [{ name: `ask v${version}`, type: 4 }], status: 'online' };

// Initialize OpenAI client and include it in the shared context for handlers
const openai = await initializeOpenAI({ log });

// Initialize database connection pool and include in context
try {
    db = await createDb({ log });
    await verifyConnection(db);
    log.info('Database pool initialized and verified');
} catch (err) {
    log.error('Failed to initialize database pool', { error: safeSerialize(err) });
    throw err;
}

client = await createDiscord({
    log,
    rootDir: path(import.meta),
    context: {
        db,
        presence,
        version,
        openai,
    },
    intents: {
        // Required for slash commands, mentions, replies, and DMs.
        Guilds: true,
        GuildMessages: true,
        MessageContent: true,
        DirectMessages: true,

        // Explicitly disable unused gateway subscriptions.
        GuildMembers: false,
        GuildPresences: false,
        GuildVoiceStates: false,
        GuildScheduledEvents: false,
        GuildModeration: false,
        GuildExpressions: false,
        GuildIntegrations: false,
        GuildWebhooks: false,
        GuildInvites: false,
        GuildMessageReactions: false,
        GuildMessageTyping: false,
        DirectMessageReactions: false,
        DirectMessageTyping: false,
        AutoModerationConfiguration: false,
        AutoModerationExecution: false,
        GuildMessagePolls: false,
        DirectMessagePolls: false,
    }
});
