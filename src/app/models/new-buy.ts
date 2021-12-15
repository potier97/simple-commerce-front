import { ClientsResponse } from "./clients";
import { PaidModesResponse } from "./paid-modes";

export interface NewBuyResponse {
    cliente: number;
    modoPago: number;
    total: number;
    subtotal: number;
    iva: number;
    fecha: Date;
    estado: number;
    details: DetailsBuyResponse[];
}

export interface DetailsBuyResponse {
    id: number;
    cantidad: number;
}

export interface PreDetailsResponse {
    id: number,
    nombre: string,
    precio: number
    cantidad: number,
    total: number;
}

export interface BuyReq {
    id: number,
    total: string,
    subtotal: string,
    fecha: Date,
    iva: number,
    estado: number,
    creadoEn: Date,
    ActualizadoEn: Date,
    idCliente: ClientsResponse,
    idModoPago: PaidModesResponse
}



