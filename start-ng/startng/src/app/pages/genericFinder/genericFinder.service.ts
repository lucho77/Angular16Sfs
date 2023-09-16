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
    entidad: string,
    vista: string,
    finder: FinderParamsDTO,
    combofinder: FinderParamsDTO,
    findByEqual: boolean,
    value: string,
    dialogSize: 'sm'|'lg' = 'lg'): Promise<any> {

    this.getSettings(data.columns);
    this.data = getData(data.data, data.columns);



    const modalRef = this.modalService.open(GenericFinderComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.data = this.data;
    modalRef.componentInstance.settings = this.settings;
    modalRef.componentInstance.entidad = entidad;
    modalRef.componentInstance.vista = vista;
    modalRef.componentInstance.finder = finder;
    modalRef.componentInstance.comboFinder = combofinder;
    modalRef.componentInstance.findByEqual = findByEqual;
    modalRef.componentInstance.value = value;
    return modalRef.result;
  }


  private getSettings(columns: HeaderDTO[]) {
  // const p = JSON.parse(columns);
  // console.log(columns);
  // tslint:disable-next-line:prefer-const
  let post = {};

  for (let i = 0; i < columns.length; i++) {
    post[columns[i].name] = {'title': columns[i].name };
  }
  console.log('el header es...');

   console.log(post);
  this.settings = {
    selectMode: 'single',  // single|multi
    mode: 'external',
    hideHeader: false,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Acciones',
      add: false,
      edit: false,
      delete: false,
      custom: [],
      position: 'right' // left|right
    },
    pager: {
      perPage: 7
    },
    columns: post,
    noDataMessage: 'no hay registros',
  };



}


}
