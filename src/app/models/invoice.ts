import { ClientsResponse } from './clients';
import { PaidModesResponse } from './paid-modes';

export interface InvoiceResponse {
  id: number;
  total: string;
  subtotal: string;
  fecha: Date;
  iva: number;
  estado: number;
  creadoEn: Date;
  ActualizadoEn: Date;
  idCliente: ClientsResponse;
  idModoPago: PaidModesResponse;
  detalles: DetailsResponse[];
}

export interface DetailsResponse {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  estado: number;
  creadoEn: Date;
  ActualizadoEn: Date;
}
