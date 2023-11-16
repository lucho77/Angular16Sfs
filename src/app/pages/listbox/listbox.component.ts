
import { Component, Input, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FinderParamsDTO } from '../../_models/finderParamsDTO';
import { FinderGenericDTO } from 'src/app/_models/finderGenericDTO';
import { FrontEndConstants } from 'src/app/constans/frontEndConstants';
import { AbmService } from 'src/app/_services/abmService';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AvisaSeteoService } from 'src/app/_services/avisaSeteoService';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from 'src/app/_models/pagination';
import { isMobile } from 'mobile-device-detect';
import { getData } from '../genericFinder/utilFinder';

@Component({
  selector: 'app-listbox',
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.component.scss']
})
export class ListboxComponent {
  @Input() title: string;
  @Input('data') data: any;
  @Input('column') column: any;
  @Input('finder') finder: FinderParamsDTO;
  @Input('comboFinder') comboFinder: FinderGenericDTO;
  @Input('settings') settings: any;
  @Input('entidad') entidad: string;
  @Input('vista') vista: string;
  @Input('value') value: string;
  @Input('findByEqual') findByEqual: boolean;
  @ViewChild('find') find: ElementRef;
  dataSeleccionada: any;
  mobile: boolean = isMobile;
  tablet: boolean = screen.width > 600;
  finderTabular = {
    busqueda: '',
    campoBusqueda: null,
    modoMetodo: false
  };
  lastClickTime = 0;
  rowSelected: any;
  constructor(private activeModal: NgbActiveModal, private avisaSeteo: AvisaSeteoService,
    private abmservice: AbmService, public toastrService: ToastrService, private router: Router
    ) { }

  ngOnInit() {
    this.finderTabular.modoMetodo = this.finder.typeMethodFinder;
    if (this.comboFinder) {
      this.finderTabular.campoBusqueda = this.comboFinder[0];
    }
    if (this.value) {
      this.finderTabular.busqueda = this.value;
    }
    }
    onRowSelect(event) {

      console.log('this.lastClickTime');
      console.log(this.lastClickTime);
      if (this.lastClickTime === 0) {
        this.lastClickTime = new Date().getTime();
       this.dataSeleccionada = event;
      //  this.buscarSeleccionado(event.data);
      } else {
  
          const change = (new Date().getTime()) - this.lastClickTime;
          console.log('change');
          console.log(change);
  
        if (change < 20000) {
          console.log(event);
  
         this.onDoubleClick(event);
  
        } else {
          this.lastClickTime = 0;
        }
      }
  }

  onDoubleClick(data) {
    // this.buscarSeleccionado(data);
    console.log('Ha dado Dobleclick');
    // console.log(this.dataSeleccionada);

    if (this.dataSeleccionada.length >= 1 ) {
      this.avisaSeteo.setVisivilidad(true);
    } else {
      this.avisaSeteo.setVisivilidad(false);
    }
     // this.avisaSeteo.getVisivilidad();

    this.activeModal.close(data);
    // this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss(false);
  }
  public buscar(event) {

    if (this.finderTabular.busqueda !== null && this.finderTabular.busqueda.trim() !== '' ) {
      this.finder.finderGenericDTO.atribute = this.finderTabular.campoBusqueda.atribute;
      this.finder.finderGenericDTO.type = this.finderTabular.campoBusqueda.type;
      if (this.finder.finderGenericDTO.type === FrontEndConstants.JAVA_LANG_LONG) {
        this.finder.finderGenericDTO.value = this.finderTabular.busqueda;
      } else {
              if (this.findByEqual) {
                this.finder.finderGenericDTO.value = this.finderTabular.busqueda;
              } else {
                this.finder.finderGenericDTO.value = '%' + this.finderTabular.busqueda + '%';
              }
      }
  } else {
    this.finder.finderGenericDTO.atribute = null;
    this.finder.finderGenericDTO.type = null;
    this.finder.finderGenericDTO.value = null;
  }
  const user = JSON.parse(localStorage.getItem('currentUser'));
  this.abmservice.consultarAbmGeneric(user, this.finder).subscribe(
    result => {
      this.data = getData(result['data'], result['columns']);
    },
    (err: HttpErrorResponse) => {
      this.checkError(err);
    }
  );
}
private checkError(error: any ) {
 if (error !== undefined && error !== null) {
    if ((error.hasOwnProperty('tokenError') &&  error.tokenError) || (error.hasOwnProperty('tokenExpired') && error.tokenExpired)) {
       this.router.navigate(['/token']);
      return;
    } else {
      this.toastrService.error(' error inesperado');
    }
  }
 }
}
