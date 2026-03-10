// Use localhost for web, your IP for mobile

const API_BASE_URL = "http://localhost:8000";

export type NewFridgeItem = {
    ean: string;
    name: string;
    brand: string;
    price: string;
    weight: string;
    weight_unit: string;
    image: string;
    expiration_date: string | null;    
};

export type NewGroceryItem = {
    ean: string;
    name: string;
    brand: string;
    price: string;
    weight: string;
    weight_unit: string;
    image: string;
};

export const retrieveFridgeItems = {
    getFridgeItems: async () => {
        const response = await fetch(`${API_BASE_URL}/fridge-items_from_db`);
        return response.json();
    },
    deleteFridgeItem: async (itemId: number) => {
        const response = await fetch(`${API_BASE_URL}/deleteFridgeItem?item_id=${itemId}`, {
            method: "POST",
        });
        return response.json();
    },
};

export const retrieveGroceryItems = {
    getGroceryItems: async () => {
        const respone = await fetch (`${API_BASE_URL}/grocery-items_from_db`);
        return respone.json();
    },
    deleteGroceryItem: async (itemId: number) => {
        const repsone = await fetch(`${API_BASE_URL}/deleteGroceryItem?item_id=${itemId}`, {
            method: "POST",
        });
        return repsone.json();
    }
};

export const addFridgeItem = async (item: NewFridgeItem) => {
    const response = await fetch(`${API_BASE_URL}/ManualAddFridgeItem`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    });
    return response.json();
};
export const addGroceryItem = async (item: NewGroceryItem) => {
    const response = await fetch(`${API_BASE_URL}/ManualAddGroceryItem`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    });
    return response.json();
};
