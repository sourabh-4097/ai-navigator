import { endpoints } from '../config/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// Helper function for API requests
const apiRequest = async (url, options = {}) => {
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle non-2xx responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unknown error occurred',
    }));
    throw new Error(error.message || 'An unknown error occurred');
  }

  // Return the response data
  return response.json();
};

// Auth services
export const authService = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(endpoints.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: 'Login failed',
      }));
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  },

  register: async (userData) => {
    return apiRequest(endpoints.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!getToken();
  },
};

// User services
export const userService = {
  getProfile: async () => {
    return apiRequest(endpoints.userProfile);
  },

  updateProfile: async (userData) => {
    return apiRequest(endpoints.updateProfile, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// Tool services
export const toolService = {
  getAllTools: async () => {
    return apiRequest(endpoints.tools);
  },

  getToolById: async (id) => {
    return apiRequest(endpoints.toolById(id));
  },

  getToolsByCategory: async (category) => {
    return apiRequest(endpoints.toolsByCategory(category));
  },

  getToolsByDifficulty: async (difficulty) => {
    return apiRequest(endpoints.toolsByDifficulty(difficulty));
  },

  getToolsByTags: async (tags) => {
    return apiRequest(endpoints.toolsByTags(tags));
  },

  getAllCategories: async () => {
    return apiRequest(endpoints.categories);
  },
};

// Learning plan services
export const learningPlanService = {
  getAllPlans: async () => {
    return apiRequest(endpoints.learningPlans);
  },

  getPlanById: async (id) => {
    return apiRequest(endpoints.learningPlanById(id));
  },

  getUserPlans: async () => {
    return apiRequest(endpoints.userPlans);
  },

  startPlan: async (id) => {
    return apiRequest(endpoints.startPlan(id), {
      method: 'POST',
    });
  },

  updateProgress: async (id, progress, completed = false) => {
    return apiRequest(endpoints.updateProgress(id), {
      method: 'PUT',
      body: JSON.stringify({ progress, completed }),
    });
  },

  completeTask: async (id, weekNumber, taskId) => {
    return apiRequest(endpoints.completeTask(id), {
      method: 'POST',
      body: JSON.stringify({ week_number: weekNumber, task_id: taskId }),
    });
  },
};

// Assessment services
export const assessmentService = {
  getQuestions: async () => {
    return apiRequest(endpoints.assessmentQuestions);
  },

  submitAssessment: async (answers) => {
    return apiRequest(endpoints.submitAssessment, {
      method: 'POST',
      body: JSON.stringify(answers),
    });
  },

  getUserAssessment: async () => {
    return apiRequest(endpoints.userAssessment);
  },

  getAssessmentAnalysis: async () => {
    return apiRequest(endpoints.assessmentAnalysis);
  },
};