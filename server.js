const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "system",
                "content": "I will give you a complex task. Break it down into a bunch of small subtasks, estimate the time required to do it. Just give me and tasks and time estimated and nothing else. Format it like this: \n\nMain Task\nSubtask 1(time estimate)\nSubtask 2(time estimate)"
            },
            {
                "role": "user",
                "content": "book flight to delhi"
            },
            {
                "role": "assistant",
                "content": "Book Flight to Delhi\nCheck availability of flights to Delhi (15 minutes)\nCompare prices of different airlines (30 minutes)\nChoose suitable flight based on time and price (15 minutes)\nCreate account or log in to booking website (10 minutes)\nFill in passenger details (10 minutes)\nPay for flight (10 minutes)\nReview and confirm booking (10 minutes)\nCheck email for confirmation and retrieve booking reference (5 minutes)"
            }
        ],
        "model": "llama3-70b-8192",
        "temperature": 1,
        "max_tokens": 1024,
        "top_p": 1,
        "stream": true,
        "stop": null
    });

    for await (const chunk of chatCompletion) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
}

main();