const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate a job title and description using AI, based on image filename
exports.getSuggestionFromAI = async (filename = '') => {
  const prompt = `
You are a client using a handyman app. Based on a photo with the filename "${filename}", describe briefly what problem you have and what you want fixed. Respond in the format:
Title: ...
Description: ...
Keep it short and easy to understand.
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150, 
    temperature: 0.7, 
  });

  const reply = res.choices?.[0]?.message?.content || '';
 // Extract title and description from AI reply
  const titleMatch = reply.match(/Title:\s*(.+)/i);
  const descMatch = reply.match(/Description:\s*(.+)/i);

  return {
    title: titleMatch?.[1] || 'Service Request',
    description: descMatch?.[1] || reply,
  };
};
