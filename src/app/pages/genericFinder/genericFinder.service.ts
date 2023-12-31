import { Injectable } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericFinderComponent } from './genericFinder.component';
import { HeaderDTO } from 'src/app/_models/headerDTO';
import { FinderParamsDTO } from '../../_models/finderParamsDTO';
import { getData } from './utilFinder';


@Injectable()
export class GenericFinderService {

  constructor(private modalService: NgbModal) { }

  settings: any;
  data: any;
  public confirm(
    title: string,
    data: any,
    column: any,
    entidad: string,
    vista: string,
    finder: FinderParamsDTO,
    combofinder: FinderParamsDTO,
    findByEqual: boolean,
    value: string,
    dialogSize: 'sm'|'lg' = 'lg'): Promise<any> {

    this.data = getData(data.data, data.columns);




    const modalRef = this.modalService.open(GenericFinderComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.data = this.data;
    modalRef.componentInstance.settings = this.settings;
    modalRef.componentInstance.column = column;
    modalRef.componentInstance.entidad = entidad;
    modalRef.componentInstance.vista = vista;
    modalRef.componentInstance.finder = finder;
    modalRef.componentInstance.comboFinder = combofinder;
    modalRef.componentInstance.findByEqual = findByEqual;
    modalRef.componentInstance.value = value;
    return modalRef.result;
  }








}
