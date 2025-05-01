require('dotenv').config();
const fs = require('fs');
const path = require('path');
console.log('Env file found:', fs.existsSync(path.join(__dirname, '.env')));
console.log('Loaded OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static assets from project root
app.use(express.static(path.join(__dirname)));

// API endpoint for generating questions
app.post('/generate', async (req, res) => {
  const { topic, count } = req.body;
  const numQuestions = parseInt(count, 10) || 5;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured in environment variable OPENAI_API_KEY' });
  }
  if (!topic) {
    return res.status(400).json({ error: 'Missing "topic" in request body' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates CompTIA practice multiple-choice questions. Always include a detailed "explanation" field in each question object that provides rationale for the correct answer.' },
          { role: 'user', content: `Generate ${numQuestions} CompTIA practice multiple-choice questions on the topic "${topic}". Return only a JSON object with a "questions" array. Each question object must include:
- "question": the question text
- "options": an array of answer choices
- "answer": the correct choice
- "explanation": a detailed rationale for why the answer is correct

Do not include any additional formatting, commentary, or code fences.` }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log('Full OpenAI response JSON:', JSON.stringify(data, null, 2));
    console.log('Raw OpenAI response content:', data.choices[0]?.message?.content);
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    let result;
    try {
      result = JSON.parse(data.choices[0]?.message?.content);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to parse JSON from OpenAI response', details: err.message });
    }

    // Slice to requested count
    if (result.questions && Array.isArray(result.questions)) {
      result.questions = result.questions.slice(0, numQuestions);
    }

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Error communicating with OpenAI API', details: err.message });
  }
});

// Fallback route to serve index.html for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});