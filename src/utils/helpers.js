export const sanitizeUsername = (username) => {
  return username
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "")
    .replace(/_{2,}/g, "_")
    .replace(/\.{2,}/g, ".")
    .replace(/^[._-]|[._-]$/g, "")
    .substring(0, 50)
}
