import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const trackVisit = async (req, res) => {
  const { username, page, referrer, userAgent } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { username } })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    await prisma.analytics.create({
      data: {
        userId: user.id,
        page,
        referrer,
        userAgent,
      },
    })

    return res.status(201).json({ message: "Visit tracked successfully!" })
  } catch (error) {
    console.error("Track visit error:", error)
    return res.status(500).json({
      message: "Failed to track visit.",
      error: error.message,
    })
  }
}

export const getStats = async (req, res) => {
  try {
    const analytics = await prisma.analytics.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    const totalVisits = analytics.length
    const uniqueVisitors = new Set(analytics.map((a) => a.userAgent)).size
    const pageViews = analytics.reduce((acc, curr) => {
      acc[curr.page] = (acc[curr.page] || 0) + 1
      return acc
    }, {})

    return res.status(200).json({
      totalVisits,
      uniqueVisitors,
      pageViews,
      recentVisits: analytics.slice(0, 10),
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return res.status(500).json({
      message: "Failed to get stats.",
      error: error.message,
    })
  }
}
