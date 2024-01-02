import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({templateUrl: 'home.component.html'})

export class HomeComponent implements OnInit {
    prueba: boolean;
    constructor(private router: Router) {}

    ngOnInit() {
        this.prueba = false;
        const reporte = localStorage.getItem('reporte');
        localStorage.removeItem('reporte');
        const url = '/pages/home/reportdef';
        if (reporte && reporte!=='null' && reporte!=='undefined' ) {
            this.router.navigate([url, reporte]);
        } else {
            this.router.navigate([url, 'nothing']);

        }
    }


        // si viene esta variable significa que tiene que cargar un reporte;
    }


