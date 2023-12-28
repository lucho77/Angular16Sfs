import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @Input() idSession: Number;
  @Input() nombre: Number;
  @Input() messages: any;
  @Input() msjsEnviados: any;
  public toggleMenuChat: boolean = false;

  
  constructor(private activeModal: NgbActiveModal){}

  cerrarChat(): void {
    this.activeModal.close();
  }
  abrirMenuChat(): void{
    this.toggleMenuChat = !this.toggleMenuChat;
  }
  cerrarMenuChat():void {
    this.toggleMenuChat = false;
  }

}
