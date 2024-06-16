require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Groq = require('groq-sdk');

const app = express();
const port = process.env.PORT || 3000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/breakdown', async (req, res) => {
    const { task } = req.body;
    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "system",
                    "content": "I will give you a complex task. Break it down into a bunch of small subtasks, estimate the time required to do it. Just give me and tasks and time estimated and nothing else. Format it like this: \n\nMain Task\nSubtask 1(time estimate)\nSubtask 2(time estimate)"
                },
                {
                    "role": "user",
                    "content": task
                }
            ],
            "model": "llama3-70b-8192",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": true,
            "stop": null
        });

        let fullResponse = '';
        for await (const chunk of chatCompletion) {
            fullResponse += chunk.choices[0]?.delta?.content || '';
        }

        res.json({ tasks: fullResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});