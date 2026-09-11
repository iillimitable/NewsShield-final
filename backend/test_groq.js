const axios = require('axios');

require('dotenv').config();

async function test() {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'qwen/qwen3.8-27b',
        messages: [
          {
            role: 'user',
            content: 'Reply with only this JSON, no extra text: {"verdict":"Real","reason":"test","confidence":80,"supporting":70,"contradicting":30}'
          }
        ],
        temperature: 0.1,
        max_tokens: 100
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        timeout: 30000
      }
    );
    console.log('SUCCESS!');
    console.log('Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('FAILED!');
    console.error('Status:', error.response?.status);
    console.error('Error data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Message:', error.message);
  }
}

test();
