import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const getTickets = (params) => api.get("/tickets", { params }).then((r) => r.data);
export const createTicket = (formData) =>
  api.post("/tickets", formData).then((r) => r.data);
export const verifyTicket = (id, user) => api.post(`/tickets/${id}/verify`, { user }).then((r) => r.data);
export const advanceTicket = (id) => api.patch(`/tickets/${id}/advance`).then((r) => r.data);
export const getStats = () => api.get("/tickets/stats/summary").then((r) => r.data);
export const getLeaderboard = () => api.get("/users/leaderboard").then((r) => r.data);

export const chatWithAssistant = (message, history) =>
  api.post("/assistant/chat", { message, history }).then((r) => r.data);

export default api;
