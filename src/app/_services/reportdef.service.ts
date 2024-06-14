﻿import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../_models';
import { TipoReporte } from '../_models/tipoReporte';
import { Tabular } from '../_models/tabular';
import { TabularAbmRequestDTO } from '../_models/TabularAbmRequestDTO';
import { TabularRequestDTO } from '../_models/TabularRequestDTO';
import { ParametrosExecuteMethodRequestDTO } from '../_models/parametrosExecuteMethodRequestDTO';
import { AltaEdicionABMDTO } from '../_models/edicionABM';
import { ContainerAbmNuevoDTO } from '../_models/AbmEditResponse';
import { FormdataReportdef } from '../_models/formdata';
import { PersistirEntidadRequest } from '../_models/persistirEntidadRequest';
import { PersistirEntidadResponse } from '../_models/persistirEntidadResponse';
import { ConsultarHijosDTO } from '../_models/consultarHijos';
import { ParamRequestDTO } from '../_models/paramRequestDTO';
import { DownloadFileRequestDTO } from '../_models/downloadFileRequestdto';
import { BinarioDTO } from '../_models/binarioDTO';
import { ObtenerPropiedadDTO } from '../_models/ObtenerPropiedadDTO';
import { ParamAllRequestDTO } from '../_models/paramAllRequestDTO';
import { ObtenerToStringRequestDTO } from '../_models/obtenerToStringEntidad';
import { ObtenerToStringResponseDTO } from '../_models/obtenerToStringEntidadResponse';
import { ObtenerParametrosHijo } from '../_models/obtenerParametrosHijo';
import { DataHijoDTO } from '../_models/dataHijoDTO';
import { ReportMethodResponseDTO } from '../_models/reportMethodResponseDTO';
import { FormReportdef } from '../_models/form';
import { devolverProyecto } from '../util/reportdefUtil';
import { AppSettings } from '../app.settings';
import { environment } from 'src/environments/environment';
import { ObtenerMetodoRequestDto } from '../_models/obtenerMetodoRequestDto';
import { MetodoDTO } from '../_models/metodoDTO';
import { usuConfigFormDTO } from '../_models/usuConfigFormDTO';
import { usuConfigForm } from '../_models/usuConfigForm';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportdefService {
    constructor(private http: HttpClient,public appSettings: AppSettings) { }

    determinarTipoReportdef(reportdef: string) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
         return this.http.get<TipoReporte>(`${devolverProyecto()}/obtenerTipoReportdef/
         ${user.username}/${user.datasource}/${reportdef}`);
    }
  //  @Path("/dina/obtenerForm/{username}/{datasource}/{idUsuarioUra}/{packageAplication}/{webService}/{reportdef}")

    getObtenerForm(user: User, reportdef: String, global: any, paramForm: any) {
        for (const f of global) {
            if(f.name==='P_IDCOMPARTIR'){
                f.valueNew = user.sharedDTO?user.sharedDTO.idCompartir:environment.idCompartir;
                f.value = user.sharedDTO?user.sharedDTO.idCompartir:environment.idCompartir;
                break; 
            }    
        }
        const datos = {
            username: user.username,
            dataSource: user.datasource,
            token: user.token,
            idUsuarioUra: user.idUsuarioUra,
            webServicesAddress: user.webservice,
            modelPackage: user.packageModel,
            reporte: reportdef,
            idSessionUser: null,
            global: global,
            list: paramForm,
            idCompartir:user.sharedDTO?user.sharedDTO.idCompartir:environment.idCompartir
        };
        return this.http.post(`${devolverProyecto()}/obtenerForm/`, datos)
        .pipe(map(result => result));

    }

    getObtenerFormByClass(user: User, reportdef: String, global: any, paramForm: any) {
        const datos = {
            username: user.username,
            dataSource: user.datasource,
            token: user.token,
            idUsuarioUra: user.idUsuarioUra,
            webServicesAddress: user.webservice,
            modelPackage: user.packageModel,
            reporte: reportdef,
            idSessionUser: null,
            global: global,
            list: paramForm,
            aplicacion: user.aplicacion
        };
        return this.http.post(`${devolverProyecto()}/getFormByClassName/`, datos)
        .pipe(map(result => result));

    }



    getObtenerTabular( datos: TabularRequestDTO) {
        return this.http.post<Tabular>(`${devolverProyecto()}/obtenerTabular/`, datos)
        .pipe(map((data: Tabular) => data));
    }
    getObtenerTabularByMethod( datos: TabularRequestDTO) {
        return this.http.post<Tabular>(`${devolverProyecto()}/obtenerTabularByMethod/`, datos)
        .pipe(map((data: Tabular) => data));
    }
    getObtenerTabularAbm(datos: TabularAbmRequestDTO) {
        return this.http.post<Tabular>(`${devolverProyecto()}/obtenerTabularAbmNew/`, datos)
        .pipe(map((data: Tabular) => data));
    }
    postExecuteMethod(user: User, datos: ParametrosExecuteMethodRequestDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post<ReportMethodResponseDTO>(`${devolverProyecto()}/ejecutarMetodo/`, datos)
        .pipe(map(result => result));
    }
    postExecuteMethodForm(user: User, datos: ParametrosExecuteMethodRequestDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post<FormReportdef>(`${devolverProyecto()}/obtenerFormMethod/`, datos)
        .pipe(map(result => result));
    }
    getNewEditAbm(user: User, datos: AltaEdicionABMDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post<ContainerAbmNuevoDTO>(`${devolverProyecto()}/altaEdicionABM/`, datos)
        .pipe(map((data: ContainerAbmNuevoDTO) => data));
    }

    persistirModificarEntidad(user: User, datos: PersistirEntidadRequest) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post<PersistirEntidadResponse>(`${devolverProyecto()}/persistirEntidad/`, datos)
        .pipe(map((data: PersistirEntidadResponse) => data));
    }
    consultarHijos(user: User, datos: ConsultarHijosDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post<Tabular>(`${devolverProyecto()}/consultarHijos/`, datos)
        .pipe(map((data: Tabular) => data));
    }
    consultarParamByName(user: User, datos: ParamRequestDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post<FormdataReportdef>(`${devolverProyecto()}/consultarParametroByName/`, datos)
        .pipe(map((data: FormdataReportdef) => data));
    }
    consultarAllParamByName(user: User, datos: ParamAllRequestDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post<FormdataReportdef[]>(`${devolverProyecto()}/consultarAllParametrosByName/`, datos)
        .pipe(map((data: FormdataReportdef[]) => data));
    }
    consultarToStringEntidad(user: User, datos: ObtenerToStringRequestDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        console.log('datos');
        console.log(datos);
        return this.http.post<ObtenerToStringResponseDTO>(`${devolverProyecto()}/obtenerToStringEntidad/`, datos)
        .pipe(map((data: ObtenerToStringResponseDTO) => data));
    }
    downloadFile(user: User, datos: DownloadFileRequestDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post<BinarioDTO>(`${devolverProyecto()}/downloadFile/`, datos)
        .pipe(map((data: BinarioDTO) => data));
    }
    generarExcel(datos: TabularAbmRequestDTO) {
        return this.http.post(`${devolverProyecto()}/generarExcel/`, datos)
        .pipe(map(result => result));
    }

    obtenerPropiedadReportdef(dato: User, dataReportdef: ObtenerPropiedadDTO ) {

        dataReportdef.dataSource = dato.datasource;
        dataReportdef.username = dato.username;
        dataReportdef.webServicesAddress = dato.webservice;
        dataReportdef.modelPackage = dato.packageModel;
        dataReportdef.idUsuarioUra = dato.idUsuarioUra;
        return this.http.post(`${devolverProyecto()}/obtenerPropiedadVistaReportdef/`, dataReportdef)
        .pipe(map(result => result));
    }
    obtenerPropiedadFormTipoClase(dato: User, dataReportdef: ObtenerPropiedadDTO ) {

        dataReportdef.dataSource = dato.datasource;
        dataReportdef.username = dato.username;
        dataReportdef.webServicesAddress = dato.webservice;
        dataReportdef.modelPackage = dato.packageModel;
        dataReportdef.idUsuarioUra = dato.idUsuarioUra;
        return this.http.post(`${devolverProyecto()}/obtenerPropiedadFormClase/`, dataReportdef)
        .pipe(map(result => result));
    }


    consultarParamHijosAbm(user: User, datos: ObtenerParametrosHijo) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post<DataHijoDTO>(`${devolverProyecto()}/obtenerParamsHijo/`, datos)
        .pipe(map((data: DataHijoDTO) => data));
    }
    consultarParametroByClase(user: User, datos: ParamRequestDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post<FormdataReportdef>(`${devolverProyecto()}/consultarParametroByClase/`, datos)
        .pipe(map((data: FormdataReportdef) => data));
    }
    validateForm(user: User, datos: ParametrosExecuteMethodRequestDTO) {
        datos.username = user.username;
        datos.dataSource = user.datasource;
        datos.webServicesAddress = user.webservice;
        datos.modelPackage = user.packageModel;
        datos.idUsuarioUra = user.idUsuarioUra;
        return this.http.post(`${devolverProyecto()}/validateForm/`, datos)
        .pipe(map(result => result));
    }
    getMethodByEtiqueta(dato: User, requestDto: ObtenerMetodoRequestDto ) {

        requestDto.dataSource = dato.datasource;
        requestDto.username = dato.username;
        requestDto.webServicesAddress = dato.webservice;
        requestDto.modelPackage = dato.packageModel;
        requestDto.idUsuarioUra = dato.idUsuarioUra;
        return this.http.post<MetodoDTO>(`${devolverProyecto()}/obtenerMetodoPorEtiqueta/`, requestDto)
        .pipe(map(result => result));
    }
    configFormByUser(user: User, usuConfigForms: usuConfigForm[]): Observable<any> {
        let ucfDTO = {} as usuConfigFormDTO
        ucfDTO.username = user.username;
        ucfDTO.dataSource = user.datasource;
        ucfDTO.webservice = user.webservice;
        ucfDTO.packageModel = user.packageModel;
        ucfDTO.idUsuarioUra = user.idUsuarioUra;
        ucfDTO.configsFormsByUser = usuConfigForms;
        return this.http.post(`${devolverProyecto()}/configurarFormByUser/`,ucfDTO).pipe(map(result => result));
    }

}
