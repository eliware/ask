import { safeSerialize } from '@eliware/common';
import { createOpenAI } from '@eliware/openai';

export async function initializeOpenAI({ log, factory = createOpenAI } = {}) {
  try {
    const openai = await factory();
    log?.info('OpenAI client initialized');
    return openai;
  } catch (error) {
    log?.error('Failed to initialize OpenAI client', { error: safeSerialize(error) });
    throw error;
  }
}
