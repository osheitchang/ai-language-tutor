const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const authMiddleware = require('../middleware/authmiddleware');

// Initialize OpenAI (move API key to .env file!)
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
});

// Practice route
router.post('/', authMiddleware, async (req, res) => {
    const { sentence } = req.body;

    try {
        const response = await openai.completions.create({
            model: 'text-davinci-003',
            prompt: `Correct the following sentence: ${sentence}`,
            max_tokens: 100,
            temperature: 0.7
        });

        const feedback = response.choices[0].text.trim();
        res.json({ feedback });
    } catch (err) {
        console.error('AI feedback error:', err);
        res.status(500).json({ message: 'Error getting AI feedback' });
    }
});

module.exports = router; 