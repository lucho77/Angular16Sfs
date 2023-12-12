import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isMobile } from 'mobile-device-detect';

@Component({templateUrl: 'home.component.html'})

export class HomeComponent implements OnInit {
    prueba: boolean;
    tablet: boolean = screen.width > 600;
    constructor(private router: Router) {}

    ngOnInit() {
        this.prueba = false;
        const reporte = localStorage.getItem('reporte');
        localStorage.removeItem('reporte');
        const url = '/pages/home/reportdef';
        if (reporte && reporte!=='null' && reporte!=='undefined' ) {
            this.router.navigate([url, reporte]);
        } else if (isMobile && !this.tablet){
            this.router.navigate(['/pages/home/menu-mobile']);

        } else{
            this.router.navigate([url, 'nothing']);
        }
    }
        // si viene esta variable significa que tiene que cargar un reporte;
    }


