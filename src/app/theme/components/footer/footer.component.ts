import { Component, OnInit, ViewEncapsulation, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatDTO } from '../../../_models/chatDTO';
import { MetodoService } from '../../../_services/metodoService';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {

  public settings: Settings;
  mensaje_error  = '';
  consultaForm: FormGroup;
  submitted = false;
  lineaActiva = false;
  version: '';
  @ViewChild('cons') cons: ElementRef;

  constructor(public appSettings: AppSettings, private formBuilder: FormBuilder, private renderer: Renderer2,
    private metodoService: MetodoService, private toastrService: ToastrService, private authenticationService: AuthenticationService) {
      this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.consultaForm = this.formBuilder.group({
      consulta: ['', [Validators.required]],
      prioridad: ['baja', [Validators.required]],
    });
    this.authenticationService.version().subscribe
    (result => {
      console.log(result);
      this.version = result.respuestagenerica;
    },
    (err: HttpErrorResponse) => {
      this.toastrService.error('no se ha podido obtener la version');
    });
}

  consultaEnLinea() {
          // console.log(data.camposPersistirDTO);

    this.lineaActiva = true;
    this.consultaForm.controls['consulta'].setValue('');
    this.consultaForm.controls['prioridad'].setValue('baja');

    this.ponerFocus();
  }
  mandarMensaje() {
    this.submitted = true;
    if (this.consultaForm.invalid) {
      return;
    }
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const  chatDTO = {} as ChatDTO;
    chatDTO.msg = this.f.consulta.value;
    chatDTO.prioridad = this.f.prioridad.value;
    chatDTO.de = user.username;
    chatDTO.idAplica = user.idAplica;

          // console.log(data.camposPersistirDTO);
          this.metodoService.nuevoChat(user, chatDTO).subscribe
          (result => {
              this.toastrService.success('mensaje enviado con exito');
          },
          (err: HttpErrorResponse) => {
            this.toastrService.error('no se ha podido enviar la consulta, intente más tarde');
          });

  }
  get f() { return this.consultaForm.controls; }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    // this.ponerFocus();
}
ponerFocus() {
  this.renderer.selectRootElement(this.cons.nativeElement).focus();
}

}
