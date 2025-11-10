const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API error')
  }
  return response.json()
}

export const authAPI = {
  signup: (data) => apiCall('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
}

export const roomsAPI = {
  getAll: () => apiCall('/rooms'),
  create: (data) => apiCall('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/rooms/${id}`, { method: 'DELETE' }),
  usage: () => apiCall('/rooms/usage'),
}

export const resourcesAPI = {
  getAll: () => apiCall('/resources'),
  create: (data) => apiCall('/resources', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/resources/${id}`, { method: 'DELETE' }),
}

export const sessionsAPI = {
  getAll: () => apiCall('/sessions'),
  create: (data) => apiCall('/sessions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/sessions/${id}`, { method: 'DELETE' }),
}