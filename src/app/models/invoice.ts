import { CreditDebtData } from "./credit-debt";
import { OfferData } from "./offer";
import { PaymentData } from "./payment";
import { PaymentTypeData } from "./payment-type";
import { UserData } from "./user";
 
export interface InvoiceData {
    idBuy: number | null,
    idClient: UserData,
    idPayType: PaymentTypeData,
    idCreditDebt: CreditDebtData, 
    idDiscount: OfferData, 
    idPay: PaymentData,
    purchaseDate: string,
    feePayment: number,
    shareValue: number,
    discount: number,
    tax: number,
    subtotal: number,
    total: number,
    state: number, 
}
          