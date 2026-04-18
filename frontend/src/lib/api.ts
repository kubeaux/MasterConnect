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
  login: (data: { username: string; password: string }) =>
    api.post("/token/", data),
  refresh: (refresh: string) =>
    api.post("/token/refresh/", { refresh }),
  register: (data: { username: string; password: string; email?: string; role?: string }) =>
    api.post("/users/", data),
};

export const projectsApi = {
  getAll: (params?: Record<string, string>) => api.get("/projects/", { params }),
  getById: (id: number) => api.get(`/projects/${id}/`),
  create: (data: Record<string, unknown>) => api.post("/projects/", data),
  update: (id: number, data: Record<string, unknown>) => api.patch(`/projects/${id}/`, data),
  delete: (id: number) => api.delete(`/projects/${id}/`),
};

export const campaignApi = {
  getCurrent: async () => {
    const defaultDates = {
      date_debut: new Date().toISOString(),
      date_fin: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // Date de fin = +1 mois
    };

    try {
      const assignRes = await api.get("/assignments/");
      const assignments = assignRes.data?.results || assignRes.data || [];
      
      if (assignments.length > 0) {
        return { data: { id: 1, statut: "terminee", nom: "Campagne d'Affectation", ...defaultDates } };
      }

      const projRes = await api.get("/projects/");
      const projects = projRes.data?.results || projRes.data || [];

      if (projects.length > 0) {
        return { data: { id: 1, statut: "en_cours", nom: "Campagne d'Affectation", ...defaultDates } };
      }

      return { data: { id: 1, statut: "en_attente", nom: "Campagne d'Affectation", ...defaultDates } };

    } catch (error) {
      console.warn("Mode de secours activé pour la campagne");
      return { data: { id: 1, statut: "en_cours", nom: "Campagne (Mode Secours)", ...defaultDates } };
    }
  },

  updateStatus: (status: string) => Promise.resolve({ data: { statut: status } }),
  launchAlgorithm: () => Promise.resolve({ data: { message: "Lancement de l'algorithme" } }),
  update: (id: number, data: any) => Promise.resolve({ data }),
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

export const wishesApi = {
  getMine: () => api.get("/wishes/"),
  create: (data: Record<string, unknown>) => api.post("/wishes/", data),
  update: (id: number, data: Record<string, unknown>) => api.patch(`/wishes/${id}/`, data),
  delete: (id: number) => api.delete(`/wishes/${id}/`),
};

export const assignmentsApi = {
  getMyAssignment: () => api.get("/assignments/"),
  getMine: () => api.get("/assignments/"),
};

export const login = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const err = await response.json().catch(()=>({}));
        console.error("Erreur retournée par Django:", err);
        throw new Error('Identifiants incorrects');
    }

    const data = await response.json();
    const token = data.access || data.token || data.access_token;
    
    let roleUser = "etudiant";
    if (username === "admin") roleUser = "administrateur";
    if (username === "prof") roleUser = "encadrant";

    const currentUser = {
      id: 1,
      username: username,
      email: `${username}@univ.paris.fr`,
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

export const fetcher = (url: string) => api.get(url).then(res => res.data);