import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const processAIRequest = async (req, res) => {
  const { prompt, context } = req.body

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required." })
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const fullPrompt = context ? `Context: ${context}\n\nPrompt: ${prompt}` : prompt

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    return res.status(200).json({
      message: "AI response generated successfully!",
      response: text,
    })
  } catch (error) {
    console.error("AI request error:", error)
    return res.status(500).json({
      message: "Failed to process AI request.",
      error: error.message,
    })
  }
}
