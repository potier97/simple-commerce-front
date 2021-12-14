import { PayDocumentData } from "./payment-document";

export interface MistakeData {
    idMistake: number | null,
    idPayDoc: PayDocumentData,
    errorDate: string,
    description: string
}
