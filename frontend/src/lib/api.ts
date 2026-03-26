import axios from "axios";
import { API_URL } from "./constants";

// ── Instance Axios configurée ──
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Intercepteur : ajouter le token JWT automatiquement ──
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Intercepteur : gérer l'expiration du token ──
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si 401 et pas déjà retried, essayer de refresh
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
        // Refresh échoué → déconnecter
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

// ── Fonctions API par domaine ──

// Auth
export const authApi = {
  login: (data: { identifiant_universitaire: string; mot_de_passe: string }) =>
    api.post("/token/", data),
  refresh: (refresh: string) =>
    api.post("/token/refresh/", { refresh }),
  register: (data: Record<string, string>) =>
    api.post("/users/register/", data),
};

// Projets
export const projectsApi = {
  getAll: (params?: Record<string, string>) =>
    api.get("/projects/", { params }),
  getById: (id: number) =>
    api.get(`/projects/${id}/`),
  create: (data: Record<string, unknown>) =>
    api.post("/projects/", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.patch(`/projects/${id}/`, data),
  delete: (id: number) =>
    api.delete(`/projects/${id}/`),
};

// Voeux
export const wishesApi = {
  getMine: () =>
    api.get("/wishes/"),
  add: (projectId: number, rang: number) =>
    api.post("/wishes/", { projet: projectId, rang }),
  remove: (wishId: number) =>
    api.delete(`/wishes/${wishId}/`),
  reorder: (wishes: { id: number; rang: number }[]) =>
    api.post("/wishes/reorder/", { wishes }),
  validate: () =>
    api.post("/wishes/validate/"),
};

// Campagne
export const campaignApi = {
  getCurrent: () =>
    api.get("/campaigns/current/"),
  updateStatus: (status: string) =>
    api.post("/campaigns/update-status/", { statut: status }),
  launchAlgorithm: () =>
    api.post("/campaigns/launch-algorithm/"),
};

// Affectations
export const assignmentsApi = {
  getMine: () =>
    api.get("/assignments/mine/"),
  getAll: () =>
    api.get("/assignments/"),
};

// Admin
export const adminApi = {
  getStats: () =>
    api.get("/admin/stats/"),
  getSupervisors: () =>
    api.get("/admin/supervisors/"),
  getStudents: () =>
    api.get("/admin/students/"),
  validateProject: (id: number) =>
    api.post(`/admin/projects/${id}/validate/`),
  rejectProject: (id: number) =>
    api.post(`/admin/projects/${id}/reject/`),
};