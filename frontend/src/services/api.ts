// Use localhost for web, your IP for mobile

const API_BASE_URL = "https://localhost:8000";

export const api = {
    getFridgeItems: async () => {
        const response = await fetch(`${API_BASE_URL}/fridge-items`);
        return response.json();
    },
};