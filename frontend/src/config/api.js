// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:12000/api';
console.log('API URL:', API_URL);

export const endpoints = {
  // Auth endpoints
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  
  // User endpoints
  userProfile: `${API_URL}/users/me`,
  updateProfile: `${API_URL}/users/me`,
  
  // Tool endpoints
  tools: `${API_URL}/tools`,
  toolById: (id) => `${API_URL}/tools/${id}`,
  toolsByCategory: (category) => `${API_URL}/tools?category=${category}`,
  toolsByDifficulty: (difficulty) => `${API_URL}/tools?difficulty=${difficulty}`,
  toolsByTags: (tags) => `${API_URL}/tools?tags=${tags.join(',')}`,
  categories: `${API_URL}/tools/categories/all`,
  
  // Learning plan endpoints
  learningPlans: `${API_URL}/learning-plans`,
  learningPlanById: (id) => `${API_URL}/learning-plans/${id}`,
  userPlans: `${API_URL}/learning-plans/my-plans`,
  startPlan: (id) => `${API_URL}/learning-plans/${id}/start`,
  updateProgress: (id) => `${API_URL}/learning-plans/${id}/progress`,
  completeTask: (id) => `${API_URL}/learning-plans/${id}/complete-task`,
  
  // Assessment endpoints
  assessmentQuestions: `${API_URL}/assessment/questions`,
  submitAssessment: `${API_URL}/assessment/submit`,
  userAssessment: `${API_URL}/assessment/my-assessment`,
  assessmentAnalysis: `${API_URL}/assessment/analyze`,
};

export default API_URL;