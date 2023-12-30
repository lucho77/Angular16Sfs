import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: 'root' })

export class SocketService {
    private socket: WebSocket; 
    messageReceived: Subject<string> = new Subject<string>();

    constructor() {
    }

    public connect(): Observable<any> {

        return new Observable(observer => {
          this.socket.onmessage = (event) => observer.next(event.data);
          this.socket.onerror = (event) => observer.error(event);
          this.socket.onclose = () => observer.complete();
        });
      }
    
      public sendMessage(message: string): void {
        this.socket.send(message);
      }

      public connectServer(){
        if(!this.socket){
            this.socket = new WebSocket('ws://localhost:3000');
            this.socket.onopen = () => {
                this.socket.send('Hello, server!');
              };
        }

      }
      public cerrarSocket(){
        this.socket.close();
      }
}