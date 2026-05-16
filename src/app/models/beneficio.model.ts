export interface Cuenta {
  idcuenta: number;
  noCuenta: string;
  nitagricultor: string;
  pesoTotalEsperado: number;
  fechaCreacion: string;
  idEstadoPesaje: number;
  nombreAgricultor: string;
  estadoNombre: string;
  cantParcialidades: number; // Mapeado exacto con el conteo
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
  estadopesaje: number | null; // 99 para "Pesaje Realizado"
  fecharecepcion: string | null;
}
