export interface ClientsResponse {
  id?:  number;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  telefono: string;
  estado: number;
  creadoEn?: Date;
  ActualizadoEn?: Date;
}
