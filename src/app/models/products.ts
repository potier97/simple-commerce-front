export interface ProductsData {
    idProduct: number;
    name: string;
    idCode: number;
    amount: number;
    active: number;
    price: number;
    tax: number
}

export interface incrementeProduct {
    idProduct: number; 
    amount: number; 
    idCode: number;
}
