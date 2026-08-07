export async function checkRateLimit(db, { userId, channelId, guildId }, limits = { hourly: 50, daily: 100 }) {
  if (!db) return [];
  const countSince = async (field, value, interval) => {
    if (!value) return 0;
    const [rows] = await db.execute(`SELECT COUNT(*) AS cnt FROM \`usage\` WHERE ${field} = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})`, [value]);
    return Number(rows?.[0]?.cnt || 0);
  };
  const violations = [];
  for (const [field, value, label] of [['user_id', userId, 'user'], ['channel_id', channelId, 'channel'], ['guild_id', guildId, 'server']]) {
    const hour = await countSince(field, value, '1 HOUR'); const day = await countSince(field, value, '24 HOUR');
    if (hour >= limits.hourly) violations.push(`Per-${label} hourly limit (${limits.hourly}/hour) reached (${hour} in the last hour)`);
    if (day >= limits.daily) violations.push(`Per-${label} daily limit (${limits.daily}/day) reached (${day} in the last 24 hours)`);
  }
  return violations;
}
