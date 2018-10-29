import { Injectable } from '@angular/core';
import { Network } from "@ionic-native/network";
import { Toast, ToastController } from "ionic-angular";

@Injectable()
export class NetworkCheck {

  private connected: boolean = true;
  private toast: Toast;

  constructor(
    private network: Network,
    private toastCtrl: ToastController) {

    console.log('Hello NetworkCheckProvider Provider');
    console.log(this.network.type);
    if (this.network.type == 'none') {
      this.connected = false;
    }

    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      if (!this.connected) {
        this.toast.dismissAll();
      }
      this.connected = true;
    });

    this.network.onDisconnect().subscribe(() => {
      console.log('network disconnected!');
      this.connected = false;
      this.toast = this.toastCtrl.create({
        message: 'Please connect a network.',
        position: 'bottom'
      });
      this.toast.present();
    });
  }

  isConnected(): boolean {
    return this.connected;
  }
}
