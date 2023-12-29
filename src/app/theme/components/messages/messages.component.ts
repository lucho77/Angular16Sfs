import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessagesService } from './messages.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from '../../chat/chat.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessagesService]
})
export class MessagesComponent implements OnInit {
  public messages: Array<any>;
  public files: Array<any>;
  public meetings: Array<any>;
  public usuariosOn: Array<any>;
  private usuariosArr: Array<any>;
  public userSearch: string;
  public toggleClassInput: boolean = false;
  public usersFiltrados: Array<any> = [];
  private userEncontrado: boolean;
  @ViewChild('buscarNombre') inputBuscarNombre: ElementRef;

  constructor(private messagesService: MessagesService, private modalService: NgbModal, private aviso: ToastrService) {
    this.messages = messagesService.getMessages();
    this.meetings = messagesService.getMeetings();
    this.usuariosOn = messagesService.getUsuarios();
    this.usuariosArr = messagesService.getUsuarios();


  }

  ngOnInit() {
    jQuery('#messagesTabs').on('click', '.nav-item a', function () {
      setTimeout(() => jQuery(this).closest('.dropdown').addClass('show'));
    })
    jQuery('#messagesTabs-input').on('click', '.nav-item a', function () {
      setTimeout(() => jQuery(this).closest('.dropdown').addClass('show'));
    })


  }

  abrirChat(idSession: number) {

    if (!idSession) return

    let modalChat = this.modalService.open(ChatComponent, { size: 'lg', centered: true });
    modalChat.componentInstance.idSession = idSession;
    modalChat.componentInstance.nombre = this.getNombreChatByIdSession(idSession);
    modalChat.componentInstance.messages = this.messages;

    return modalChat;

  }
  getNombreChatByIdSession(idSession: number): any {
    for (const user of this.usuariosOn) {
      if (user.idSession === idSession) return user.name;
    }
    this.aviso.error(`No se a encontrado ningun chat`);
    return null;
  }

  getIdSessionByName(nombre: string): number {

    let nombreFiltrado = this.buscaUsers(nombre);
    let nom: string;

    if (nombreFiltrado) {
      nom = nombreFiltrado.toUpperCase();
    }
    for (const user of this.usuariosArr) {
      if (user.name.toUpperCase() == nom) return user.idSession;
    }
    if (!this.userEncontrado) this.aviso.error(`No se encontró ningun chat con ${nombre}`);
    return null;
  }

  acortarText(texto: string): string {
    return texto.slice(0, 51) + '...';
  }



  clickClassEvent(): void {
    this.toggleClassInput = !this.toggleClassInput;
    this.userSearch = '';
    this.elementoFocus();
  }

  elementoFocus(): void {
    if (this.toggleClassInput) {
      setTimeout(() => {
        this.inputBuscarNombre.nativeElement.focus();
      }, 500);
    }
  }

  buscaUsers(nombre: string): string {
    if (!nombre) {
      this.setListaUsuariosOriginal();
      this.userEncontrado = true;
    } else {
      let nom = nombre.toUpperCase();
      this.usuariosArr.forEach(user => {
        let nomU = user.name.toUpperCase();
        if (nomU.includes(nom)) {
          this.usersFiltrados.push(user);
        }
      });

      if (this.usersFiltrados.length == 1) {
        let userEncontrado = this.usersFiltrados[0].name;
        this.usersFiltrados = [];
        this.userEncontrado = true;
        return userEncontrado;
      }
      else if (this.usersFiltrados.length > 1) {
        this.usuariosOn = this.usersFiltrados;
        this.usersFiltrados = [];
        this.userEncontrado = true;
      }
      else {
        this.userEncontrado = false;
      }
    }
  }
  setListaUsuariosOriginal(): void {
    this.usuariosOn = this.usuariosArr;
  }
}
