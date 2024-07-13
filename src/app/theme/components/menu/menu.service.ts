import { Injectable, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TipoReporte } from '../../../_models/tipoReporte';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';



@Injectable()
export class MenuService {
  private verticalMenuItems: any;
  private horizontalMenuItems: any;
  private reportdef: string;
  private tipoReporte: TipoReporte;

constructor(private location: Location,
              private renderer2: Renderer2,
              private router: Router,
              private http: HttpClient,
              public appSettings: AppSettings
            ) {}

  public getVerticalMenuItems(): any {
      return this.verticalMenuItems;
  }
  public setVerticalMenuItems(m: any) {
      this.verticalMenuItems = m;
  }

  public getHorizontalMenuItems(menu: any) {
    this.horizontalMenuItems = menu;
 }

 public getReportdef(): string {
  return this.reportdef;
}
public setReportdef(reportdef: string) {
  this.reportdef = reportdef;
}


  public createMenu(menu: any, nativeElement, type) {
    // console.log('tipo de menu' + menu);
    const p = JSON.parse( menu );

    if (type === 'vertical') {
      this.createVerticalMenu(p, nativeElement);
     }
  }

  public createVerticalMenu(menu: any, nativeElement) {
    const menu0 = this.renderer2.createElement('div');
    this.renderer2.setAttribute(menu0, 'id', 'menu0');
    for (let i = 0; i < menu.length; i ++) {
      if (menu[i].idMenuPadre === 0 ) {
        const subMenu = this.createVerticalMenuItem(menu, menu[i]);
        this.renderer2.appendChild(menu0, subMenu);
      }
    }
    this.renderer2.appendChild(nativeElement, menu0);
  }



  public createVerticalMenuItem(menu: any, menuItem) {
    const div = this.renderer2.createElement('div');
    this.renderer2.addClass(div, 'card');
    this.renderer2.setAttribute(div, 'id', 'menu' + menuItem.idMenu);
    const link = this.renderer2.createElement('a');
    this.renderer2.addClass(link, 'menu-item-link');
    this.renderer2.setAttribute(link, 'data-toggle', 'tooltip');
    this.renderer2.setAttribute(link, 'data-placement', 'right');
    this.renderer2.setAttribute(link, 'data-animation', 'false');
    this.renderer2.setAttribute(link, 'data-container', '.vertical-menu-tooltip-place');
    this.renderer2.setAttribute(link, 'data-original-title', menuItem.descripcion);
    // const icon = this.renderer2.createElement('i');
    // this.renderer2.addClass(icon, 'fa');
    // this.renderer2.addClass(icon, 'fa-file-text-o');
    // this.renderer2.appendChild(link, icon);
    const span = this.renderer2.createElement('span');
    this.renderer2.addClass(span, 'menu-title');
    this.renderer2.appendChild(link, span);
    const menuText = this.renderer2.createText(menuItem.descripcion);
    this.renderer2.appendChild(span, menuText);
    this.renderer2.setAttribute(link, 'id', 'link' + menuItem.idMenu);
    this.renderer2.addClass(link, 'transition');
    this.renderer2.appendChild(div, link);
    if (menuItem.ejecutar !== undefined ) {
      this.renderer2.listen(link, 'click', () => {
          // this.router.navigate([menuItem.ejecutar]);
          this.setActiveLink(menu, link);
          // this.setReportdef(menuItem.ejecutar);
          localStorage.setItem('currentMenuClick', menuItem );
          // this.closeOtherSubMenus(div);
          const url = '/pages/home/reportdef';
          // console.log('entro a la opcion de ' + menuItem.ejecutar);
          // console.log('Router URL ' + this.router.url);
          if (menuItem.ejecutar == null) {
            return;
          }
          this.router.navigate([url, menuItem.ejecutar]);

        });
    }
    // console.log(menuItem.idMenuPadre);
    if (menuItem.submenu) {
      this.renderer2.addClass(link, 'collapsed');
      const caret = this.renderer2.createElement('b');
      this.renderer2.addClass(caret, 'fa');
      this.renderer2.addClass(caret, 'fa-angle-up');
      this.renderer2.appendChild(link, caret);
      this.renderer2.setAttribute(link, 'data-toggle', 'collapse');
      this.renderer2.setAttribute(link, 'href', '#collapse' + menuItem.idMenu);
      const collapse = this.renderer2.createElement('div');
      this.renderer2.setAttribute(collapse, 'id', 'collapse' + menuItem.idMenu);
      this.renderer2.setAttribute(collapse, 'data-parent', '#menu' + menuItem.idMenuPadre);
      this.renderer2.addClass(collapse, 'collapse');
      this.renderer2.appendChild(div, collapse);
     this.createSubMenu(menu, menuItem.idMenu, collapse, 'vertical');
    }
    return div;
  }

  private createSubMenu(menu: any, menuItemId, parentElement, type) {

    // console.log('entro al createSubMenu');
    // console.log('createSubMenu  ' + menu);

    for (let i = 0; i < menu.length; i ++) {
      if (menu[i].idMenuPadre === menuItemId ) {
        let subMenu = null;
        subMenu = this.createVerticalMenuItem(menu, menu[i]);
        this.renderer2.appendChild(parentElement, subMenu);
      }
    }


    /*
      const menus = menu.filter(item => item.idMenuPadre === menuItemId);
      menus.forEach((menuItem) => {
        let subMenu = null;
        if (type === 'vertical') {
           subMenu = this.createVerticalMenuItem(menu, menuItem);
        }
        if (type === 'horizontal') {
           subMenu = this.createHorizontalMenuItem(menu, menuItem);
        }
        this.renderer2.appendChild(parentElement, subMenu);
      }); */
  }

  private closeOtherSubMenus(elem) {
      const children = (this.renderer2.parentNode(elem)).children;
      for (let i = 0; i < children.length; i++) {
          const child = this.renderer2.nextSibling(children[i].children[0]);
          if (child) {
              this.renderer2.addClass(children[i].children[0], 'collapsed');
              this.renderer2.removeClass(child, 'show');
          }
      }
  }


  public setActiveLink(menu: any, link) {
    // console.log('entro al seteoLink ' + link);
    if (link) {
      for (let i = 0; i < menu.length; i ++) {
        const activeLink = document.querySelector('#link' + menu[i].idMenu);
        if (activeLink) {
          if (activeLink.classList.contains('active-link')) {
            activeLink.classList.remove('active-link');
          }
        }
        this.renderer2.addClass(link, 'active-link');
    }


    }
}
}




