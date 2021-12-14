import { ProductDetailsData } from "./product-details";
import { UserData } from "./user";

export interface PreOrderData {
    products: ProductDetailsData[];
    client: UserData; 
}