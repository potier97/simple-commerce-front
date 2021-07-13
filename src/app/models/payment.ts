import { PayDocumentData } from "./payment-document";
import { PaymentMethodData } from "./payment-method";

export interface PaymentData {
    idPay: number | null,
    idPayMethod: PaymentMethodData,
    idPayDoc: PayDocumentData,
    payDate: string, 
    paidOut: number
}
   