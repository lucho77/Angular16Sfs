import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MessagesService} from './messages.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from '../../chat/chat.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MessagesService ]
})
export class MessagesComponent implements OnInit {
  public messages: Array<any>;
  public files: Array<any>;
  public meetings: Array<any>;  
  public msjsEnviados: Array<any>;  
  public usuariosOn: Array<any>;  
  constructor(private messagesService:MessagesService, private modalService: NgbModal) { 
    this.messages = messagesService.getMessages();
    this.meetings = messagesService.getMeetings();
    this.usuariosOn = messagesService.getUsuarios();

    
  }

  ngOnInit() {
    jQuery('#messagesTabs').on('click', '.nav-item a', function(){        
        setTimeout(() => jQuery(this).closest('.dropdown').addClass('show')); 
    })


  }

  abrirModal(idSession: number, nombre: string){

    let modalChat = this.modalService.open(ChatComponent,{size: 'lg', centered: true});
    modalChat.componentInstance.idSession = idSession;
    modalChat.componentInstance.nombre = nombre;
    modalChat.componentInstance.messages = this.messages;
    modalChat.componentInstance.msjsEnviados = this.msjsEnviados;


    return modalChat;

  }
  acortarText(texto:string): string{
    return texto.slice(0,51) + '...';
  }

}
