import fs from 'fs';
import path from 'path';

describe('All event handler files export a default function and match Discord Gateway event names', () => {
  const eventsDir = path.join(process.cwd(), 'events');
  const files = fs.readdirSync(eventsDir).filter(f => f.endsWith('.mjs'));
  // Event handlers intentionally registered by this service.
  const validEvents = [
    'clientReady', 'debug', 'error', 'interactionCreate',
    'invalidated', 'messageCreate', 'warn',
  ];
  const foundEvents = files.map(f => f.replace(/\.mjs$/, ''));

  for (const file of files) {
    const eventName = file.replace(/\.mjs$/, '');
    const filePath = path.join(eventsDir, file);
    test(`${file} exports a default function and is a valid Discord event`, async () => {
      expect(validEvents.includes(eventName)).toBe(true);
      const mod = await import(filePath);
      expect(typeof mod.default).toBe('function');
    });
  }

  test('all configured event handlers have a handler file', () => {
    for (const event of validEvents) {
      expect(foundEvents).toContain(event);
    }
  });
});
