import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { generateOTP } from "../utils/generateOtp.js"
import { generateEmailContent } from "../utils/emailContent.js"
import { transporter } from "../config/nodemailer.js"
import { sanitizeUsername } from "../utils/helpers.js"

const prisma = new PrismaClient()

export const register = async (req, res) => {
  const { username, name, email, password, confirmPassword } = req.body

  if (!username || !name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." })
  }

  try {
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2934}-\u{2935}\u{3030}\u{2B06}\u{2194}\u{25AA}\u{25AB}\u{2B1B}\u{2B1C}\u{25FE}\u{25FB}\u{2B50}\u{1F004}-\u{1F0CF}\u{1F201}-\u{1F251}\u{1F004}-\u{1F0CF}\u{1F0D0}-\u{1F0FF}\u{23F0}]/u

    if (emojiRegex.test(username)) {
      return res.status(400).json({ message: "Username cannot contain emoji characters." })
    }

    const cleanUsername = sanitizeUsername(username)

    const existingUsername = await prisma.user.findUnique({
      where: { username: cleanUsername },
    })

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" })
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = generateOTP(4)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
    const OTPverificationToken = jwt.sign({ otp }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    })

    const user = await prisma.user.create({
      data: {
        username: cleanUsername,
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
      },
    })

    const verificationLink = `${process.env.FRONTEND_URL}/auth/verification/${OTPverificationToken}`
    const emailContent = generateEmailContent(otp, verificationLink)

    await transporter.sendMail({
      to: email,
      subject: "Verify Your Account - foliospace",
      html: emailContent,
    })

    return res.status(201).json({
      message:
        "Account created successfully! A verification email has been sent—be sure to check your spam folder if you don't see it in your inbox.",
      data: {
        user: { ...user, password: undefined },
        verificationLink,
        isVerified: false,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return res.status(500).json({
      message: "Registration failed.",
      error: error.message,
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." })
    }

    const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    return res.status(200).json({
      user: { ...user, password: undefined },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({
      message: "Login failed.",
      error: error.message,
    })
  }
}

export const mobileLogin = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." })
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    )

    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })

    return res.status(200).json({
      user: { ...user, password: undefined },
      accessToken,
      refreshToken,
      expiresIn: 604800,
    })
  } catch (error) {
    console.error("Mobile login error:", error)
    return res.status(500).json({
      message: "Login failed.",
      error: error.message,
    })
  }
}

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." })
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired." })
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
    })

    return res.status(200).json({ message: "Account verified successfully!" })
  } catch (error) {
    console.error("OTP verification error:", error)
    return res.status(500).json({
      message: "Verification failed.",
      error: error.message,
    })
  }
}

export const resendOtp = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: "Email is required." })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified." })
    }

    const otp = generateOTP(4)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiry },
    })

    const OTPverificationToken = jwt.sign({ otp }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    })

    const verificationLink = `${process.env.FRONTEND_URL}/auth/verification/${OTPverificationToken}`
    const emailContent = generateEmailContent(otp, verificationLink)

    await transporter.sendMail({
      to: email,
      subject: "Verify Your Account - foliospace",
      html: emailContent,
    })

    return res.status(200).json({
      message: "OTP resent successfully!",
      verificationLink,
    })
  } catch (error) {
    console.error("Resend OTP error:", error)
    return res.status(500).json({
      message: "Failed to resend OTP.",
      error: error.message,
    })
  }
}

export const forgetPassword = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: "Email is required." })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    const resetToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`

    await transporter.sendMail({
      to: email,
      subject: "Password Reset - foliospace",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    })

    return res.status(200).json({
      message: "Password reset link sent to your email.",
      resetLink,
    })
  } catch (error) {
    console.error("Forget password error:", error)
    return res.status(500).json({
      message: "Failed to send reset link.",
      error: error.message,
    })
  }
}

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required." })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    })

    return res.status(200).json({ message: "Password reset successfully!" })
  } catch (error) {
    console.error("Reset password error:", error)
    return res.status(500).json({
      message: "Failed to reset password.",
      error: error.message,
    })
  }
}

export const contact = async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." })
  }

  try {
    await transporter.sendMail({
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_FROM,
      subject: `Contact Form: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      replyTo: email,
    })

    return res.status(200).json({ message: "Message sent successfully!" })
  } catch (error) {
    console.error("Contact form error:", error)
    return res.status(500).json({
      message: "Failed to send message.",
      error: error.message,
    })
  }
}

export const getUserSession = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        isVerified: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.error("Get user session error:", error)
    return res.status(500).json({
      message: "Failed to get user session.",
      error: error.message,
    })
  }
}
