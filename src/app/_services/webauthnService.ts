import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebauthnService {

  constructor() { }


  // Crear credenciales
  async createCredential(m:string): Promise<any> {


    let publicKey = this.createPublicKey(m);
    
    try {
      const credential:any = await navigator.credentials.create({ publicKey });

      console.log('Credencial creada:', credential);
      const credentialJSON = {
        id: credential.id,
        rawId:   this.uint8ArrayToBase64(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: this.uint8ArrayToBase64(credential.response.attestationObject),
          clientDataJSON: this.uint8ArrayToBase64(credential.response.clientDataJSON),
        },
        clientExtensionResults: credential.getClientExtensionResults(),
      };
      return credentialJSON;
    } catch (err) {
      console .error('Error al crear la credencial:', err);
      throw err;
    }
  }

  createPublicKey(m:any){
    let data = JSON.parse(m);

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
    return publicKey;
  }
  createPublicKeyString(m:string){
    let data = JSON.parse(m);

    const publicKey = {
      challenge: data.challenge,  // Convert base64 to Uint8Array
      rp: data.rp,
      user: {
        ...data.user,
        id: data.user.id,  // Convert base64 to Uint8Array
      },
      pubKeyCredParams: data.pubKeyCredParams,
      authenticatorSelection: {
        userVerification: "preferred"
      },
      timeout: 360000,
    };
    return  JSON.stringify(publicKey);
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
   uint8ArrayToBase64(valor) {
    // Crea una cadena binaria a partir del Uint8Array
    const uint8Array = new Uint8Array(valor);
    
    // Convierte el Uint8Array a una cadena de caracteres binarios
    let binaryString = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
    }
    
    // Convierte la cadena binaria a Base64
    const base64 = btoa(binaryString);
    
    // Convierte Base64 a Base64Url
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); 
 
}
  // Obtener la autenticación
  async getAssertion(data:any): Promise<any> {

    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: this.base64ToUint8Array(data.publicKey.challenge),  // Convert base64 to Uint8Array
      timeout: 360000,
      rpId:data.publicKey.rpId,
      extensions:{}
    };
    try {
      const assertion:any = await navigator.credentials.get({ publicKey });
      const credentialJSON = {
        id: assertion.id,
        response: {
          authenticatorData: this.uint8ArrayToBase64(assertion.response.authenticatorData),
          clientDataJSON: this.uint8ArrayToBase64(assertion.response.clientDataJSON),
          signature: this.uint8ArrayToBase64(assertion.response.signature),
        },
        type:'public-key',
        clientExtensionResults: assertion.getClientExtensionResults(),
      };

      console.log('Autenticación exitosa:', assertion);
      return JSON.stringify(credentialJSON);
    } catch (err) {
      console.error('Error en la autenticación:', err);
      throw err;
    }
  }
}