import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { isMobile } from 'mobile-device-detect';
import { ToastrService } from 'ngx-toastr';
import { FormdataReportdef } from 'src/app/_models/formdata';
import { ResponseIA } from 'src/app/_models/ResponseIADTO';
import { User } from 'src/app/_models/user';
import { VoiceService } from 'src/app/_services/voice.service';
import { AppSettings } from 'src/app/app.settings';

@Component({
  selector: 'app-voice-button',
  templateUrl: './voice-button.component.html',
  styleUrls: ['./voice-button.component.scss']
})
export class VoiceButtonComponent implements OnInit {

  public voiceActive: boolean = false;
  public mobile: boolean = isMobile;
  public tablet: boolean = screen.width > 600;
  public desarrollo: boolean = false;
  public text: string;
  public loader: boolean = false;
  private globalStream: any = null;
  private mediaRecorder = null;
  private chunks = [];
  private currentUser: User;
  private ejAcciones: boolean = false;
  private responseIA: ResponseIA;
  private url = '/pages/home/reportdef';
  private report: string;
  private paramsList: FormdataReportdef[];

  constructor(
    private toastrService: ToastrService,
    private settings: AppSettings,
    private router: Router,
    private voiceService: VoiceService
  ) { }

  ngOnInit(): void {
    let user: User = JSON.parse(localStorage.getItem("currentUser"));
    this.desarrollo = user.test;
    this.currentUser = user;
    console.log(this.ejAcciones);

    this.voiceService.report$.subscribe({
      next: (report: string) => {
        this.report = report;
        if (this.ejAcciones && this.responseIA)
          this.ejecutarAcciones(this.responseIA, this.getCleanParams());
      }
    })

  }

  async captureVoice() {

    if (!this.voiceActive) {
      this.globalStream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(
        (e: Error) => {
          if (e.message.includes('device not found')) {
            this.toastrService.error('No se encotró dispositivo de audio');
          }
        }

      );
      if (this.globalStream != null) {
        this.voiceActive = !this.voiceActive;

        let mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';

        const options = {
          audioBitsPerSecond: 128000,
          mimeType: mimeType,
        };

        // genero el MediaRecorder y grabo el archivo de audio en chunks
        this.mediaRecorder = new MediaRecorder(this.globalStream, options);
        this.mediaRecorder.addEventListener('dataavailable', (e) => {
          if (e.data.size > 0) {
            this.chunks.push(e.data);
          }
        });

        // Agrego funcionalidades custom al momento de hacer stop el mediaRecorder
        this.mediaRecorder.addEventListener('stop', async () => {

          let blob = new Blob(this.chunks, { type: mimeType });
          // let arrayBuffer = await blob.arrayBuffer();
          // let audioFile = new Uint8Array(arrayBuffer);

          let audioB64: string;
          try {
            audioB64 = (await this.blobToBase64(blob)).split(',')[1];

          } catch (error) {
            this.mediaRecorder = null;
            this.chunks = [];
            console.log(error);

            this.toastrService.error('Error al procesar el audio, por favor dígalo nuevamente');
            return;

          }

          if (audioB64.length > 0) {
            // mando el audio al backend para transcribirlo y que devuelva una accion
            this.sendAudioFile(audioB64, mimeType.includes('webm') ? 'wav' : 'm4a');
          }

          this.chunks = [];
          this.mediaRecorder = null;
        });
        this.mediaRecorder.start();
      }
    }
    else {
      if (this.globalStream != null) // Detengo la escucha del microfono del dispositivo
        this.globalStream.getTracks().forEach(track => { track.stop(); });

      // detengo el mediaRecorder para que ejecute las acciones custom del stop
      this.mediaRecorder.stop();
      this.voiceActive = !this.voiceActive;
    }
  }

  sendAudioFile(audioB64: string, mediaType: string) {
    this.loader = true;
    this.voiceService.postVoiceToAction(this.currentUser, audioB64, mediaType, localStorage.getItem('userMenu'), null).subscribe({
      next: res => {
        if (res.valor) {

          let response: ResponseIA = JSON.parse(res.valor);
          console.log('sendAudioFile', response);
          this.text = response.text;
          setTimeout(() => {
            this.text = null;
          }, 5000);
          if (response.noEncontrado) {
            this.toastrService.error('No se entendió la frase o no se encontró el menú');
            this.loader = false;
            return;
          }
          if (response.ejecutar && response.ejecutar != 'null' && response.redirecMenu) {
            this.router.navigate([this.url, response.ejecutar]);
            let currentReport: boolean = this.report == response.ejecutar;
            if (response.dato && response.setea && !currentReport) {
              this.responseIA = response;
              this.ejAcciones = true;

            }
            else if (currentReport)
              this.ejecutarAcciones(response, this.getCleanParams());

          }
          else if (response.dato && response.setea) {
            this.ejecutarAcciones(response, this.getCleanParams());

          }
          this.loader = false;
        }

        else {

          this.toastrService.error('No se entendió la frase o no se encontró el menú');
        }

      },
      error: err => {

        this.toastrService.error('Error inesperado');
      }
    })
  }

  ejecutarAcciones(responseIA: ResponseIA, paramsLimpios: any[]): void {
    console.log('ejecutarAcciones', this.ejAcciones);
    this.loader = true;
    if (responseIA.setea) {
      this.voiceService.postVoiceToAction(this.currentUser, null, null, JSON.stringify(paramsLimpios), responseIA.text).subscribe({
        next: (res) => {
          let response: ResponseIA = JSON.parse(res.valor);
          if (response) {
            console.log('ejecutarAcciones', response);
            let datoToSet: any = response.dato;

            let inputElem = this.voiceService.form.controls[response.nameField];
            let nameResControl = this.voiceService.form.controls[response.nameResField];

            let param: FormdataReportdef;
            for (let p of this.paramsList) {
              if (p.name && (p.name == response.nameField)) {
                param = p
                break;
              }
            }

            if (param.combo) {
              for (let c of param.comboDTO.comboBoxDTO) {
                if (c.value.includes(response.dato)) {
                  datoToSet = c.id;
                }
              }
            }

            if (nameResControl && nameResControl.value)
              nameResControl.setValue(null);

            inputElem.setValue(datoToSet);

            if (param.combo)
              this.voiceService.setChangueCombo(param.id);

            if (param.busquedaGenerica) {
              setTimeout(() => {
                let btnElement = document.getElementById(response.nameField + 'btn') as HTMLButtonElement;
                btnElement.click();
              }, 200);
            }
            this.ejAcciones = false;

          } else {
            this.toastrService.error('Error inesperado');
            this.ejAcciones = false;

          }
          this.loader = false;
        },
        error: (er) => {
          this.ejAcciones = false;
          this.loader = false;
          this.toastrService.error('Error inesperado');
        }
      })
    }
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  getCleanParams() {
    this.paramsList = this.voiceService.paramsForm;
    let paramsLimpio = [];
    for (let p of this.paramsList) {
      let pa = {
        name: p.name,
        nameRes: p.nameRes,
        label: p.label,
        combo: p.combo,
        comboBoxDTO: p.comboDTO.comboBoxDTO
      }
      paramsLimpio.push(pa);
    }
    return paramsLimpio;
  }

}
