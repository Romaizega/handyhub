const path = require('path')
const { getSuggestionFromAI } = require('../services/ai_service')

// Controller to generate a job description based on an uploaded file
exports.generateJobDescription = async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: 'No image uploaded' })
    }

    const ai = await getSuggestionFromAI(file.filename)

    return res.json({
      suggestion: `AI suggests: "${ai.title}"`,
      title: ai.title,
      description: ai.description,
      filename: file.filename,
      path: `/uploads/jobs/${file.filename}`,
    })
  } catch (err) {
    console.error('AI error:', err)
    res.status(500).json({ error: 'AI generation failed' })
  }
}
