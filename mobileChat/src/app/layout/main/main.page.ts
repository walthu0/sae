import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormsModule
} from "@angular/forms";
import { ToastController, NavController, NavParams } from '@ionic/angular';
import { saveAs } from "file-saver/FileSaver";
//clases
import { ClasePersona } from "../../clases/Clase-Persona";
import { Salas } from "../../clases/salas";

// Servicio
import { SalasService } from "../../services/salas.service";
// instancia a la Base de datos
import * as firebase from 'firebase';
import { userInfo } from 'os';






@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
    @ViewChild('fileInput') fileInput;
  user: any;
  srcFoto: string;

  userName: string = "";
  srcFotoPerfil: string = "";
 
  form: FormGroup;

  fotoNombre: string = "";
  fotoType: string = "";
  fotoFile: any= "";
  fotoArchivo: string ="";
  message: string = "";
  messages = [];
  messagesRef: any;
  

  salaElegida:string="yavirac"

  salas: Salas[] = [];
  @ViewChild("refresh") refresh;

  constructor(public navCtrl: NavController,
    

     private dataService: AuthService,
     private router: Router,
      private http: Http,
     private salaService: SalasService,
 
     
      ) {
        this.user = JSON.parse(sessionStorage.getItem('user')).Persona;
        this.salaService.getSalas(this.user.id)
        .then(r => {
            this.salas = JSON.parse(r) as Salas[];
            console.log("salas "+this.salas[0])
        })
        .catch(e => console.log(e));

   }

   
  seleccionarSala(sala:Salas){
    console.log("entro 2")
    this.salaElegida= sala.idSala;
    console.log('Carrera es ', sala);
  }
  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user')).Persona;
    this.getFotoPerfil();
    this.getMessages();
    console.log(this.user.nombre1)
  }

  getFotoPerfil() {
    this.srcFoto = 'assets/images/user.png';
    this.dataService.foto(this.user.id)
        .then(respuesta => {
            if (JSON.stringify(respuesta) == '[0]') {
                return;
            }
            const fotoFile = respuesta[0].adjunto;
            const fotoNombre = respuesta[0].nombreArchivo;
            const fotoType = respuesta[0].tipoArchivo;
            this.srcFoto = 'data:' + fotoType + ';base64,' + fotoFile;
        })
        .catch(error => {
          this.srcFoto = 'assets/images/user.png';
        });
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  
    getMessages() {
     
            let messagesRef = firebase
                .database()
                .ref("/mensajes")
                .orderByChild("salaID")
                .equalTo(this.salaElegida + "");

            messagesRef.on("value", (snap) => {
                let data = snap.val();
                this.messages = [];
                for (let key in data) {
                    this.messages.push(data[key]);
                }
            });
           
         console.log("get "+this.messages);
        
    }
    downloadFile(base: string, tipo: string, nomDoc: string) {
        console.log("nombre: " + base + " tipo: " + tipo + " nomDoc " + nomDoc);

        let reader = new FileReader();

        const byteCharacters = atob(base);

        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: tipo + "" });

        saveAs(blob, nomDoc + "");
    }
}
