export interface Cuenta {
  idcuenta: number;
  noCuenta: string;
  nitagricultor: string;
  estado: number;
  fechaCreacion: string;
  pesoTotalEsperado: number;
  idEstadoPesaje: number;
}

export interface DetalleCuenta {
  iddetallecuenta: number;
  nocuenta: string;
  noparcialidad: number;
  placa: string;
  cuitransportista: string;
  pesoestimado: number;
  pesorecibido: number;
  estadopesaje: number;
  fechacreacion: string;
}
