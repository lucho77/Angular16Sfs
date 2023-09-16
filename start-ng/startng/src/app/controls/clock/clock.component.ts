import { Component, OnInit, Input } from '@angular/core';
import {ClockService, ValorReloj} from '../../_services/clockService';
import { Observable, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { toInteger } from 'src/app/util/datePicker/util';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
  @Input() field: any = {};
  @Input() form: FormGroup;
  datos$: Observable<ValorReloj>;
  hora: number;
  minutos: string;
  dia: string;
  fecha: string;
  ampm: string;
  segundos: string;
  private nameRef: Subscription = null;
  constructor(private segundo: ClockService) { }
  ngOnInit() {
    this.minutos = (this.field.valueNew % 60).toString();
    this.hora = Math.trunc(this.field.valueNew / 60);
    this.minutos = (toInteger(this.minutos) < 10) ? '0' + this.minutos : this.minutos,

    this.datos$  = this.segundo.getInfoReloj(this.field.valueNew);
    this.nameRef = this.datos$.subscribe(x => {
      this.hora = x.hora;
      this.minutos = x.minutos;
    });
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.nameRef.unsubscribe();
    this.segundo.unsuscribe();
    console.log('destruido el tabular');
  }
}
