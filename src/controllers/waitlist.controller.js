import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const addToWaitlist = async (req, res) => {
  const { email, name } = req.body

  if (!email) {
    return res.status(400).json({ message: "Email is required." })
  }

  try {
    const existing = await prisma.waitlist.findUnique({ where: { email } })

    if (existing) {
      return res.status(400).json({ message: "Email already on waitlist." })
    }

    const waitlistEntry = await prisma.waitlist.create({
      data: { email, name },
    })

    return res.status(201).json({
      message: "Successfully added to waitlist!",
      data: waitlistEntry,
    })
  } catch (error) {
    console.error("Add to waitlist error:", error)
    return res.status(500).json({
      message: "Failed to add to waitlist.",
      error: error.message,
    })
  }
}

export const getWaitlist = async (req, res) => {
  try {
    const waitlist = await prisma.waitlist.findMany({
      orderBy: { createdAt: "desc" },
    })

    return res.status(200).json({ waitlist })
  } catch (error) {
    console.error("Get waitlist error:", error)
    return res.status(500).json({
      message: "Failed to get waitlist.",
      error: error.message,
    })
  }
}
