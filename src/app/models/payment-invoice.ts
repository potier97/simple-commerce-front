import { PaymentTypeData } from "./payment-type";

export interface PaymentInvoiceData {
    idPay: number | null, 
    payRecord: number,  
    idInvoice: number,  
    payType: PaymentTypeData

}

 