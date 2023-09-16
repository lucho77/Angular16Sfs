import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { NotificaPojoDTO } from '../../../_models/notificaPojoDTO';
import { User } from '../../../_models/user';
import { ChatUtilDTO } from '../../../_models/chatUtilDTO';

@Component({
  selector: 'app-infonotification',
  templateUrl: './infoNotificationComponent.html',
})
export class InfoNotificationComponent   {
  @Input('notifi') notifi: any;


  constructor(private router: Router) {
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {

    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {

      // this.nameGlobalService.setearNameGlobal('SIN SELECCION', '');

  }
  salir() {
    this.router.navigate(['/sfs']);
  }
  mostrarNotifica(item: NotificaPojoDTO) {
    const chatUtil = {} as ChatUtilDTO;
    const user = <User>JSON.parse(localStorage.getItem('currentUser'));
    chatUtil.metodo = 'leida';
    chatUtil.notificaPojo = item;
/*
    this.chatService.chatGeneric(user, chatUtil).subscribe
    (m => {
      console.log(m);
      const url = '/pages/home/reportdef';
          this.router.navigate([url, 'sfs.salud.modelo.Notifica']);
        },
     (err: HttpErrorResponse) => {
      console.log(err);
    });
  */
}
}
