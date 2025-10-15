import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getDashboard = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        links: true,
        education: true,
        experience: true,
        projects: true,
        skills: true,
        certificates: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    return res.status(200).json({ user: { ...user, password: undefined } })
  } catch (error) {
    console.error("Get dashboard error:", error)
    return res.status(500).json({
      message: "Failed to get dashboard.",
      error: error.message,
    })
  }
}

export const getProfile = async (req, res) => {
  const { username } = req.params

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        links: true,
        education: true,
        experience: true,
        projects: true,
        skills: true,
        certificates: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    return res.status(200).json({ user: { ...user, password: undefined } })
  } catch (error) {
    console.error("Get profile error:", error)
    return res.status(500).json({
      message: "Failed to get profile.",
      error: error.message,
    })
  }
}

export const updateProfile = async (req, res) => {
  const { name, bio, avatar, location, website } = req.body

  try {
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, bio, avatar, location, website },
    })

    return res.status(200).json({
      message: "Profile updated successfully!",
      user: { ...user, password: undefined },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return res.status(500).json({
      message: "Failed to update profile.",
      error: error.message,
    })
  }
}

export const addLink = async (req, res) => {
  const { title, url, icon } = req.body

  try {
    const link = await prisma.link.create({
      data: {
        title,
        url,
        icon,
        userId: req.user.userId,
      },
    })

    return res.status(201).json({ message: "Link added successfully!", link })
  } catch (error) {
    console.error("Add link error:", error)
    return res.status(500).json({
      message: "Failed to add link.",
      error: error.message,
    })
  }
}

export const updateLink = async (req, res) => {
  const { id } = req.params
  const { title, url, icon } = req.body

  try {
    const link = await prisma.link.update({
      where: { id, userId: req.user.userId },
      data: { title, url, icon },
    })

    return res.status(200).json({ message: "Link updated successfully!", link })
  } catch (error) {
    console.error("Update link error:", error)
    return res.status(500).json({
      message: "Failed to update link.",
      error: error.message,
    })
  }
}

export const deleteLink = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.link.delete({
      where: { id, userId: req.user.userId },
    })

    return res.status(200).json({ message: "Link deleted successfully!" })
  } catch (error) {
    console.error("Delete link error:", error)
    return res.status(500).json({
      message: "Failed to delete link.",
      error: error.message,
    })
  }
}

export const addEducation = async (req, res) => {
  const { school, degree, field, startDate, endDate, description } = req.body

  try {
    const education = await prisma.education.create({
      data: {
        school,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        userId: req.user.userId,
      },
    })

    return res.status(201).json({ message: "Education added successfully!", education })
  } catch (error) {
    console.error("Add education error:", error)
    return res.status(500).json({
      message: "Failed to add education.",
      error: error.message,
    })
  }
}

export const updateEducation = async (req, res) => {
  const { id } = req.params
  const { school, degree, field, startDate, endDate, description } = req.body

  try {
    const education = await prisma.education.update({
      where: { id, userId: req.user.userId },
      data: {
        school,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
      },
    })

    return res.status(200).json({ message: "Education updated successfully!", education })
  } catch (error) {
    console.error("Update education error:", error)
    return res.status(500).json({
      message: "Failed to update education.",
      error: error.message,
    })
  }
}

export const deleteEducation = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.education.delete({
      where: { id, userId: req.user.userId },
    })

    return res.status(200).json({ message: "Education deleted successfully!" })
  } catch (error) {
    console.error("Delete education error:", error)
    return res.status(500).json({
      message: "Failed to delete education.",
      error: error.message,
    })
  }
}

export const addExperience = async (req, res) => {
  const { company, position, startDate, endDate, description, location } = req.body

  try {
    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        location,
        userId: req.user.userId,
      },
    })

    return res.status(201).json({ message: "Experience added successfully!", experience })
  } catch (error) {
    console.error("Add experience error:", error)
    return res.status(500).json({
      message: "Failed to add experience.",
      error: error.message,
    })
  }
}

