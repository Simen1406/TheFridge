// Use localhost for web, your IP for mobile

const API_BASE_URL = "http://localhost:8000";

export type NewFridgeItem = {
    name: string;
    category: string;
    quantity: string;    // turn into number before sending to backend
    unit: string;
    expiration_date: string;    
};

export const api = {
    getFridgeItems: async () => {
        const response = await fetch(`${API_BASE_URL}/fridge-items`);
        return response.json();
    },
};

export const addFridgeItem = async (item: NewFridgeItem) => {
    const response = await fetch(`${API_BASE_URL}/AddFridgeItem`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...item,
            quantity: parseInt(item.quantity) // Convert quantity to number before sending
        }),
    });
    return response.json();
};