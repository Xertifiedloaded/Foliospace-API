import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const generateSitemap = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isVerified: true },
      select: { username: true, updatedAt: true },
    })

    const baseUrl = process.env.FRONTEND_URL || "https://foliospace.com"

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    // Homepage
    sitemap += "  <url>\n"
    sitemap += `    <loc>${baseUrl}</loc>\n`
    sitemap += "    <changefreq>daily</changefreq>\n"
    sitemap += "    <priority>1.0</priority>\n"
    sitemap += "  </url>\n"

    // User profiles
    users.forEach((user) => {
      sitemap += "  <url>\n"
      sitemap += `    <loc>${baseUrl}/${user.username}</loc>\n`
      sitemap += `    <lastmod>${user.updatedAt.toISOString()}</lastmod>\n`
      sitemap += "    <changefreq>weekly</changefreq>\n"
      sitemap += "    <priority>0.8</priority>\n"
      sitemap += "  </url>\n"
    })

    sitemap += "</urlset>"

    res.setHeader("Content-Type", "application/xml")
    return res.status(200).send(sitemap)
  } catch (error) {
    console.error("Generate sitemap error:", error)
    return res.status(500).json({
      message: "Failed to generate sitemap.",
      error: error.message,
    })
  }
}
