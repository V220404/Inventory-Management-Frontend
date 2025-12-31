/**
 * Currency formatting utility for INR (Indian Rupee)
 */

/**
 * Format a number as Indian Rupee currency
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the currency symbol (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '₹0.00' : '0.00';
  }
  
  const formatted = parseFloat(amount).toFixed(2);
  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Format currency without decimal places (for whole numbers)
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the currency symbol (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrencyWhole = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '₹0' : '0';
  }
  
  const formatted = Math.round(parseFloat(amount)).toLocaleString('en-IN');
  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Get the currency symbol
 * @returns {string} Currency symbol (₹)
 */
export const getCurrencySymbol = () => '₹';

export default formatCurrency;




