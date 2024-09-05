import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class NameGlobalService {
    constructor() { }
    private nameChangedSource = new Subject<void>();
    private nameInfoChangue = new BehaviorSubject<string>('');
    public nameInfo$ = this.nameInfoChangue.asObservable();
    public nameChanged$ = this.nameChangedSource.asObservable();
    private name: string;
    private detalle: string;

    setNameInfoChangue(name: string) {
      console.log('nameinfo',name);
      
      this.nameInfoChangue.next(name);
    }

    setearNameGlobal(name: string, detalle: string) {
      if (name) {
        this.name = name;
      }
      if (detalle) {
        this.detalle = detalle;
      }
      this.nameChangedSource.next();
      }
      getName() {
        return this.name;
    }
    getDetalle() {
      return this.detalle;
  }
}
