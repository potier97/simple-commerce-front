import { PayDocumentData } from "./payment-document";
import { paymentMethodData } from "./payment-method";

export interface PaymentData {
    idPay: number | null,
    idPayMethod: paymentMethodData,
    idPayDoc: PayDocumentData,
    payDate: string, 
    paidOut: number
}
   