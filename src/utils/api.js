/**
 * API utility to make authenticated requests
 * Automatically includes username in headers
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const username = user?.username;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add username to headers for authentication
  if (username) {
    defaultHeaders['x-username'] = username;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return response;
};

// Bill/POS related functions
export const getProductByBarcode = async (barcodeId, username) => {
  const response = await apiRequest(`/products/by-barcode/${barcodeId}`);
  return response.json();
};

export const createBill = async (username) => {
  const response = await apiRequest('/bills', {
    method: 'POST',
  });
  return response.json();
};

export const addItemToBill = async (billId, username, itemData) => {
  const response = await apiRequest(`/bills/${billId}/items`, {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
  return response.json();
};

export const getBill = async (billId, username) => {
  const response = await apiRequest(`/bills/${billId}`);
  return response.json();
};

export const updateBillItem = async (billId, itemId, username, quantity) => {
  const response = await apiRequest(`/bills/${billId}/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
  return response.json();
};

export const removeBillItem = async (billId, itemId, username) => {
  const response = await apiRequest(`/bills/${billId}/items/${itemId}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const checkoutBill = async (billId, username) => {
  const response = await apiRequest(`/bills/${billId}/checkout`, {
    method: 'POST',
  });
  return response.json();
};

// Sales/Revenue related functions
export const getRevenueStats = async (username) => {
  const response = await apiRequest('/sales/revenue');
  return response.json();
};

export const getAllSales = async (page = 1, limit = 100, startDate = null, endDate = null) => {
  let url = `/sales?page=${page}&limit=${limit}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  const response = await apiRequest(url);
  return response.json();
};

// Business Intelligence (BI) related functions
export const getSalesTrends = async (period = 30) => {
  try {
    const response = await apiRequest(`/bi/sales-trends?period=${period}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        success: false, 
        message: `Server error: ${response.status}` 
      }));
      return errorData;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sales trends:', error);
    return { success: false, message: 'Failed to fetch sales trends' };
  }
};

export const getProductPerformance = async (limit = 10) => {
  try {
    const response = await apiRequest(`/bi/product-performance?limit=${limit}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        success: false, 
        message: `Server error: ${response.status}` 
      }));
      return errorData;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product performance:', error);
    return { success: false, message: 'Failed to fetch product performance' };
  }
};

export const getProfitLoss = async (period = 30) => {
  try {
    const response = await apiRequest(`/bi/profit-loss?period=${period}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        success: false, 
        message: `Server error: ${response.status}` 
      }));
      return errorData;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching profit loss:', error);
    return { success: false, message: 'Failed to fetch profit loss data' };
  }
};

export const getForecast = async () => {
  try {
    const response = await apiRequest('/bi/forecast');
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        success: false, 
        message: `Server error: ${response.status}` 
      }));
      return errorData;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return { success: false, message: 'Failed to fetch forecast data' };
  }
};

export const getLowStockAlerts = async (threshold = 10) => {
  try {
    const response = await apiRequest(`/bi/low-stock?threshold=${threshold}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        success: false, 
        message: `Server error: ${response.status}` 
      }));
      return errorData;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching low stock alerts:', error);
    return { success: false, message: 'Failed to fetch low stock alerts' };
  }
};

export default apiRequest;

