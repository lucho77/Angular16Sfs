import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  swPushpayload: any;

  constructor(private swPush: SwPush) {}

  subscribeToNotifications(): void {
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: environment.push.public
        })
        .then((sub: PushSubscription) => {
          this.saveSubscription(sub);

          this.storeSubscription(sub);

          console.log('Display', JSON.stringify(sub)); 
        })
        .catch((err: any) => console.error('Could not subscribe to notifications', err));
    }
  }

  unsubscribeFromPushNotifications(): void {
    this.swPush
      .unsubscribe()
      .then(() => {
        console.log('Unsubscribed from push notifications.');
      })
      .catch(error => {
        console.error('Error unsubscribing from push notifications:', error);
      });
  }

  subscribeMessage(): void {
    this.swPush.messages.subscribe((res: any) => {
      console.log('Received push notification', res);
    });
  }

  private saveSubscription(sub: PushSubscription): void {
  }

  private storeSubscription(sub: PushSubscription): void {
  }
}