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
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
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
      date_fin: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    };

    try {
      const assignRes = await api.get("/assignments/");
      const assignments = assignRes.data?.results || assignRes.data || [];
      
      if (assignments.length > 0) {
        return { data: { id: 1, statut: "PUBLIEE", nom: "Campagne d'Affectation", ...defaultDates } };
      }

      const projRes = await api.get("/projects/");
      const projects = projRes.data?.results || projRes.data || [];

      if (projects.length > 0) {
        return { data: { id: 1, statut: "OUVERTE", nom: "Campagne d'Affectation", ...defaultDates } };
      }

      return { data: { id: 1, statut: "VERROUILLEE", nom: "Campagne d'Affectation", ...defaultDates } };

    } catch (error) {
      return { data: { id: 1, statut: "OUVERTE", nom: "Campagne (Mode Secours)", ...defaultDates } };
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
  validateProject: (id: number) => api.post(`/projects/${id}/approve/`),
  rejectProject:   (id: number) => api.post(`/projects/${id}/reject/`),
  forceAssignment: (studentId: number, projectId: number | null) => 
      api.post('/assignments/force/', { etudiant_id: studentId, projet_id: projectId }),
};

export const wishesApi = {
  getMine: () => api.get("/wishes/"),
  create: (data: Record<string, unknown>) => api.post("/wishes/", data),
  update: (id: number, data: Record<string, unknown>) => api.patch(`/wishes/${id}/`, data),
  delete: (id: number) => api.delete(`/wishes/${id}/`),
  reorder: (data: {id: number, rank: number}[]) => api.post("/wishes/reorder/", data),
};

export const assignmentsApi = {
  getMyAssignment: () => api.get("/assignments/"),
  getMine: () => api.get("/assignments/"),
};

export const login = async (username: string, password: string) => {
  const { data } = await axios.post(`${API_URL}/token/`, { username, password });

  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);

  const userPayload = data.user ?? {
    id: 0,
    username,
    user_type: 'etudiant' as const,
  };

  localStorage.setItem('user', JSON.stringify(userPayload));
  return { token: data.access, user: userPayload };
};

export const fetcher = (url: string) => api.get(url).then(res => res.data);