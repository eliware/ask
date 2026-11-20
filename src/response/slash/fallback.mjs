export default function createSlashFallback(files) {
  const message = {};
  if (files.length) message.files = files;
  if (!message.files) message.content = "Sorry, I could not create a reply.";
  return message;
}
