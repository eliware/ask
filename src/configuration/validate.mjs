const requiredVariables = ["DISCORD_CLIENT_ID", "DISCORD_TOKEN", "OPENAI_API_KEY"];

export function validateConfiguration(environment = process.env) {
  const missing = requiredVariables.filter((name) => {
    const value = environment[name];
    return typeof value !== "string" || value.trim().length === 0;
  });
  if (missing.length) {
    throw new Error(`Missing required environment values: ${missing.join(", ")}`);
  }
}