export const updateExperience = async (req, res) => {
  const { id } = req.params
  const { company, position, startDate, endDate, description, location } = req.body

  try {
    const experience = await prisma.experience.update({
      where: { id, userId: req.user.userId },
      data: {
        company,
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        location,
      },
    })

    return res.status(200).json({ message: "Experience updated successfully!", experience })
  } catch (error) {
    console.error("Update experience error:", error)
    return res.status(500).json({
      message: "Failed to update experience.",
      error: error.message,
    })
  }
}

export const deleteExperience = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.experience.delete({
      where: { id, userId: req.user.userId },
    })

    return res.status(200).json({ message: "Experience deleted successfully!" })
  } catch (error) {
    console.error("Delete experience error:", error)
    return res.status(500).json({
      message: "Failed to delete experience.",
      error: error.message,
    })
  }
}

export const addProject = async (req, res) => {
  const { title, description, image, url, technologies, startDate, endDate } = req.body

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        image,
        url,
        technologies,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        userId: req.user.userId,
      },
    })

    return res.status(201).json({ message: "Project added successfully!", project })
  } catch (error) {
    console.error("Add project error:", error)
    return res.status(500).json({
      message: "Failed to add project.",
      error: error.message,
    })
  }
}

export const updateProject = async (req, res) => {
  const { id } = req.params
  const { title, description, image, url, technologies, startDate, endDate } = req.body

  try {
    const project = await prisma.project.update({
      where: { id, userId: req.user.userId },
      data: {
        title,
        description,
        image,
        url,
        technologies,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    })

    return res.status(200).json({ message: "Project updated successfully!", project })
  } catch (error) {
    console.error("Update project error:", error)
    return res.status(500).json({
      message: "Failed to update project.",
      error: error.message,
    })
  }
}

export const deleteProject = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.project.delete({
      where: { id, userId: req.user.userId },
    })

    return res.status(200).json({ message: "Project deleted successfully!" })
  } catch (error) {
    console.error("Delete project error:", error)
    return res.status(500).json({
      message: "Failed to delete project.",
      error: error.message,
    })
  }
}

export const addSkill = async (req, res) => {
  const { name, level, category } = req.body

  try {
    const skill = await prisma.skill.create({
      data: {
        name,
        level,
        category,
        userId: req.user.userId,
      },
    })

    return res.status(201).json({ message: "Skill added successfully!", skill })
  } catch (error) {
    console.error("Add skill error:", error)
    return res.status(500).json({
      message: "Failed to add skill.",
      error: error.message,
    })
  }
}

export const deleteSkill = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.skill.delete({
      where: { id, userId: req.user.userId },
    })

    return res.status(200).json({ message: "Skill deleted successfully!" })
  } catch (error) {
    console.error("Delete skill error:", error)
    return res.status(500).json({
      message: "Failed to delete skill.",
      error: error.message,
    })
  }
}

export const addCertificate = async (req, res) => {
  const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl } = req.body

  try {
    const certificate = await prisma.certificate.create({
      data: {
        title,
        issuer,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialId,
        credentialUrl,
        userId: req.user.userId,
      },
    })

    return res.status(201).json({ message: "Certificate added successfully!", certificate })
  } catch (error) {
    console.error("Add certificate error:", error)
    return res.status(500).json({
      message: "Failed to add certificate.",
      error: error.message,
    })
  }
}

export const updateCertificate = async (req, res) => {
  const { id } = req.params
  const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl } = req.body

  try {
    const certificate = await prisma.certificate.update({
      where: { id, userId: req.user.userId },
      data: {
        title,
        issuer,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialId,
        credentialUrl,
      },
    })

    return res.status(200).json({ message: "Certificate updated successfully!", certificate })
  } catch (error) {
    console.error("Update certificate error:", error)
    return res.status(500).json({
      message: "Failed to update certificate.",
      error: error.message,
    })
  }
}

export const deleteCertificate = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.certificate.delete({
      where: { id, userId: req.user.userId },
    })

    return res.status(200).json({ message: "Certificate deleted successfully!" })
  } catch (error) {
    console.error("Delete certificate error:", error)
    return res.status(500).json({
      message: "Failed to delete certificate.",
      error: error.message,
    })
  }
}
