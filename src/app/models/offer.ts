export interface OfferData {
    idOffer: number | null;
    idOfferType: TypeOfferData;
    description: string;
    percentage: number;
    value: number; 
}


export interface TypeOfferData {
    idOfferType: number | null;
    name: string; 
}