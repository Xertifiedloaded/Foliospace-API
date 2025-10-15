import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getUserSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: { userId: req.user?.userId },
    })

    return res.status(200).json({ skills })
  } catch (error) {
    console.error("Get user skills error:", error)
    return res.status(500).json({
      message: "Failed to get user skills.",
      error: error.message,
    })
  }
}

export const getTemplate = async (req, res) => {
  try {
    const template = await prisma.template.findUnique({
      where: { userId: req.user.userId },
    })

    return res.status(200).json({ template })
  } catch (error) {
    console.error("Get template error:", error)
    return res.status(500).json({
      message: "Failed to get template.",
      error: error.message,
    })
  }
}

export const updateTemplate = async (req, res) => {
  const { templateId, customization } = req.body

  try {
    const template = await prisma.template.upsert({
      where: { userId: req.user.userId },
      update: { templateId, customization },
      create: {
        templateId,
        customization,
        userId: req.user.userId,
      },
    })

    return res.status(200).json({
      message: "Template updated successfully!",
      template,
    })
  } catch (error) {
    console.error("Update template error:", error)
    return res.status(500).json({
      message: "Failed to update template.",
      error: error.message,
    })
  }
}
