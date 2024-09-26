import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  constructor() { }


  // Crear credenciales
  async createCredential(): Promise<any> {

    let user =      JSON.parse(localStorage.getItem('currentUser'));
    let data = JSON.parse(user.registration);

    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: this.base64ToUint8Array(data.challenge),  // Convert base64 to Uint8Array
      rp: data.rp,
      user: {
        ...data.user,
        id: this.base64ToUint8Array(data.user.id),  // Convert base64 to Uint8Array
      },
      pubKeyCredParams: data.pubKeyCredParams,
      authenticatorSelection: {
        // Try to use UV if possible. This is also the default.
        userVerification: "preferred"
      },
      timeout: 360000,
    };


    
    try {
      const credential = await navigator.credentials.create({ publicKey });

      console.log('Credencial creada:', credential);
      return credential;
    } catch (err) {
      console .error('Error al crear la credencial:', err);
      throw err;
    }
  }

   base64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
  
    return outputArray;
  }
   uint8ArrayToBase64(uint8Array) {
    // Crea una cadena binaria a partir del Uint8Array
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
    }
    // Codifica la cadena binaria a Base64
    const base64String = window.btoa(binaryString)
        .replace(/\+/g, '-') // Cambia '+' por '-'
        .replace(/\//g, '_'); // Cambia '/' por '_'
    
    return base64String;
}
  // Obtener la autenticación
  async getAssertion(): Promise<any> {

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKey = {
      challenge: challenge,
      allowCredentials: [
        {
          id: Uint8Array.from([/* ID de la credencial registrada */]),
          type: "public-key",
        }
      ],
      timeout: 60000,
      userVerification: "required"
    };

    try {
      //const assertion = await navigator.credentials.get({ publicKey });
      //console.log('Autenticación exitosa:', assertion);
      //return assertion;
    } catch (err) {
      console.error('Error en la autenticación:', err);
      throw err;
    }
  }
}