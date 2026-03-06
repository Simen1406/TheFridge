export type FridgeItem = {
    id: number;
    ean: string;
    name: string;
    brand: string;
    price: number;
    weight: number;
    weight_unit: string;
    image: string;
    expiration_date: string | null;
};

export type GroceryItem = {
    id: number;
    ean: string;
    name: string;
    brand: string;
    price: number;
    weight: number;
    weight_unit: string;
    image: string;
    expiration_date: string | null;
};