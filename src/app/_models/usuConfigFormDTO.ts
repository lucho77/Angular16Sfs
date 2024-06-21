import { usuConfigForm } from "./usuConfigForm";

export interface usuConfigFormDTO {
    username: string;
    dataSource: string;
    webservice: string;
    packageModel: string;
    idUsuarioUra: number;
    alta: boolean;
    configsFormsByUser: usuConfigForm[];

}