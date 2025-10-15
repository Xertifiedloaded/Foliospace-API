import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getBlogPost = async (req, res) => {
  const { slug } = req.params

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    if (!post) {
      return res.status(404).json({ message: "Blog post not found." })
    }

    return res.status(200).json({ post })
  } catch (error) {
    console.error("Get blog post error:", error)
    return res.status(500).json({
      message: "Failed to get blog post.",
      error: error.message,
    })
  }
}
