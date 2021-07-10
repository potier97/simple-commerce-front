import { CovenantData } from "./covenant";

export interface PayDocumentData {
    idPayDoc: number | null,
    idCovenant: CovenantData,
    urlDoc: string,
    totalRecords: number,
    dateRecords: string,
    allrecords: number,
    documentName: string
}
    