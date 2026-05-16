export interface Cuenta {
  idcuenta: number;
  nocuenta: string;            // 🚀 Ajustado a minúsculas
  nitagricultor: string;
  pesototalesperado: number;   // 🚀 Ajustado a minúsculas
  fechacreacion: string;       // 🚀 Ajustado a minúsculas
  idestadopesaje: number;      // 🚀 Ajustado a minúsculas
  nombreagricultor: string;    // 🚀 Ajustado a minúsculas
  estadonombre: string;        // 🚀 Ajustado a minúsculas
  cantparcialidades: number;   // 🚀 Ajustado a minúsculas
  unidadpesonombre: string;    // 🚀 Ajustado a minúsculas
}
export interface DetalleCuenta {
  iddetallecuenta: number;
  nocuenta: string;
  noparcialidad: number;
  placa: string;
  cuitransportista: string;
  pesoestimado: number;
  pesorecibido: number | null;
  estado: number;
  estadopesaje: number | null;
  fecharecepcion: string | null;
  tipomedida?: string; // 👈 También puede venir en el detalle
}
