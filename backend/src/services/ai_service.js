const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getSuggestionFromAI = async (filename = "") => {
  try {
    const imagePath = path.join(process.cwd(), "uploads", "jobs", filename);

    console.log("📸 Checking image path:", imagePath);

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    // Convert to JPEG to guarantee compatibility
    const imageBuffer = await sharp(imagePath)
      .resize(800) // optional resize
      .jpeg({ quality: 70 }) // convert to jpeg
      .toBuffer();

    const base64Image = imageBuffer.toString("base64");
    console.log(" base64 size:", base64Image.length);

    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that helps users create handyman job descriptions based on uploaded photos.",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`, //FORMAT
              },
            },
            {
              type: "text",
              text: `
Analyze the image and provide a job request for a handyman.
Respond in the format:
Title: <short title>
Description: <brief but clear description of what needs to be fixed>
Only describe visible issues, do not guess.
`,
            },
          ],
        },
      ],
      max_tokens: 200,
      temperature: 0.5,
    });

    const reply = res.choices?.[0]?.message?.content || "";
    console.log("AI reply:\n", reply);

    const titleMatch = reply.match(/Title:\s*(.+)/i);
    const descMatch = reply.match(/Description:\s*(.+)/i);

    return {
      title: titleMatch?.[1]?.trim() || "Service Request",
      description: descMatch?.[1]?.trim() || reply.trim(),
    };
  } catch (error) {
    console.error("Error generating suggestion from AI:", message.error);
    if (error.response) {
      console.error(" OpenAI Error Response:", error.response.status, error.response.data);
    }

    return {
      title: "Error",
      description: "Could not generate a description from image.",
    };
  }
};
