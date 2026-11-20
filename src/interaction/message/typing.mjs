import createTypingManager from "../typing.mjs";

export default function setupMessageTyping(interaction, channel) {
  const typing = createTypingManager(channel);
  interaction.deferReply = typing.start;
  interaction.stopTyping = typing.stop;
  return typing.stop;
}
