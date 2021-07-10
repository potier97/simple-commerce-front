import { PayDocumentData } from "./PayDocument";

export interface MistakeData {
    idMistake: number | null,
    idPayDoc: PayDocumentData,
    errorDate: string,
    description: string
}
