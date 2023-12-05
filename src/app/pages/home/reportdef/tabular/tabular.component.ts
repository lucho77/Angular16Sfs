import {
  Component, ViewEncapsulation, OnInit, Input, OnDestroy, Output,
  EventEmitter, OnChanges, HostListener, ViewChild, ElementRef
} from '@angular/core';
import { Tabular } from '../../../../_models/tabular';
import { ConfirmationDialogService } from 'src/app/pages/confirmDialog/confirmDialog.service';
import { AbmService } from 'src/app/_services/abmService';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FinderParamsDTO } from '../../../../_models/finderParamsDTO';
import { FormdataReportdef } from '../../../../_models/formdata';
import { FrontEndConstants } from 'src/app/constans/frontEndConstants';
import { GenericFinderService } from '../../../genericFinder/genericFinder.service';
import { TabularAbmRequestDTO } from '../../../../_models/TabularAbmRequestDTO';
import { inicializarFinder } from 'src/app/pages/genericFinder/utilFinder';
import { HeaderDTO } from '../../../../_models/headerDTO';
import { Pagination } from 'src/app/_models/pagination';
import { ReportdefService } from '../../../../_services/reportdef.service';
import { ParamRequestDTO } from '../../../../_models/paramRequestDTO';
import { DownloadFileRequestDTO } from '../../../../_models/downloadFileRequestdto';
import { saveAs } from 'file-saver';
import { NameGlobalService } from '../../../../_services/nameGlobalService';
import { ObtenerToStringRequestDTO } from 'src/app/_models/obtenerToStringEntidad';
import { ParamAllRequestDTO } from '../../../../_models/paramAllRequestDTO';
import { NameParamDTO } from 'src/app/_models/nameParamDTO';
import { DescripcionEntidadDTO } from '../../../../_models/nameParamRequestDTO';
import { Subscription } from 'rxjs';
import { DescriptionService } from '../../../../_services/descriptionService';
import { AvisaSeteoService } from 'src/app/_services/avisaSeteoService';
import { DomSanitizer } from '@angular/platform-browser';
import { AccionColumna } from '../../../../_models/accionColumna';
import { PreMethodDTO } from '../../../../_models/preMethodDTO';
import { crearParametro, ejecutarMetodo, seteoParamGlobal } from 'src/app/util/reportdefUtil';
import { ToastrService } from 'ngx-toastr';
import { isMobile, isTablet } from 'mobile-device-detect';

