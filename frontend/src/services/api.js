import axios from "axios";

// Configurable via VITE_API_BASE_URL (see .env.example) so the same build
// can point at localhost in dev and a deployed backend in production,
// instead of a hardcoded localhost URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/fund";

const api = axios.create({
    baseURL,
    timeout: 20000,
});

/**
 * Calls the backend's real AI assistant endpoint (backed by an LLM),
 * sending the user's question plus the fund's actual fetched data as
 * context so the model can ground its answer in real numbers.
 */
export async function askFundAssistant(question, context) {
    const res = await api.post("/ai-assistant", { question, context });
    return res.data?.answer || "";
}

export default api;
