export async function requestAnswer(openai, input) {
  return openai.responses.create({ model: 'gpt-5.6-luna', input, text: { format: { type: 'text' }, verbosity: 'low' }, reasoning: { effort: 'medium', summary: null }, tools: [{ type: 'web_search', user_location: { type: 'approximate' }, search_context_size: 'medium' }, { type: 'image_generation', model: 'gpt-image-2', size: 'auto', quality: 'auto', output_format: 'png', background: 'auto', moderation: 'low', partial_images: 0 }], store: false, include: ['reasoning.encrypted_content', 'web_search_call.action.sources'] });
}
