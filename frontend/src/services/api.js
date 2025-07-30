const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

// Helper function to build query parameters
const buildQuery = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  return response.json();
};

// Assessment API
export const assessmentAPI = {
  getQuestions: async () => {
    const response = await fetch(`${API_BASE}/assessment/questions`);
    return handleResponse(response);
  },

  submitAssessment: async (answers, userEmail) => {
    const response = await fetch(`${API_BASE}/assessment?user_email=${encodeURIComponent(userEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });
    return handleResponse(response);
  },
};

// Tools API
export const toolsAPI = {
  getTools: async (filters = {}) => {
    const query = buildQuery(filters);
    const response = await fetch(`${API_BASE}/tools${query}`);
    return handleResponse(response);
  },

  getTool: async (id) => {
    const response = await fetch(`${API_BASE}/tools/${id}`);
    return handleResponse(response);
  },
};

// Learning Plans API
export const plansAPI = {
  getPlans: async (filters = {}) => {
    const query = buildQuery(filters);
    const response = await fetch(`${API_BASE}/learning-plans${query}`);
    return handleResponse(response);
  },

  getPlan: async (id, userEmail = null) => {
    const query = userEmail ? `?user_email=${encodeURIComponent(userEmail)}` : '';
    const response = await fetch(`${API_BASE}/learning-plans/${id}${query}`);
    return handleResponse(response);
  },

  updateProgress: async (planId, progressUpdate, userEmail) => {
    const response = await fetch(`${API_BASE}/learning-plans/${planId}/progress?user_email=${encodeURIComponent(userEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progressUpdate),
    });
    return handleResponse(response);
  },
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: async (userEmail) => {
    const response = await fetch(`${API_BASE}/dashboard?user_email=${encodeURIComponent(userEmail)}`);
    return handleResponse(response);
  },
};

// User API
export const userAPI = {
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await fetch(`${API_BASE}/health`);
    return handleResponse(response);
  },
};