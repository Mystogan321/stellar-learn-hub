
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://mock-api.example.com/api', // Replace with actual mock API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login page
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock API helper function to simulate API calls
api.mockRequest = async (method, endpoint, data = null, delay = 500) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Mock response based on endpoint
  let response;
  
  switch (`${method.toLowerCase()} ${endpoint}`) {
    case 'get /api/admin/users':
      response = {
        data: [
          { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'learner' },
          { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'learner' },
          { id: 'user-3', name: 'Admin User', email: 'admin@example.com', role: 'admin' }
        ]
      };
      break;
      
    case 'get /api/admin/reports/courses':
      response = {
        data: [
          { courseId: 'course-1', title: 'React Fundamentals', enrolled: 42, completed: 28, inProgress: 14, completionRate: 66.7 },
          { courseId: 'course-2', title: 'Advanced TypeScript', enrolled: 35, completed: 12, inProgress: 23, completionRate: 34.3 },
          { courseId: 'course-3', title: 'JavaScript Design Patterns', enrolled: 27, completed: 19, inProgress: 8, completionRate: 70.4 }
        ]
      };
      break;
      
    case 'get /api/admin/reports/assessments':
      response = {
        data: [
          { attemptId: 'attempt-1', userId: 'user-1', userName: 'John Doe', assessmentId: 'assessment-1', assessmentTitle: 'React Fundamentals Quiz', score: 80, date: '2023-04-20' },
          { attemptId: 'attempt-2', userId: 'user-2', userName: 'Jane Smith', assessmentId: 'assessment-1', assessmentTitle: 'React Fundamentals Quiz', score: 75, date: '2023-04-21' },
          { attemptId: 'attempt-3', userId: 'user-1', userName: 'John Doe', assessmentId: 'assessment-2', assessmentTitle: 'Advanced TypeScript Assessment', score: 65, date: '2023-04-22' }
        ]
      };
      break;
      
    default:
      // Default success response
      response = { data: { success: true } };
  }
  
  return response;
};

export default api;
