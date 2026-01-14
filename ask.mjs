#!/usr/bin/env node
import 'dotenv/config';
import { createDb } from '@eliware/mysql';
import { createDiscord } from '@eliware/discord';
import { log, fs, path, registerHandlers, registerSignals } from '@eliware/common';
import { createOpenAI } from '@eliware/openai';

registerHandlers({ log });
registerSignals({ log });

const packageJson = JSON.parse(fs.readFileSync(path(import.meta, 'package.json')), 'utf8');
const version = packageJson.version;

const presence = { activities: [{ name: `ask v${version}`, type: 4 }], status: 'online' };

// Initialize OpenAI client and include it in the shared context for handlers
let openai;
try {
    openai = await createOpenAI();
    log.info('OpenAI client initialized');
} catch (err) {
    log.error('Failed to initialize OpenAI client', { error: err?.message || err });
    throw err;
}

// Initialize database connection pool and include in context
let db;
try {
    db = await createDb({ log });
    log.info('Database pool initialized');
} catch (err) {
    log.error('Failed to initialize database pool', { error: err?.message || err });
    throw err;
}
registerSignals({ shutdownHook: () => db.end() });

const client = await createDiscord({
    log,
    rootDir: path(import.meta),
    context: {
        db,
        presence,
        version,
        openai,
    },
    intents: {
        Guilds: true,
        GuildMessages: true,
        MessageContent: true,
        DirectMessages: true,
        GuildMembers: false,
        GuildPresences: false,
        GuildVoiceStates: false,
    }
});
registerSignals({ shutdownHook: () => client.destroy() });
