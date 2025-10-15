import { PrismaClient } from "@prisma/client"
import formidable from "formidable"
import fs from "fs"

import mammoth from "mammoth"
const pdfParse = (await import("pdf-parse")).default;
const prisma = new PrismaClient()

export const uploadCV = async (req, res) => {
  const form = formidable({ multiples: false })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Failed to parse form data.", error: err.message })
    }

    try {
      const file = files.cv
      if (!file) {
        return res.status(400).json({ message: "No file uploaded." })
      }

      const filePath = file.filepath
      let extractedText = ""

      if (file.mimetype === "application/pdf") {
        const dataBuffer = fs.readFileSync(filePath)
        const data = await pdfParse(dataBuffer)
        extractedText = data.text
      } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const result = await mammoth.extractRawText({ path: filePath })
        extractedText = result.value
      } else {
        return res.status(400).json({ message: "Unsupported file type." })
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath)

      return res.status(200).json({
        message: "CV uploaded and processed successfully!",
        extractedText,
      })
    } catch (error) {
      console.error("Upload CV error:", error)
      return res.status(500).json({
        message: "Failed to process CV.",
        error: error.message,
      })
    }
  })
}
