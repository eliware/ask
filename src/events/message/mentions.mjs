const mentionPattern = /<@!?[\w-]+>|<@&[\w-]+>|<#[\w-]+>/g;

export default function removeMessageMentions(content) {
  return content.replace(mentionPattern, "");
}
