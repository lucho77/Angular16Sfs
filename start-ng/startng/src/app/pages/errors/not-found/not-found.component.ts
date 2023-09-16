import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotFoundComponent implements AfterViewInit {

  router: Router;

  constructor(router: Router) {
      this.router = router;
  }


  ngAfterViewInit() {
    const p = document.getElementById('preloader'); 
    if(p){
      p.classList.add('hide');
    }
  }

}
