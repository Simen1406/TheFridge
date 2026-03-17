import type { FridgeItem, GroceryItem } from "@/types/foodTypes";

// Use localhost for web, your IP for mobile.
export const API_BASE_URL = "http://localhost:8000";

type ApiErrorDetails = {
    detail?: string;
    message?: string;
};

export class ApiRequestError extends Error {
    status: number;
    details: unknown;

    constructor(message: string, status: number, details: unknown) {
        super(message);
        this.name = "ApiRequestError";
        this.status = status;
        this.details = details;
    }
}

function getErrorMessage(statusText: string, details: unknown) {
    if (details && typeof details === "object") {
        const payload = details as ApiErrorDetails;
        if (typeof payload.detail === "string") return payload.detail;
        if (typeof payload.message === "string") return payload.message;
    }

    return statusText || "API request failed";
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, init);
    let data: unknown = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new ApiRequestError(getErrorMessage(response.statusText, data), response.status, data);
    }

    return data as T;
}

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
        return requestJson<FridgeItem[]>("/fridge-items_from_db");
    },
    deleteFridgeItem: async (itemId: number) => {
        return requestJson<{ success?: boolean }>(`/deleteFridgeItem?item_id=${itemId}`, {
            method: "POST",
        });
    },
};

export const retrieveGroceryItems = {
    getGroceryItems: async () => {
        return requestJson<GroceryItem[]>("/grocery-items_from_db");
    },
    deleteGroceryItem: async (itemId: number) => {
        return requestJson<{ success?: boolean }>(`/deleteGroceryItem?item_id=${itemId}`, {
            method: "POST",
        });
    }
};

export const addFridgeItem = async (item: NewFridgeItem) => {
    return requestJson<FridgeItem>("/ManualAddFridgeItem", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    });
};
export const addGroceryItem = async (item: NewGroceryItem) => {
    return requestJson<GroceryItem>("/ManualAddGroceryItem", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    });
};

export const pingApi = async () => {
    return requestJson<{ ping: string }>("/ping");
};
