import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormsModule
} from "@angular/forms";
//clases
import { Persona } from "app/entidades/CRUD/Persona";
import { LoginResult } from "./../../../entidades/especifico/Login-Result";

//servicios
import { FotoPerfilService } from "app/CRUD/fotoperfil/fotoperfil.service";
import { ChatObtenerChatSalaService } from "app/shared/components/chatspace/chat-obtener-chat-sala.service";
import { ChatObtenerDocenteService } from "app/shared/components/chatspace/chat-obtener-docente.service";

import { Observable } from "rxjs/Observable";
// instancia a la Base de datos

import * as firebase from "firebase";
import { saveAs } from "file-saver/FileSaver";

@Component({
    selector: "app-chatspace",
    templateUrl: "./chatspace.component.html",
    styleUrls: ["./chatspace.component.scss"],
    providers: [ChatObtenerChatSalaService, ChatObtenerDocenteService]
})
export class ChatspaceComponent implements OnInit {
    salaElegida = "nulo";
    busy: Promise<any>;
    showMenu: string = "";
    personaLogeada: Persona;
    userName: string = "";
    srcFotoPerfil: string = "";
    srcFoto: string = "";
    fotoNombre: string = "";
    fotoType: string = "";
    fotoFile: string = "";

    message: string = "";
    messages = [];

    //variables botones auxiliares maxinizar, cerrar
    minimizar = false;
    cerrar = true;
    //variables mensajes

    //nombreCarrera: string;
    // nombreMateria: string;
    nombreValue: string = "";
    mensajeValue: string = "";
    timeStamp: Date = new Date();

    mensaje: string = "";
    person: Persona;

    //cargar archivo
    form: FormGroup;
    //variable idPersona para tomar el usuario
    idPersona: string = "";
    arrayPersona = [];
    messagesRef: any;
    @ViewChild('refresh') refresh;
    @ViewChild('fileInput') fileInput;

    constructor(
        private fotoPerfilDataService: FotoPerfilService,
        private chatObtenerChatSalaService: ChatObtenerChatSalaService,
        private chatObtenerDocente: ChatObtenerDocenteService,
        private http: Http
    ) {
        this.messagesRef = firebase.database().ref("/mensajes");
    }

    canActivate(): Observable<boolean> {
        firebase.auth.apply;
        return;
    }

    checkForMessages() {
        this.messagesRef.on("value", snap => {
            let data = snap.val();
            this.getMessages();
            console.log("cambio en BDD");
            this.refresh.nativeElement.click();
        });
    }

    ngOnInit() {
        this.checkForMessages();
        const logedResult = JSON.parse(
            localStorage.getItem("logedResult")
        ) as LoginResult;

        this.personaLogeada = logedResult.persona;
        this.userName =
            this.personaLogeada.nombre1 +
            " " +
            this.personaLogeada.nombre2 +
            " " +
            this.personaLogeada.apellido1 +
            " " +
            this.personaLogeada.apellido2;
        this.getFotoPerfil();
        this.botonMinimizar();
        this.botonMaximizar();

        this.cerrar = true;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = "0";
        } else {
            this.showMenu = element;
        }
    }

    addAttachFile() {
        this.fileInput.nativeElement.click();
    }

    getFotoPerfil() {
        this.srcFotoPerfil = "assets/images/user.png";
        this.busy = this.fotoPerfilDataService
            .getFiltrado(
                "idPersona",
                "coincide",
                this.personaLogeada.id.toString()
            )
            .then(respuesta => {
                if (JSON.stringify(respuesta) == "[0]") {
                    return;
                }
                this.fotoFile = respuesta[0].adjunto;
                this.fotoNombre = respuesta[0].nombreArchivo;
                this.fotoType = respuesta[0].tipoArchivo;
                this.srcFotoPerfil =
                    "data:" + this.fotoType + ";base64," + this.fotoFile;
            })
            .catch(error => {});
    }

    botonMinimizar() {
        this.minimizar = true;
    }
    botonMaximizar() {
        this.minimizar = false;
    }

    botonCerrar() {
        this.cerrar = true;
    }
    botonAbrir() {
        this.cerrar = false;
    }


    CodificarArchivo(event) {
        this.userName;

        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.fotoNombre = file.name;
                this.fotoType = file.type;
                this.fotoFile = reader.result.split(",")[1];
                this.srcFoto =
                    "data:" + this.fotoType + ";base64," + this.fotoFile;
            };
        }
    }

    onFileChange(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.form.get("avatar").setValue({
                    filename: file.name,
                    filetype: file.type,
                    value: reader.result.split(",")[1]
                });
            };
        }
    }

    processWebImage(event) {
        let reader = new FileReader();
        reader.onload = readerEvent => {
            let imageData = (readerEvent.target as any).result;
        };

        let imagen = reader.readAsDataURL(event.target.files[0]);
        console.log(imagen);
    }

    sendMessage() {
        this.salaElegida = JSON.parse(sessionStorage.getItem("enviarSala"));
        let messageRef = firebase
            .database()
            .ref()
            .child("mensajes");
        if (this.fotoType == null) {
            this.fotoType = "image";
        } else {
            this.fotoType = this.fotoType.split("/")[0];
        }
        messageRef.push({
            nombre: "" + this.userName,
            mensaje: "" + this.message,
            fecha: "" + Date.now(),

            salaID: this.salaElegida,
            foto: "" + this.srcFoto,
            tipo: "" + this.fotoType
        });

        this.srcFoto = "";
        this.message = "";
    }

    getMessages() {
        this.salaElegida = JSON.parse(sessionStorage.getItem("enviarSala"));
        if (this.salaElegida == "nulo") {
            this.cerrar = true;
        } else {
            let messagesRef = firebase
                .database()
                .ref("/mensajes")
                .orderByChild("salaID")
                .equalTo(this.salaElegida + "");

            messagesRef.on("value", snap => {
                let data = snap.val();
                this.messages = [];
                for (let key in data) {
                    this.messages.push(data[key]);
                }
            });
            this.salaElegida = "";
            this.botonCerrar();
            this.botonAbrir();
        }
    }
    downloadFile(documento:object) {
        console.log("documentooooooooo "+documento);
let nombreDocumento: string;
let tipoDocumento: string;
let baseDocumento: string;
let rutaDocumento: string;
/*
      let reader = new FileReader();
      if (documento.length > 0) {
          const file = documento;
          reader.readAsDataURL(file);
          reader.onload = () => {
            nombreDocumento = file.name; 
            tipoDocumento = file.type;
            baseDocumento = reader.result.split(",")[1];
            rutaDocumento =
                  "data:" + this.fotoType + ";base64," + this.fotoFile;
          };
          
      }

      console.log("nombre "+nombreDocumento+" tipo "+tipoDocumento+" base "+baseDocumento+" ruta "+rutaDocumento);

      
      
      const byteCharacters = atob(tipoDocumento);
      console.log("entro al 2");
      const byteNumbers = new Array(byteCharacters.length);
      console.log("entro al 3");
      for (let i = 0; i < byteCharacters.length; i++) {
        console.log("entro al bucle");
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      console.log("entro al 4");
      const blob = new Blob([byteArray], { type: ''+tipoDocumento+'' });
      console.log("entro al 5");
      saveAs(blob, nombreDocumento);
      */
  }
  /*
  downloadFile() {
    const byteCharacters = atob(this.recursoDigital.adjunto);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: ''+this.recursoDigital.tipoArchivo+'' });
    saveAs(blob, this.recursoDigital.nombreArchivo);
}
*/
}
