import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EsMobileService } from 'src/app/_services/es-mobile.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @Input() idSession: Number;
  @Input() nombre: Number;
  @Input() messages: Array<any>;
  mensSort: Array<any>;
  public msj: string;
  public toggleMenuChat: boolean = false;


  constructor(private activeModal: NgbActiveModal, public EMS: EsMobileService) { }

  cerrarChat(): void {
    this.activeModal.close();
  }
  abrirMenuChat(): void {
    this.toggleMenuChat = !this.toggleMenuChat;
  }
  cerrarMenuChat(): void {
    this.toggleMenuChat = false;
  }
  enviarMsj(msj: string): void {
    if (!msj) return
    if (msj.trim()) {
      this.messages.unshift({

        'name': 'Bruno',
        'text': msj,
        'time': 0,
        'enviado': true,
        'idSession': this.idSession,
        'leido': true

      });
      this.msj = '';
    }
  }
  eliminarHistorialChat(): void {
    this.messages = this.messages.filter((msj) => { msj.idSession != this.idSession });
  }
}