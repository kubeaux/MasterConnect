import axios from "axios";
import type { User, Campaign, Project } from "@/src/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem("access_token", data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;


export const authApi = {
  login: (data: { identifiant_universitaire: string; mot_de_passe: string }) =>
    api.post("/token/", {
        username: data.identifiant_universitaire,
        password: data.mot_de_passe
    }),
  refresh: (refresh: string) =>
    api.post("/token/refresh/", { refresh }),
  register: (data: Record<string, string>) =>
    api.post("/users/register/", data),
};

export const projectsApi = {
  getAll: (params?: Record<string, string>) => api.get("/projects/", { params }),
  getById: (id: number) => api.get(`/projects/${id}/`),
  create: (data: Record<string, unknown>) => api.post("/projects/", data),
  update: (id: number, data: Record<string, unknown>) => api.patch(`/projects/${id}/`, data),
  delete: (id: number) => api.delete(`/projects/${id}/`),
};

export const campaignApi = {
  getCurrent: () => api.get("/campaigns/current/"),
  updateStatus: (status: string) => api.post("/campaigns/update-status/", { statut: status }),
  launchAlgorithm: () => api.post("/campaigns/launch-algorithm/"),
  update: (id: number, data: Partial<Campaign>) => api.patch(`/campaigns/${id}/`, data),
};

export const adminApi = {
  getStats: () => api.get("/admin/stats/"),
  getSupervisors: () => api.get("/admin/supervisors/"),
  getStudents: () => api.get("/admin/students/"),
  validateProject: (id: number) => api.post(`/admin/projects/${id}/validate/`),
  rejectProject: (id: number) => api.post(`/admin/projects/${id}/reject/`),
  forceAssignment: (studentId: number, projectId: number | null) => 
      api.post('/assignments/force/', { etudiant_id: studentId, projet_id: projectId }),
};

export const login = async (identifiant: string, mot_de_passe: string) => {
  try {
    const response = await fetch(`${API_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: identifiant, password: mot_de_passe }),
    });

    if (!response.ok) {
        const err = await response.json().catch(()=>({}));
        console.error("Erreur retournée par Django:", err);
        throw new Error('Identifiants incorrects');
    }

    const data = await response.json();
    const token = data.access || data.token || data.access_token;
    
    let roleUser = "etudiant";
    if (identifiant === "admin") roleUser = "administrateur";
    if (identifiant === "prof") roleUser = "encadrant";

    const currentUser = {
      id: 1,
      identifiant_universitaire: identifiant,
      email: `${identifiant}@univ.paris.fr`,
      role: roleUser,
      date_creation: new Date().toISOString()
    };

    if (token) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('refresh_token', data.refresh || token);
      localStorage.setItem('user', JSON.stringify(currentUser));
    }
    
    return { ...data, user: currentUser };
  } catch (error) {
    console.error('Erreur API Login:', error);
    throw error;
  }
};