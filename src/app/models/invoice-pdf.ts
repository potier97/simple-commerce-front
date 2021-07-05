export interface InvoicePdf {
    name: string
    price: number, 
    qty: number,
    tax: number,
    total: number 
}

export interface CustomerPdf {  
    customerName: string, 
    address: string,  
    email: string,
    contactNo: string, 
}
