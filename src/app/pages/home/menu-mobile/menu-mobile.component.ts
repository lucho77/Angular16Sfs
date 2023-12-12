import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.scss']
})
export class MenuMobileComponent implements OnInit{

  constructor(private router: Router){}
  ngOnInit(): void {
    this.getMenu();
  }
  menu: any;

  public getMenu(): any{
    this.menu = JSON.parse(localStorage.getItem('userMenu'));
  }
  public getRouter(ejecutar): any {
    if (ejecutar != null) {
      let url = 'pages/home/reportdef/' + ejecutar
      this.router.navigate([url])
    }
  }
}
