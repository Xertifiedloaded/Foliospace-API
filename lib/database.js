import { PrismaClient } from "@prisma/client"

const globalForPrisma = global

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default async function databaseConnection() {
  try {
    await prisma.$connect()
    console.log("[v0] Database connected successfully")
    return true
  } catch (error) {
    console.error("[v0] Database connection error:", error)
    return false
  }
}
