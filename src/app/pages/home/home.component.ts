import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({templateUrl: 'home.component.html'})

export class HomeComponent implements OnInit {
    prueba: boolean;
    constructor(private router: Router) {}

    ngOnInit() {
        this.prueba = false;
        console.log('hOME iNICIALIZADO');
        const reporte = localStorage.getItem('reporte');
        localStorage.removeItem('reporte');
        console.log(reporte);
        const url = '/pages/home/reportdef';
        if (reporte && reporte!=='null' && reporte!=='undefined' ) {
            // console.log('entro a la opcion de ' + menuItem.ejecutar);
            // console.log('Router URL ' + this.router.url);
            this.router.navigate([url, reporte]);
        } else {
            this.router.navigate([url, environment.reporteInicio]);

        }
    }


        // si viene esta variable significa que tiene que cargar un reporte;
    }


