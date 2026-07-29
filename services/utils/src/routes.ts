import express from "express";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Career route working" });
});
/* ==========================
   CLOUDINARY CONFIG
========================== */

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


/* ==========================
   GEMINI CONFIG
========================== */

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY_GEMINI,
});
  console.log( process.env.API_KEY_GEMINI)


/* ==========================================================
   IMAGE UPLOAD
========================================================== */

router.post("/upload", async (req, res) => {
  try {
    const { buffer, public_id } = req.body;

    if (!buffer) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id);
    }

    const cloud = await cloudinary.v2.uploader.upload(buffer);

    return res.json({
      url: cloud.secure_url,
      public_id: cloud.public_id,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

/* ==========================================================
   CAREER ROADMAP
========================================================== */

router.post("/career", async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills) {
      return res.status(400).json({
        message: "Skills required",
      });
    }

    const prompt = `
Based on the following skills: ${skills}

Act as an expert career advisor.

Return ONLY valid JSON.

{
  "summary":"...",
  "jobOptions":[
    {
      "title":"...",
      "responsibilities":"...",
      "why":"..."
    }
  ],
  "skillsToLearn":[
    {
      "category":"...",
      "skills":[
        {
          "title":"...",
          "why":"...",
          "how":"..."
        }
      ]
    }
  ],
  "learningApproach":{
    "title":"How to Learn",
    "points":[
      "...",
      "...",
      "..."
    ]
  }
}
`;



    const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: prompt,
});
    const raw = response.text
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!raw) {
      return res.status(500).json({
        message: "Empty AI response",
      });
    }

    const data = JSON.parse(raw);

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

/* ==========================================================
   RESUME ATS ANALYSER
========================================================== */

router.post("/resume-analyser", async (req, res) => {
  try {
    const { pdfBase64 } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({
        message: "PDF is required",
      });
    }

    const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the uploaded resume.

Return ONLY valid JSON.

{
  "atsScore":85,
  "scoreBreakdown":{
    "formatting":{
      "score":90,
      "feedback":"..."
    },
    "keywords":{
      "score":82,
      "feedback":"..."
    },
    "structure":{
      "score":84,
      "feedback":"..."
    },
    "readability":{
      "score":87,
      "feedback":"..."
    }
  },
  "suggestions":[
    {
      "category":"Formatting",
      "issue":"...",
      "recommendation":"...",
      "priority":"high"
    }
  ],
  "strengths":[
    "...",
    "..."
  ],
  "summary":"..."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64.replace(
                  /^data:application\/pdf;base64,/,
                  ""
                ),
              },
            },
          ],
        },
      ],
    });

    const raw = response.text
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!raw) {
      return res.status(500).json({
        message: "Empty AI response",
      });
    }

    const data = JSON.parse(raw);

    return res.json(data);
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

export default router; 