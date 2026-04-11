/**
 * Centralized formatting utilities for Omnikit.
 */

/**
 * Formats a number as currency ($).
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Formats a date relative to now or in a standard format.
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats a time to HH:MM format.
 */
export const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Shorthand for decimal formatting.
 */
export const formatDecimal = (num, places = 2) => {
  return Number(num).toFixed(places);
};
