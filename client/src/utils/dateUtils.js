/**
 * Utility functions for date formatting and deadline checks across Career Connect.
 * Enforces DD/MM/YYYY formatting everywhere.
 */

/**
 * Formats a date string, Date object, or timestamp to DD/MM/YYYY.
 * Handles ISO strings without timezone drift.
 * @param {string|Date|number} dateInput - The date to format
 * @returns {string} Date string in DD/MM/YYYY format, or empty string if invalid
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '';

  // If it's a date-only string or ISO string with midnight UTC (e.g., 2026-11-25 or 2026-11-25T00:00:00.000Z)
  if (typeof dateInput === 'string') {
    const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match && (dateInput.length === 10 || dateInput.includes('T00:00:00'))) {
      const [, y, m, d] = match;
      return `${d}/${m}/${y}`;
    }
  }

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formats a date with time into DD/MM/YYYY, HH:MM AM/PM.
 * @param {string|Date|number} dateInput - The date to format
 * @returns {string} Formatted string
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
};

/**
 * Checks whether a job's application deadline has passed.
 * Application is open until 23:59:59.999 on the deadline day.
 * @param {string|Date|number} deadlineInput - The deadline date
 * @returns {boolean} True if deadline has passed
 */
export const isDeadlineOver = (deadlineInput) => {
  if (!deadlineInput) return false;

  let endOfDay;
  if (typeof deadlineInput === 'string') {
    const match = deadlineInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match && (deadlineInput.length === 10 || deadlineInput.includes('T00:00:00'))) {
      const [, y, m, d] = match;
      endOfDay = new Date(Number(y), Number(m) - 1, Number(d), 23, 59, 59, 999);
    }
  }

  if (!endOfDay) {
    const date = new Date(deadlineInput);
    if (isNaN(date.getTime())) return false;
    endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
  }

  return new Date() > endOfDay;
};
