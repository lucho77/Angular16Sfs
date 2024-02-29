import { Injectable } from "@angular/core";
import {  Observable, Subject } from "rxjs";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { User } from "../_models";
import { chatUser } from "../_models/chatUser";
import { ChatUtilDTO } from "../_models/chatUtilDTO";

@Injectable({ providedIn: 'root' })

export class SocketService {
    private socket$: WebSocketSubject<string>;

    constructor() {
    }


connect(user:chatUser){
  if(!this.socket$){
    this.socket$ = new WebSocketSubject('ws://localhost:9335/ms_notification/sfs-websocket');
    this.socket$.subscribe({
     next: message => this.handleMessage(message),
     error:e => this.handleError(e),
     complete:() => this.handleComplete()
   });
   this.sendMessage(user);
  }

}
  sendMessage(message: any): void {
    this.socket$.next(message);
  }

  private handleMessage(message: string): void {
    console.log('Mensaje recibido:', message);
  }

  private handleError(error: any): void {
    console.error('Error en WebSocket:', error);
  }

  private handleComplete(): void {
    this.socket$.unsubscribe();
    this.socket$=null;
    console.log('Conexión WebSocket cerrada');
  }
    

 }