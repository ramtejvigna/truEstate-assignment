/**
 * Utility function to validate date format
 */
export function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Utility function to parse age range
 */
export function parseAgeRange(rangeString) {
  const ranges = {
    "18-25": { min: 18, max: 25 },
    "26-35": { min: 26, max: 35 },
    "36-45": { min: 36, max: 45 },
    "46-55": { min: 46, max: 55 },
    "55+": { min: 55, max: 999 },
  };
  return ranges[rangeString] || null;
}

/**
 * Format date for API response
 */
export function formatDate(date) {
  return date.toISOString().split("T")[0];
}

/**
 * Format currency value
 */
export function formatCurrency(value) {
  return parseFloat(value).toFixed(2);
}
