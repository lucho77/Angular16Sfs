import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class SidebarComponent implements OnInit {
  public settings: Settings;
  public menuItems: any;
  constructor(public appSettings: AppSettings, 
    public menuService: MenuService ) {
      this.settings = this.appSettings.settings;
  }

  ngOnInit() {
   //  console.log('entro al ngOnInit del sidebar component ');
      const ids = localStorage.getItem('userMenu');
     // console.log('esto es el menu' + ids);

      this.menuItems = ids;
      this.menuService.setVerticalMenuItems(JSON.parse(ids));
  }

  public closeSubMenus() {
    const menu = document.querySelector('#menu0');
    for (let i = 0; i < menu.children.length; i++) {
      const child = menu.children[i].children[1];
        if (child) {
            if (child.classList.contains('show')) {
              child.classList.remove('show');
              menu.children[i].children[0].classList.add('collapsed');
            }
        }
    }
  }


}
