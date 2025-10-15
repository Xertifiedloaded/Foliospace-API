export const getReferences = async (req, res) => {
  try {
    const references = [
      { id: 1, name: "John Doe", title: "Senior Developer", company: "Tech Corp" },
      { id: 2, name: "Jane Smith", title: "Product Manager", company: "Startup Inc" },
    ]

    return res.status(200).json({ references })
  } catch (error) {
    console.error("Get references error:", error)
    return res.status(500).json({
      message: "Failed to get references.",
      error: error.message,
    })
  }
}
