export interface ProductsResponse {
  id?: number;
  dni: string;
  cantidad: number;
  precio: string;
  nombre: string;
  estado: number;
  creadoEn?: Date;
  ActualizadoEn?: Date;
}

