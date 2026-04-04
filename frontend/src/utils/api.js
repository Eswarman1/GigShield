import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authorization token found. Please log in.');
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  verifyIdentity: () => apiClient.post('/users/verify-identity'),
  verifyDocuments: () => apiClient.post('/users/verify-documents'),
};

// Policy API
export const policyAPI = {
  getPolicies: () => apiClient.get('/policies'),
  getPolicyById: (id) => apiClient.get(`/policies/${id}`),
  createPolicy: (data) => apiClient.post('/policies', data),
  activatePolicy: (id) => apiClient.post(`/policies/${id}/activate`),
  cancelPolicy: (id) => apiClient.post(`/policies/${id}/cancel`),
  recalculatePremium: (id) => apiClient.post(`/policies/${id}/recalculate-premium`),
};

// Claim API
export const claimAPI = {
  getClaims: () => apiClient.get('/claims'),
  getClaimById: (id) => apiClient.get(`/claims/${id}`),
  checkDisruption: (data) => apiClient.post('/claims/check-disruption', data),
  submitClaim: (data) => apiClient.post('/claims', data),
  updateClaimStatus: (id, data) => apiClient.post(`/claims/${id}/update-status`, data),
  withdrawClaim: (id) => apiClient.post(`/claims/${id}/withdraw`),
};

export default apiClient;