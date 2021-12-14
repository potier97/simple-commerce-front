export interface CreditDebtData {
    idDebt: number | null,
    totalDebt: number,
    numInstallments: number,
    currentQuota: number, 
    pendingFees: number,
    balancePaid: number,
    debtStatus: number, 
} 