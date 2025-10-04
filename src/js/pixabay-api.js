import axios from "axios";

const API_KEY = "52507179-0a3bafb5b272d1890f0df5cc7";
const BASE_URL = "https://pixabay.com/api/";
const PER_PAGE = 15;

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
  },
});

/**
 * @param {string} query
 * @param {number} [page=1]
 * @param {number} [per_page=PER_PAGE]
 * @param {AbortSignal} [signal]
 * @returns {Promise<{hits: any[], totalHits: number}>}
 */
export async function getImagesByQuery(query, page = 1, per_page = PER_PAGE, signal) {
  try {
    if (!query || typeof query !== "string" || query.trim() === "") {
      return { hits: [], totalHits: 0 };
    }
    const { data } = await api.get("", {
      params: { q: query, page, per_page },
      signal,
    });

    const hits = Array.isArray(data?.hits) ? data.hits : [];
    const totalHits = Number.isFinite(data?.totalHits) ? data.totalHits : 0;

    return { hits, totalHits };
  } catch (error) {
    if (axios.isCancel?.(error)) throw error;
    console.error("Pixabay API error:", error?.message || error);
    throw error;
  }
}