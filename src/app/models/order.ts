import { FinancingTypesData } from "./financing-type";
import { OfferData } from "./offer";
import { PaymentTypeData } from "./payment-type";
import { ProductDetailsData } from "./product-details";

export interface OrderData {
    invoiceId: number | null,
    idCli: number, 
    paymentsType: PaymentTypeData,
    paymentMethod: PaymentMethodData,
    dues: FinancingTypesData | string,
    initialFee: number,
    offer: OfferData, 
    invoiceDate: string,
    subtotal: number,  
    tax: number, 
    discount: number, 
    total: number,
    details: ProductDetailsData[]
}