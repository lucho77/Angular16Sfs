import { MetodoDTO } from './metodoDTO';
import { Tabular } from './tabular';
export interface FechaCustomDTO {

    dataTableDTO: Tabular;
    dataTableStDTO: Tabular;
    mansajeSeleccion: string;
    mensajeSinResultados: string;
    idSeleccionado: number;
    nameParamSel: string;
    fechaDesde: string;
    metodoStDTO: MetodoDTO;

}
