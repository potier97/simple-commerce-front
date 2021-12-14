import { PaymentMethodData } from "./payment-method";

export interface PaymentInvoiceData {
    idPay: number | null, 
    payRecord: number,  
    idInvoice: number,  
    payMethod: PaymentMethodData

}

 