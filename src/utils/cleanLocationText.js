export const cleanLocationText = (raw) => {
  if (!raw || typeof raw !== "string") return "";

  // Remove Plus Codes like "27J5+CJ9"
  raw = raw.replace(/^[A-Z0-9]{4,}\+[A-Z0-9]{2,},?\s*/i, "");

  // Remove any standalone Plus Codes in the middle
  raw = raw.replace(/[A-Z0-9]{4,}\+[A-Z0-9]{2,}/gi, "");

  // Remove latitude/longitude patterns
  raw = raw.replace(/[-+]?\d{1,3}\.\d+[, ]*/g, "");

  // Remove extra commas
  raw = raw.replace(/,+/g, ", ");

  // Remove double spaces
  raw = raw.replace(/\s\s+/g, " ");

  // Trim commas or spaces
  raw = raw.replace(/^[,\s]+|[,\s]+$/g, "");

  return raw.trim();
};
