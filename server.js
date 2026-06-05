import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-ui", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(`
You are an autonomous UI generator.

Create a responsive HTML component using Tailwind CSS.

User Request:
${prompt}

Rules:
1. Return ONLY HTML.
2. No markdown.
3. No code fences.
4. Use Tailwind classes.
`);

    const html = result.response.text();

    res.json({
      success: true,
      html
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});