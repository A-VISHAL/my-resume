const { OpenAI } = require('openai');
const pdf = require('pdf-parse');
const fs = require('fs');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const parseResumeText = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const text = data.text;

    const prompt = `
    Extract the following information from the resume text in JSON format:
    - name
    - email
    - cgpa (as a number out of 10 or 4, normalize to 10 if possible)
    - skills (list of strings)
    - domain (e.g., Web Development, Data Science, etc.)
    - experience (number of years, internships count as 0.5 each)
    - education (highest degree)

    Ensure the output is valid JSON and only the JSON.
    Text: ${text}
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
};

module.exports = { parseResumeText };