@Component({
  selector: 'app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabularComponent implements OnInit, OnChanges {
  @Input('tabular') tabular: Tabular;
  @Input('header') header: HeaderDTO[];
  @Input('data') data: any;
  @Input('reporte') reporte: string;
  @Input('vista') vista: string;
  @Input('menu') menu: boolean;
  @Input('tabularABM') tabularABM: boolean;
  @Input('listRequest') listRequest: FormdataReportdef[];
  @Output() refresh = new EventEmitter<any>();
  @Output() backHistory = new EventEmitter<any>();
  @Output() acciones = new EventEmitter<any>();
  @Output() generarExcel = new EventEmitter<any>();
  @Output() editaABM = new EventEmitter<any>();
  @Input('pagination') pagination: Pagination;
  @HostListener('scroll', ['$event'])
  @ViewChild('dataContainer') dataContainer: ElementRef;
  @ViewChild('dataContainerMobile') dataContainerMobile: ElementRef;

  estaActivo = false;
  mostrarFiltro = false;
  muestroRombo = false;
  sinpaginar: boolean;
  contadorFiltro = 0;
  texto_filtro = 'Mostrar Filtros';
  tituloReporte: string;
  idSeleccionado: any;
  filtros = false;
  mensajes = false;
  mensajeAmpliado = '';
  altoVentana = 0;
  anchoVentana = 0;
  es_firefox = false;
  private nameRef: Subscription = null;
  menovillan: any;
  descripcion = false;
  mobile: boolean = isMobile;
  tablet: boolean = screen.width > 600;
  loader: boolean = false;
  popup: boolean = false;


  mensaje = '';
  constructor(private confirmationDialogService: ConfirmationDialogService,
    private abmservice: AbmService, private router: Router, public toastrService: ToastrService
    , private genericFinderService: GenericFinderService,
    private reportdefService: ReportdefService, private nameService: NameGlobalService,
    private descriptionService: DescriptionService,
    private nameAvisoSeteo: AvisaSeteoService, private sanitizer: DomSanitizer) {
    // this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/c9F5kMUfFKk");
    // this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.laurl);
  }

  limpiaUrl(laurles) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(laurles);
  }
  abreelModal(url) {
    // tslint:disable-next-line:max-line-length
    window.open(url);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterContentInit() {
    const alturaAnchoVentana = this.tamVentana();
    this.anchoVentana = alturaAnchoVentana[0];
    this.altoVentana = alturaAnchoVentana[1];
    this.contadorFiltro = this.data.length;

    if (this.sinpaginar === true) {
      this.altoVentana = this.altoVentana * 1.5;
    } else {
      this.altoVentana = this.altoVentana * 1.3;
    }
    document.getElementById('table-cont').style.height = this.altoVentana.toString() + '!important';

  }

  traemeSiPaginar() {
    this.tabular.paginar = true;
    // Llamar a esto con lo que Lucho va hacer , es decir al metodo que retorna si esta variable es TRUE o FALSE;
    this.sinpaginar = !this.tabular.paginar;
    if (this.sinpaginar === true) {
      return true;
    } else {
      return false;
    }
  }
  ngOnInit() {
    this.sinpaginar = this.traemeSiPaginar();
    console.log('me voy a suscribir al description ');
    this.nameRef = this.descriptionService.descriptionChanged$.subscribe(() => {
      console.log('entro al service description');
      if (this.dataContainer) {
        this.dataContainer.nativeElement.innerHTML = this.descriptionService.getDescription();
      }
    });
    const $event = null;
    if (this.sinpaginar === true) {
      this.muestraCantidadPorPaginayPagina(1, $event);
    }
  }

  ngOnChanges(): void {
    this.idSeleccionado = null;
    this.obtenerClase(this.reporte);
    this.contadorFiltro = this.data.length;
    console.log('entro al onChange');
    if (this.sinpaginar === true) {

      const $event = null;
      if (this.sinpaginar === true) {
        this.muestraCantidadPorPaginayPagina(1, $event);
      }
    }
  }
  loaderBtn(index : number) {
    let id = new Number(index);
    let loader = document.getElementById('load'+id.toString()) as HTMLElement;
    let ver = document.getElementById('ver'+id.toString()) as HTMLElement;
    if (ver.style.display != 'none') {
      loader.setAttribute('style', 'display: inline-block;');
      ver.setAttribute('style', 'display: none;');
    }
  }
  setPopupfalse() {
    this.popup = false;
  }
  setearDescripcion(descrip) {

    let verAll = document.querySelectorAll('.ver')
    let loadAll = document.querySelectorAll('.load')
    if (this.mobile && !this.tablet) {
      this.dataContainerMobile.nativeElement.innerHTML = descrip;
      this.popup = true;
      verAll.forEach(element => {
        element as HTMLElement;
        element.setAttribute('style', 'display:  ;');
      });
      loadAll.forEach(element => {
        element as HTMLElement;
        element.setAttribute('style', 'display: none;');
      });

    } else {
      this.dataContainer.nativeElement.innerHTML = descrip;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.nameRef.unsubscribe();
    console.log('destruido el tabular');
  }
  // ----------------------------Metodos NEGRILLO
  desplazaScrollVertical($event: any) {
    const scrollTopYY = $event.target.scrollTop;
    document.getElementById('idTh1').style.transform = 'translateY(' + scrollTopYY + 'px)';
  }
  mostrarFiltros() {
    if (this.mostrarFiltro === true) {
      this.mostrarFiltro = false;
      this.texto_filtro = 'Mostrar Filtros';
    } else {
      this.mostrarFiltro = true;
      this.texto_filtro = 'Ocultar Filtros';
    }

  }

  // Sacar esto mañana cuando Lucho me Envie el Parametro sin pagina : boolean
  sinPaginar() {
    if (this.sinpaginar === true) {
      this.sinpaginar = false;
    } else {
      this.sinpaginar = true;
      const lcanti: number = this.contadorFiltro;
      this.muestraCantidadPorPaginayPaginaSinPaginacion(1, lcanti);
    }
  }
  mostrandoTodo(indexador) {
    const elementos = document.getElementsByClassName('cl-oculta-th');
    for (let i = 0; i < elementos.length; i++) {
      if (elementos[i].classList.contains('cl-oculta-th')) {
        if (i === indexador) {
          elementos[i].className = 'cl-oculta-th';
        } else {
          elementos[i].className = 'cl-muestra-th';
        }
      }
    }
  }

  mostrarxClase(elid, indexador) {

    this.mostrandoTodo(indexador);
    document.getElementById(elid).className = 'cl-oculta-th';
  }

  desapareceRombo($event) {
    const elemto = $event.target;
    const elementoActualIID = elemto.id;
    const elid = elementoActualIID.substring(7, elementoActualIID.length);
    const elementoActual = 'idnumim' + elid;

    this.mostrandoTodo(elid);
    document.getElementById(elementoActual).className = 'cl-oculta-th';
    const valorSi = this.pagination.sortReverse;

    if (valorSi === undefined || valorSi === false) {
      this.pagination.sortReverse = true;
    } else {
      this.pagination.sortReverse = false;
    }
  }

  muestraRombos($event) {

    let elid = '';
    const elemto = $event.target;
    let laprimecl = '';
    let elementoActual = '';

    if (elemto.className === 'cl-muestra-th') {
      const elementoActualIID = elemto.id;
      elementoActual = elementoActualIID;
    } else if (elemto.className === 'ng-star-inserted') {
      const elementoActualIID = elemto.id;
      elementoActual = elementoActualIID;
      elid = elementoActual.substring(7, elementoActual.length);
      elementoActual = 'idnumim' + elid;
    } else {
      const laclase = elemto.className;
      const cadelsp = laclase.split(' ');

      laprimecl = cadelsp[0];
      elid = laprimecl.substring(7, laprimecl.length);
      elementoActual = 'idnumim' + elid;
    }

    this.mostrarxClase(elementoActual, elid);
  }

  loadPage(page: number) {
    this.pagination.previousPage = page;
    const listaPagLoc: any = this.listaRangoPaginados(page, this.pagination.cantidadRegistrosxPagina);
    this.pagination.listaPaginacion = listaPagLoc;
  }
  private listaRangoPaginados(noPage: number, cantidad: number) {
    let arreNuevo: any[];
    let pivote = 0;
    pivote = cantidad * noPage;

    const posIni = pivote - cantidad;
    const posFin = pivote;
    const posIniLoc = ((noPage * cantidad) - cantidad) + 1;
    let posFinLoc = 0;
    pivote < this.tabular.data.length ? posFinLoc = pivote : posFinLoc = this.tabular.data.length;

    this.pagination.posIni = posIniLoc;
    this.pagination.posFin = posFinLoc;

    if (this.tabular.seleccionMultiple) {
      const intlise = this.pagination.listaSeleccionada.length;
      if (intlise <= 0 && this.estaActivo === false) {
        this.data.forEach(element => {
          element['chequeado'] = false;
        });
      }
    }

    arreNuevo = this.data.slice(posIni, posFin);
    return arreNuevo;
  }
  chequeaTodo(estaActivo) {
    estaActivo === false ? this.estaActivo = true : this.estaActivo = false;

    if (estaActivo === true) {
      this.data.forEach(element => {
        element['chequeado'] = false;
        this.chequeaFila(element, true);
      });
    } else if (estaActivo === false) {
      this.data.forEach(element => {
        element['chequeado'] = true;
        this.chequeaFila(element, true);
      });
    }
  }

  chequeaFila(event, todo: boolean) {
    let elvenChe = event.chequeado;
    if (!todo) {
      elvenChe = !elvenChe;
    }
    const filaActiva = event;
    // Comprobamos que el elemento exista en el arreglo de los seleccionados
    let indice = 0;
    indice = this.pagination.listaSeleccionada.indexOf(filaActiva);

    // Si es igual a -1 añado al arreglo en caso contrario no
    indice === -1 ? this.pagination.listaSeleccionada.push(filaActiva) : this.pagination.listaSeleccionada.splice(indice, 1);

    // Comprobamos que el elemento exista en el arreglo de listas los seleccionados
    let indiceFil = 0;
    indiceFil = this.data.indexOf(filaActiva);
    this.data[indiceFil]['chequeado'] = elvenChe;
  }

  buscaDentroTabla($event) {

    const texto = $event.target.value;
    let datatTEMP = [];
    let datatPersi = [];
    datatTEMP = this.data;

    const nombreColumnaBuscadoCol = localStorage.getItem('elembus');
    let resultadoIt = this.filterItems(datatTEMP, texto, nombreColumnaBuscadoCol);
    this.contadorFiltro = resultadoIt.length;

    datatPersi = this.data;
    this.data = resultadoIt;

    this.ordenaYaColumna(1, 1);
    this.data = datatPersi;
    resultadoIt = null;
    datatPersi = null;

  }
  filterItems(datatTEMP, texto, nombreColumnaBuscadoCol) {

    return datatTEMP.filter(function (el) {

      let valorVSel = el[nombreColumnaBuscadoCol];
      valorVSel == null ? valorVSel = '' : valorVSel = valorVSel;
      const valSelCOnv: string = valorVSel.toString();
      return valSelCOnv.toLowerCase().indexOf(texto.toLowerCase()) > -1;
    });
  }
  ordenarColumna($event, colName, ePage, tipoASDes, eltituloJson, io) {

    const arreFilUno = JSON.stringify(eltituloJson);
    const arreFilDosJson = JSON.parse(arreFilUno);

    const elemto = $event.target;

    let resultSi = [];
    // tslint:disable-next-line:forin
    for (const i in arreFilDosJson) {
      resultSi.push([i, arreFilDosJson[i]]);
    }

    const nombreColumnaBuscado = resultSi[io];
    resultSi = null;

    const nombreColumnaBuscadoCol = nombreColumnaBuscado[0];

    let elindesrclem = '';
    elindesrclem = $event.target.cellIndex;

    if (!elindesrclem) {
      elindesrclem = io;
    }

    /*En este paso ordeno el arreglo y le doy vuelta*/

    localStorage.setItem('elibus', elindesrclem);
    localStorage.setItem('elembus', nombreColumnaBuscadoCol);
    // const user = JSON.parse(localStorage.getItem('currentUser'));
    this.ordenaYaColumna(tipoASDes, ePage);
  }

  ordenaYaColumna(tipoASDes, ePage) {

    const nombreColumnaBuscadoCol = localStorage.getItem('elembus');
    //const resultOrder = this.order.transform(this.data, nombreColumnaBuscadoCol);
    const resultOrder = null;

    if (tipoASDes === true) {
      resultOrder.reverse();
    }

    /*Aca lo guardo en el arreglo original this.filas*/
    this.data = null;
    this.data = resultOrder;

    /*Inicio de Aca tengo el arreglo ordenado por la Columna Seleccionada*/

    let arreNuevo: any[];
    let pivote = 0;
    pivote = this.pagination.cantidadRegistrosxPagina * ePage;

    const posIni = pivote - this.pagination.cantidadRegistrosxPagina;
    const posFin = pivote;
    const posIniLoc = ((ePage * this.pagination.cantidadRegistrosxPagina) - this.pagination.cantidadRegistrosxPagina) + 1;
    let posFinLoc = 0;
    pivote < this.tabular.pageRows ? posFinLoc = pivote : posFinLoc = this.tabular.pageRows;

    this.pagination.posIni = posIniLoc;
    this.pagination.posFin = posFinLoc;
    arreNuevo = this.data.slice(posIni, posFin);
    this.pagination.listaPaginacion = arreNuevo;
  }

  buscarParamDestination(fila: any) {
    const objeto = { name: {} as ParamAllRequestDTO, all: [] };
    const nameParamArray = [];

    const paramsParts = this.tabular.destination.trim().split(',');
    let j = 0;
    for (const p of paramsParts) {
      const paramsPosition = p.trim().split(':');
      let param = '';
      if (j === 0) {
        param = paramsPosition[0].substring(7, paramsPosition[0].length);

      } else {
        param = paramsPosition[0];

      }
      const position = Number(paramsPosition[1]);
      let i = 0;
      let id = 0;
      // tslint:disable-next-line:foriclickLinkTabular
      // tslint:disable-next-line:forin
      for (const prop in fila) {
        if (i === position) {
          id = fila[prop];
          break;
        }
        i++;
      }
      nameParamArray.push({ 'name': param.trim(), 'id': id });
      j++;
    }

    const paramRequest = {} as ParamAllRequestDTO;
    paramRequest.list = [];

    for (const p of nameParamArray) {
      const paramName = {} as NameParamDTO;
      paramName.name = p.name;
      paramRequest.list.push(paramName);
    }
    objeto.name = paramRequest;
    objeto.all = nameParamArray;
    return objeto;

  }
  private obtenerDescripcionTabular(method: string, fila) {
    const pos = method.indexOf('(');
    const m = method.substring(7, pos);
    // por ahora funciona con un parametro de tipò this que seria la entidad del tabular
    const param = method.substring(pos + 1, (method.length - 1));
    if (param.toUpperCase() === 'THIS') {
      console.log();
      let posTbular = this.tabular.pkColIndex;
      console.log('posTbular');
      console.log(posTbular);
      console.log('fila');
      console.log(fila);
      let i = 0;
      let id = 0;
      if (!this.tabularABM && !posTbular) {
        posTbular = 0;
      }
      // tslint:disable-next-line:forin
      for (const prop in fila) {
        if (i === posTbular) {
          id = fila[prop];
          break;
        }
        i++;
      }
      const listParametros = [];
      // tslint:disable-next-line:no-shadowed-variable
      const param = crearParametro('P_ID', FrontEndConstants.JAVA_LANG_LONG, id);
      listParametros.push(param);
      ejecutarMetodo(m, false, listParametros, this.reportdefService).then(
        (resp) => {
          this.setearDescripcion(resp.valor)
          this.mensaje = resp.valor;
        }

      ).catch(error =>
        this.checkError(error)
      );

    } else {
      // no es un this y lo debo sacar de los parametros

      const paramRequest: ParamAllRequestDTO = this.buscarParamDestination(fila).name;

      const nameParamArray = this.buscarParamDestination(fila).all;
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const listDestination: FormdataReportdef[] = [];

      this.reportdefService.consultarAllParamByName(user, paramRequest).subscribe(
        result => {
          for (const f of result) {
            for (const p of nameParamArray) {
              if (p.name === f.name) {
                f.valueNew = p.id;
                listDestination.push(f);
                break;
              }
            }
          }
          ejecutarMetodo(m, false, listDestination, this.reportdefService).then(
            (resp) => {
              this.setearDescripcion(resp.valor)
              this.mensaje = resp.valor;
            }

          ).catch(error =>
            this.checkError(error)
          );


        }, (err: HttpErrorResponse) => {
          this.checkError(err);
        });




    }
  }
  quitarSombraFila() {

    const lementoRes = document.querySelectorAll('tr.cl-filsese');
    const lementoRTDs = document.querySelectorAll('#table-cont tr.cl-filsese td');

    for (let i = 0; i < lementoRes.length; i++) {
      const elementoes = <HTMLElement>lementoRes[i];
      elementoes.style.backgroundColor = '';
    }

    for (let j = 0; j < lementoRTDs.length; j++) {
      const elementoestd = <HTMLElement>lementoRTDs[j];
      elementoestd.style.backgroundColor = '';
    }

  }
  clickFilaTabular($event) {
    this.quitarSombraFila();
    const elementoes = $event.target.parentNode;
    elementoes.style = 'background-color:rgb(255, 232, 162)';
  }
  clickFilaTabular2($event, fil) {
    this.quitarSombraFila();
    const elementoes = $event.target.parentNode;
    elementoes.style = 'background-color:rgb(255, 232, 162)';
    if (this.tabular.duplicarRegistro) {
      const pos = this.tabular.pkColIndex;
      let i = 0;
      // tslint:disable-next-line:forin
      for (const prop in fil) {
        if (i === pos) {
          this.idSeleccionado = fil[prop];
          break;
        }
        i++;
      }

    }


  }

  mostrarDetalle(fila) {
    this.descripcion = true;
    if (this.tabular.tabularDescriptivo) {
      console.log('this.tabular.tabularDescriptivo');
      if (this.tabular.campoDescriptivo.includes('METHOD')) {
        this.obtenerDescripcionTabular(this.tabular.campoDescriptivo, fila);

      } else {
        const des = fila[this.tabular.campoDescriptivo];
        this.setearDescripcion(des)
        this.mensaje = des;
      }
    }
  }


  clickLinkTabularMobile($event, col, fila) {
    if (col.linkDina) {
      alert('es una columna link dinamica');
      return;
    }

    let nameParamArray = [];
    if (this.tabular.tabularDescriptivo) {
      console.log('this.tabular.tabularDescriptivo');
      if (this.tabular.campoDescriptivo.includes('METHOD')) {
        this.obtenerDescripcionTabular(this.tabular.campoDescriptivo, fila);

      } else {
        const des = fila[this.tabular.campoDescriptivo];
        this.setearDescripcion(des);
      }
    }
    if (!col['columnaAdicional'] && !col['link']) {
      return;
    }

    const listDestination: FormdataReportdef[] = [];

    if (this.tabular.destination !== null && this.tabular.destination !== undefined) {
      // tengo que buscar el parametro
      const paramRequest: ParamAllRequestDTO = this.buscarParamDestination(fila).name;
      console.log('paramRequest');
      console.log(paramRequest);
      const user = JSON.parse(localStorage.getItem('currentUser'));
      this.reportdefService.consultarAllParamByName(user, paramRequest).subscribe(
        result => {
          nameParamArray = this.buscarParamDestination(fila).all;

          for (const f of result) {
            for (const p of nameParamArray) {
              if (p.name === f.name) {
                f.valueNew = p.id;
                listDestination.push(f);
                break;
              }
            }
          }
          this.generarDatosClickTabularColumna(col, listDestination);
        }, (err: HttpErrorResponse) => {
          this.checkError(err);
        }
      );
    }
    for (const columna of this.tabular.accionesColumna) {
      if (columna.columna === col['title']) {
        if (col['columnaAdicional']) {
          // tengo que pasar el id de la columna!
          const pos = this.tabular.pkColIndex;
          let i = 0;
          let id = 0;
          // tslint:disable-next-line:forin
          for (const prop in fila) {
            if (i === pos) {
              id = fila[prop];
              break;
            }
            i++;
          }

          this.llenarParametrosClickLinkTabular(columna, id).then(
            (resp) =>
              this.acciones.emit(columna.metadata)
          ).catch(error =>
            this.checkError(error)
          );
        }
      }

    }

  }
  clickLinkTabular($event, col, fila) {


    if (col.linkDina) {
      alert('es una columna link dinamica');
      return;
    }
    this.quitarSombraFila();
    const elementoesHijo = $event.target;
    const elementoesPadre = elementoesHijo.parentNode;
    elementoesPadre.style = 'background-color:rgb(255, 232, 162)';

    // tslint:disable-next-line:prefer-const
    let nameParamArray = [];
    if (this.tabular.tabularDescriptivo) {
      console.log('this.tabular.tabularDescriptivo');
      if (this.tabular.campoDescriptivo.includes('METHOD')) {
        this.obtenerDescripcionTabular(this.tabular.campoDescriptivo, fila);

      } else {
        const des = fila[this.tabular.campoDescriptivo];
        this.setearDescripcion(des)
      }
    }
    if (!col['columnaAdicional'] && !col['link']) {
      return;
    }

    const listDestination: FormdataReportdef[] = [];

    if (this.tabular.destination !== null && this.tabular.destination !== undefined) {
      // tengo que buscar el parametro
      const paramRequest: ParamAllRequestDTO = this.buscarParamDestination(fila).name;
      console.log('paramRequest');
      console.log(paramRequest);
      const user = JSON.parse(localStorage.getItem('currentUser'));
      this.reportdefService.consultarAllParamByName(user, paramRequest).subscribe(
        result => {
          nameParamArray = this.buscarParamDestination(fila).all;

          for (const f of result) {
            for (const p of nameParamArray) {
              if (p.name === f.name) {
                f.valueNew = p.id;
                listDestination.push(f);
                break;
              }
            }
          }
          this.generarDatosClickTabularColumna(col, listDestination);
        }, (err: HttpErrorResponse) => {
          this.checkError(err);
        }
      );
    }
    for (const columna of this.tabular.accionesColumna) {
      if (columna.columna === col['title']) {
        if (col['columnaAdicional']) {
          // tengo que pasar el id de la columna!
          const pos = this.tabular.pkColIndex;
          let i = 0;
          let id = 0;
          // tslint:disable-next-line:forin
          for (const prop in fila) {
            if (i === pos) {
              id = fila[prop];
              break;
            }
            i++;
          }

          this.llenarParametrosClickLinkTabular(columna, id).then(
            (resp) =>
              this.acciones.emit(columna.metadata)
          ).catch(error =>
            this.checkError(error)
          );
        }
      }

    }

  }


  llenarParametrosClickLinkTabular(columna: AccionColumna, id: number): Promise<boolean> {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise<boolean>((resolve, reject) => {
      let i = 0;
      const keys = Array.from(Object.keys(columna.metadata.paramsPasar));
      const paramClick = [] as FormdataReportdef[];
      for (const clave of Object.keys(columna.metadata.paramsPasar)) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const paramRequest = {} as ParamRequestDTO;
        paramRequest.nombre = clave.trim();
        this.reportdefService.consultarParamByName(user, paramRequest).subscribe(
          result => {
            i++;
            if (this.tabularABM && (columna.metadata.paramSolapa === clave || keys.length === 1)) {
              result['valueNew'] = id;
            } else {
              result.actualizar = true;
            }
            console.log('result');
            console.log(result);
            if (keys.length === 1) {
              columna.metadata.objeto = result;
            } else {
              paramClick.push(result);
            }
            columna.metadata.aditionalColumn = true;
            columna.metadata.clickFilaTabular = false;
            columna.metadata.tipoReportdefParent = FrontEndConstants.TABULAR_ABM.toUpperCase();
            if (columna.metadata.tipoMetodo === FrontEndConstants.ACCION_MENSAJE) {
              const listParam = [];
              listParam.push(result);
              ejecutarMetodo(columna.metadata.methodName, false, listParam, this.reportdefService)
                .then((resp) => {
                  console.log(resp);
                  this.mensajes = true;
                  this.mensajeAmpliado = resp.valor;
                  resolve(true);
                  return;
                }
                ).catch(error =>
                  reject(error)

                );
            }
            console.log(keys.length);
            if (i === keys.length) {
              columna.metadata.objetoEvento = paramClick;
              console.log('termino la promesa');
              resolve(true);
            }
          }, (err: HttpErrorResponse) => {
            reject(err);
          }
        );
      }
      // solo 1 parametro
    });
  }
  ejecutarPremethod(premethod: PreMethodDTO, listDestination: FormdataReportdef[]) {
    return new Promise<void>(resolve => {
      const list = [];
      for (const p of premethod.params) {
        for (const p1 of listDestination) {
          if (p1.name === p) {
            list.push(p1);
          }
        }
      }
      ejecutarMetodo(premethod.metodo, false, list, this.reportdefService).then(
        (resp) =>
          resolve()
      ).catch(error =>
        console.log(error)
      );
    });
  }
  async generarDatosClickTabularColumna(col: any, listDestination: FormdataReportdef[]) {


    const listDestino: FormdataReportdef[] = [];
    for (const columna of this.tabular.accionesColumna) {
      if (columna.columna === col['title']) {
        columna.metadata.objetoEvento = listDestination;
        columna.metadata.clickFilaTabular = true;
        columna.metadata.aditionalColumn = false;

        if (columna.metadata.tipoMetodo === FrontEndConstants.SET_PARAM_GLOBAL) {
          // tengo que ver cual es el parametro que tengo que actualizar
          for (const clave of Object.keys(columna.metadata.paramsPasar)) {
            for (const f of listDestination) {
              if (clave.toString().trim() === f.name.trim()) {
                listDestino.push(f);
                break;
              }
            }
          }
          if (columna.metadata.preMethodDTO !== null && columna.metadata.preMethodDTO.metodo !== null) {
            await this.ejecutarPremethod(columna.metadata.preMethodDTO, listDestination);
          }


          // es un seteo de parametros tengo que hacer un par de cosillas
          const user = JSON.parse(localStorage.getItem('currentUser'));
          const obtenerToStringRequest = {} as ObtenerToStringRequestDTO;
          obtenerToStringRequest.listId = [];
          for (const p of listDestino) {
            if (!p.entity) {
              continue;
            }
            const descEntidad = {} as DescripcionEntidadDTO;
            descEntidad.name = p.type;
            descEntidad.id = p.valueNew;
            obtenerToStringRequest.listId.push(descEntidad);
          }
          console.log('obtenerToStringRequest');
          console.log(obtenerToStringRequest);

          this.reportdefService.consultarToStringEntidad(user, obtenerToStringRequest).subscribe(
            result => {
              console.log(result);
              for (const p of listDestino) {
                for (const p1 of result.listToString) {
                  if (p.type === p1.name) {
                    p.busquedaGenericaDTO.mostrarToStringLupa = p1.value;
                    break;
                  }
                }
              }
              console.log('columna.metadata');
              console.log(columna.metadata);
              seteoParamGlobal(columna.metadata, this.reportdefService, this.nameService, null, true, listDestino).then(
                (resp) =>
                  this.exitoSetParamGlobal()
              ).catch(error =>
                this.checkError(error)
              );
            }, (err: HttpErrorResponse) => {
              this.checkError(err);
            }
          );
        }
      } else {
        continue;

      }
      columna.metadata.objetoEvento = listDestination;
      this.acciones.emit(columna.metadata);
    }

  }
  exitoSetParamGlobal() {
    this.toastrService.success('parametro global seteado exitosamente');
  }

  // Metodo para mostrar la cantidad de filas por página  en el Mostrar del Select desplegable
  muestraCantidadPorPaginayPagina(noPage, $event) {
    let noRegistrosLoc = 0; // $event.target.value;
    if ($event == null) {
      noRegistrosLoc = this.contadorFiltro;
    } else {
      noRegistrosLoc = $event.target.value;
    }

    const listaPagLoc: any = this.listaRangoPaginados(noPage, noRegistrosLoc);
    this.pagination.listaPaginacion = listaPagLoc;
    this.pagination.cantidadRegistrosxPagina = noRegistrosLoc;
    this.pagination.page = noPage;
  }

  // Metodo para mostrar la cantidad de filas por página  Cuando no tiene paginación
  muestraCantidadPorPaginayPaginaSinPaginacion(noPage, pcantidad) {
    const noRegistrosLoc: number = pcantidad;
    const listaPagLoc: any = this.listaRangoPaginados(noPage, noRegistrosLoc);
    this.pagination.listaPaginacion = listaPagLoc;
    this.pagination.cantidadRegistrosxPagina = noRegistrosLoc;
    this.pagination.page = noPage;
  }

  downloadFile(col: any, fila: any) {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    const downloadFileRequestDTO = {} as DownloadFileRequestDTO;
    downloadFileRequestDTO.reporte = this.reporte;
    downloadFileRequestDTO.vista = this.tabular.vista;
    downloadFileRequestDTO.headerlinkColumn = col.title;
    const pos = this.tabular.pkColIndex;
    let i = 0;
    let id = 0;
    // tslint:disable-next-line:forin
    for (const prop in fila) {
      if (i === pos) {
        id = fila[prop];
        break;
      }
      i++;
    }
    downloadFileRequestDTO.idReporte = id;
    downloadFileRequestDTO.tabularABM = this.tabularABM;
    this.reportdefService.downloadFile(user, downloadFileRequestDTO).subscribe(
      result => {
        let name = '';
        if (!result.fmt) {
          window.open('/SFS2FwWsServerWEB/FwWsFileServlet?P_FILE_NAME=' + result.nameArch + '&P_FILE_CTYPE=jpg');
          return;
        } else {
          name = downloadFileRequestDTO.reporte + '--ID-- ' + downloadFileRequestDTO.idReporte + '.fmt';
        }
        const b = this.convertDataURItoFile(result.bytes,
          name, result.fmt);
        saveAs(b, name);
      }, (err: HttpErrorResponse) => {
        this.checkError(err);
      });
  }

  b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
  }

  bin2String(array) {
    let result = '';
    for (let i = 0; i < array.length; i++) {
      result += String.fromCharCode(parseInt(array[i], 16));
    }
    return result;
  }

  string2Bin(str) {
    const result = [];
    for (let i = 0; i < str.length; i++) {
      result.push(str.charCodeAt(i).toString(16));
    }
    return result;
  }

  private convertDataURItoFile(data: string, fileName: string, fmt: boolean) {
    const datoDeco = this.b64_to_utf8(data);
    const binario: any[] = this.string2Bin(datoDeco);
    const vitstr = this.bin2String(binario);

    let blob = null;
    if (fmt) {
      blob = new Blob([vitstr], { type: 'text/html;charset=IBM850' });
    }
    return blob;
  }

  // ----------------------------FIN Metodos NEGRILLO

  tamVentana() {
    let tam = [0, 0];
    if (typeof window.innerWidth !== 'undefined') {
      tam = [window.innerWidth, window.innerHeight];
    } else if (typeof document.documentElement !== 'undefined'
      && typeof document.documentElement.clientWidth !==
      'undefined' && document.documentElement.clientWidth !== 0) {
      tam = [
        document.documentElement.clientWidth,
        document.documentElement.clientHeight
      ];
    } else {
      tam = [
        document.getElementsByTagName('body')[0].clientWidth,
        document.getElementsByTagName('body')[0].clientHeight
      ];
    }
    return tam;
  }
  onEdit(event) {
    const pos = this.tabular.pkColIndex;
    let i = 0;
    let id = 0;
    // tslint:disable-next-line:forin
    for (const prop in event) {
      if (i === pos) {
        id = event[prop];
        break;
      }
      i++;
    }
    let idOwner = null;
    i = 0;
    i = 0;
    if (this.tabular.onlyOwner) {
      const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
      for (const p of formdataGlobales) {
        if (p.name === this.tabular.onlyOwnerParamGlobal && p.value !== null) {
          idOwner = p.value;
          break;
        }
      }
    }
    // this.tabular.onlyOwner, this.tabular.onlyOwnerDay, this.tabular.onlyOwnerField, this.tabular.onlOwnerDayField
    const data = {
      alta: false, id: id, reporte: this.reporte, vista: this.tabular.vista,
      onlyOwner: this.tabular.onlyOwner, idOwner: idOwner, onlyOwnerDay: this.tabular.onlyOwnerDay,
      onlyOwnerField: this.tabular.onlyOwnerField, onlyOwnerDayField: this.tabular.onlOwnerDayField
    };
    this.editaABM.emit(data);
  }

  private obtenerClase(reporte: string) {
    const labelArray = reporte.split('.');
    let clase = '';
    // tslint:disable-next-line:forin
    for (const j in labelArray) {
      clase = labelArray[j];
    }

    if (this.tabularABM) {
      if (this.tabular.etiqueta) {
        this.tituloReporte = this.tabular.etiqueta;

      } else {
        this.tituloReporte = 'ABM de ' + clase;

      }
    } else {
      if (this.tabular.etiqueta) {
        this.tituloReporte = this.tabular.etiqueta;

      } else {
        this.tituloReporte = 'Tabular ' + clase;

      }
    }
  }

  onDelete(event) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const pos = this.tabular.pkColIndex;
    let i = 0;
    let id = 0;
    // tslint:disable-next-line:forin
    for (const prop in event) {
      if (i === pos) {
        id = event[prop];
        break;
      }
      i++;
    }
    let idOwner = null;
    i = 0;
    if (this.tabular.onlyOwner) {
      const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
      for (const p of formdataGlobales) {
        if (p.name === this.tabular.onlyOwnerParamGlobal && p.value !== null) {
          idOwner = p.value;
          break;
        }
      }
    }
    this.confirmationDialogService.confirm(true, 'Esta seguro de eliminar este registro?',
      'Eliminacion Registro')
      .then((confirmed) => {
        if (confirmed) {
          this.abmservice.eliminarEntidad(user, this.reporte, id, idOwner,
            this.tabular.onlyOwner, this.tabular.onlyOwnerDay, this.tabular.onlyOwnerField, this.tabular.onlOwnerDayField).subscribe(
              result => {

                this.toastrService.success(' registro eliminado exitosamente');
                this.refresh.emit('refresh');

              }, (err: HttpErrorResponse) => {

                this.checkError(err);
              }

            );
        }

      }).catch(() => console.log('salio)'));

  }

  exportExcel(event) {
    this.generarExcel.emit(event);
  }
  refrescar(event) {
    this.refresh.emit('refresh');
  }

  exportGrafico($event) {
    // this.graficosComponent.open($event);
  }

  exportPDF(event) {
    let unSoloRegistro = false;
    // exporta a pdf el this.abmservice;
    const user = JSON.parse(localStorage.getItem('currentUser'));
    let hArchivo = '';
    let filename = '';
    // this.refresh.emit('pdf');
    const finder = {} as FinderParamsDTO;
    inicializarFinder(finder);
    finder.methodName = 'buscarPdfUsuario';
    finder.typeMethodFinder = true;

    const paramUser = {} as FormdataReportdef;
    paramUser.name = 'P_STRINGUSUARIO';
    paramUser.value = user.username;
    paramUser.valueNew = user.username;
    paramUser.entity = false;
    paramUser.text = true;
    paramUser.busquedaGenerica = false;
    paramUser.type = FrontEndConstants.JAVA_LANG_STRING;

    const paramReporte = {} as FormdataReportdef;
    paramReporte.name = 'P_REPORTE';
    paramReporte.value = this.reporte;
    paramReporte.valueNew = this.reporte;
    paramReporte.entity = false;
    paramReporte.text = true;
    paramReporte.busquedaGenerica = false;
    paramReporte.type = FrontEndConstants.JAVA_LANG_STRING;

    finder.finderGenericDTO.parametrosFinderMetodo.push(paramUser);
    finder.finderGenericDTO.parametrosFinderMetodo.push(paramReporte);

    this.abmservice.consultarAbmGeneric(user, finder).subscribe(
      result => {
        if ((result['data'] && result['data'].length === 0) || result['headerArchivo'] === undefined) {
          this.toastrService.error('no hay FMT definidos para este ABM');
          return;
        } else if (result['data'] && result['data'].length === 1) {
          unSoloRegistro = true;
          // si hay un solo registro no hay que llamar a la busqueda generica
          for (let j = 0; j < result['columns'].length; j++) {
            if (result['columns'][j].name === result['headerArchivo']) {
              hArchivo = result['data'][0][j].value;
              break;
            }
            filename = result['data'][0][FrontEndConstants.UBICACION_COLUMNA_NOMBRE_ARCHIVO_FMT].value;
          }

          const pdfRequest = {} as TabularAbmRequestDTO;
          this.inicializarTabularRequestPDF(pdfRequest, hArchivo, filename, this.vista);
          this.abmservice.generarPDFABM(user, pdfRequest).subscribe(
            pdf => {
              window.open('/SFS2FwWsServerWEB/FwWsFileServlet?P_FILE_NAME=' + pdf['filename'] + '&P_FILE_CTYPE=pdf');
            }, (err: HttpErrorResponse) => {

              this.checkError(err);

            });

        }
        if (!unSoloRegistro) {

          this.genericFinderService.confirm('Seleccionar fuente de Impresion ',
            result, result['columns'], null, null, null, null, false, '')
            .then((fila) => {

              let i = 0;
              // tslint:disable-next-line:forin
              for (const prop in fila) {
                if (i === FrontEndConstants.UBICACION_COLUMNA_NOMBRE_ARCHIVO_FMT) {
                  filename = fila[prop];
                }
                if (prop === result['headerArchivo']) {
                  hArchivo = fila[prop];
                }
                i++;
              }
              const pdfRequest = {} as TabularAbmRequestDTO;
              this.inicializarTabularRequestPDF(pdfRequest, hArchivo, filename, this.vista);
              this.abmservice.generarPDFABM(user, pdfRequest).subscribe(
                pdf => {
                  window.open('/SFS2FwWsServerWEB/FwWsFileServlet?P_FILE_NAME=' + pdf['filename'] + '&P_FILE_CTYPE=pdf');
                }, (err: HttpErrorResponse) => {

                  this.checkError(err);

                });

            }).catch(() => console.log('salio)'));
        }

      }, (err: HttpErrorResponse) => {

        this.checkError(err);
      });

  }

  private inicializarTabularRequestPDF(requestPDF: TabularAbmRequestDTO, reporte: string, filename: string, vista: string) {
    const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));

    requestPDF.dataSource = '';
    requestPDF.username = '';
    requestPDF.webServicesAddress = '';
    requestPDF.modelPackage = '';
    requestPDF.reportdef = reporte;
    requestPDF.filename = filename;
    requestPDF.vista = vista;
    requestPDF.desde = 0;
    requestPDF.hasta = 100;
    requestPDF.valueFinder = null;
    requestPDF.campoFinder = null;
    requestPDF.list = [];
    requestPDF.global = formdataGlobales;
    requestPDF.filterNameParam = null;
    requestPDF.filterType = null;
  }

  private checkError(error: any) {
    console.log('mando el error derecho y fue');
    console.log(error);
    this.toastrService.error(error.mensaje);
  }
  backHistorico() {
    this.backHistory.emit(event);
  }
  verFiltros() {
    this.filtros = true;
  }
  nuevoAbm() {

    this.loader = true;
    const data = { alta: true, id: this.idSeleccionado, reporte: this.reporte, vista: this.tabular.vista };
    // debo ver si hay algun agregarsi
    console.log('this.tabular.agregarSi');
    console.log(this.tabular.agregarSi);
    if (this.tabular.agregarSi) {
      // por ahora solo con parametros globales
      // ejemplo verificarAfiliado(P_IDAFILIADO)
      const formdataGlobales = <FormdataReportdef[]>JSON.parse(localStorage.getItem('paramGlobal'));
      const pos = this.tabular.agregarSi.indexOf('(');
      const methodName = this.tabular.agregarSi.substring(0, pos);
      const param = this.tabular.agregarSi.substring((pos + 1), (this.tabular.agregarSi.length - 1));
      const parametros = param.split(',');
      console.log(methodName);
      console.log(parametros);
      const listAux = [];
      for (const p of parametros) {
        for (const g of formdataGlobales) {
          if (p.trim() === g.name.trim()) {
            listAux.push(g);
            break;
          }
        }

      }
      ejecutarMetodo(methodName, false, listAux, this.reportdefService).then(
        (resp) =>
          this.editaABM.emit(data)
      ).catch(error =>
        this.checkError(error)
      );
    } else {
      this.editaABM.emit(data);

    }
  }

  onRowSelect(event) {
    // determino a que columna le hago click esto sirve para cuando hgacemos nuevo muestre los datos de la fila
    console.log(event);
    const pos = this.tabular.pkColIndex;
    let i = 0;
    // tslint:disable-next-line:forin
    for (const prop in event.data) {
      if (i === pos) {
        this.idSeleccionado = event.data[prop];
        break;
      }
      i++;
    }
  }

  processActions(event: FormdataReportdef) {
    if (event.buttomDTO.metodoDTO.seleccionMultiple) {
      // si la accion es una seleccion multiple
      // debo traer los id de la seleccion
      if (this.pagination.listaSeleccionada.length === 0) {
        this.toastrService.error('debe seleccionar al menos un registro de la grilla');
        return;
      } else {
        // debo poner la lista en algun lugar de la lista
        const ps = [];
        const pos = this.tabular.pkColIndex ? this.tabular.pkColIndex : 0;
        let i = 0;
        // tslint:disable-next-line:forin
        for (const prop of this.pagination.listaSeleccionada) {
          i = 0;
          // tslint:disable-next-line:forin
          for (const p in prop) {
            if (i === pos) {
              ps.push(prop[p]);
              break;
            } else {
              i++;
            }
          }
        }
        event.buttomDTO.metodoDTO.objeto = ps;
      }
    }
    this.acciones.emit(event.buttomDTO.metodoDTO);
  }
  getCantidad() {
    let can = this.pagination.cantColVis;
    const ancho = 100 / can;
    can = null;
    return ancho + '%';
  }
}
