export interface ProductsData {
    idProduct: number | null;
    name: string;
    idCode: number;
    amount: number;
    active: number;
    price: number;
    tax: number
}

export interface IncrementeProduct {
    idProduct: number; 
    amount: number; 
    idCode: number;
}
