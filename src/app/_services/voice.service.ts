import { Injectable } from "@angular/core";
import { FormdataReportdef } from "../_models/formdata";
import { FormGroup } from "@angular/forms";
import { User } from "../_models";
import { HttpClient } from '@angular/common/http';
import { ParametrosExecuteMethodRequestDTO } from "../_models/parametrosExecuteMethodRequestDTO";
import { ReportMethodResponseDTO } from "../_models/reportMethodResponseDTO";
import { devolverProyecto } from "../util/reportdefUtil";
import { BehaviorSubject, map } from "rxjs";
import { FrontEndConstants } from "../constans/frontEndConstants";
import { HeaderDTO } from "../_models/headerDTO";

@Injectable({ providedIn: 'root' })

export class VoiceService {
    private currentReport = new BehaviorSubject<string>('0');
    private changueCombo = new BehaviorSubject<FormdataReportdef>(null);
    public report$ = this.currentReport.asObservable();
    public combo$ = this.changueCombo.asObservable();
    public actualizarCampo: boolean = false;
    public paramsForm: FormdataReportdef[];
    public form: FormGroup;

    constructor(private http: HttpClient) { }

    setCurrentReport(report:string) {
        this.currentReport.next(report);
    }

    setChangueCombo(combo){
        this.changueCombo.next(combo);
    }

    postVoiceToAction(user: User, audioB64: string, mediaType: string, ObjJSON: string, text: string) {
        let dto = {} as ParametrosExecuteMethodRequestDTO;
        let audioFile = {
            name: 'p_data',
            type: FrontEndConstants.JAVA_LANG_STRING,
            valueNew: audioB64,
            text: true,

        } as FormdataReportdef;

        let mediaT = {
            name: 'p_mediaType',
            type: FrontEndConstants.JAVA_LANG_STRING,
            valueNew: mediaType,
            text: true,
        } as FormdataReportdef;

        let ObjString = {
            name: 'p_objJSON',
            type: FrontEndConstants.JAVA_LANG_STRING,
            valueNew: ObjJSON,
            text: true,
        } as FormdataReportdef;

        let ptext = {
            name: 'p_text',
            type: FrontEndConstants.JAVA_LANG_STRING,
            valueNew: text,
            text: true,
        } as FormdataReportdef;

        dto.list = [];
        dto.list.push(audioFile, mediaT, ObjString, ptext);
        dto.metodo = 'voiceToAction';
        dto.username = user.username;
        dto.dataSource = user.datasource;
        dto.webServicesAddress = user.webservice;
        dto.modelPackage = user.packageModel;
        dto.idUsuarioUra = user.idUsuarioUra;
        return this.http.post<ReportMethodResponseDTO>(`${devolverProyecto()}/ejecutarMetodo/`, dto)
            .pipe(map(result => result));
    }
}