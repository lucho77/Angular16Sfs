import { Injectable } from '@angular/core';
import { isMobile } from 'mobile-device-detect';

@Injectable({
  providedIn: 'root'
})
export class EsMobileService {

  mobile: boolean = isMobile;
  tablet: boolean = screen.width > 600;
  constructor() { }

  esMobileNoTablet(): boolean {
    if (this.mobile && !this.tablet) return true;
    return false
  }

  esEscritorioOTablet():boolean {
    if (!this.mobile || this.tablet) return true;
    return false
  }
}
