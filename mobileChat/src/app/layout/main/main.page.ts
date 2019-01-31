import { AuthService } from "./../../services/auth.service";
import { Router } from "@angular/router";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule
} from "@angular/forms";
import { ToastController, NavController, NavParams } from "@ionic/angular";
import { saveAs } from "file-saver/FileSaver";
//clases
import { ClasePersona } from "../../clases/Clase-Persona";
import { Salas } from "../../clases/salas";

// Servicio
import { SalasService } from "../../services/salas.service";
// instancia a la Base de datos
import * as firebase from "firebase";

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"]
})
export class MainPage implements OnInit {
  @ViewChild("fileInput") fileInput;
  user: any;
  srcFoto: string;

  userName: string = "";
  srcFotoPerfil: string = "";

  form: FormGroup;

  fotoNombre: string = "";
  fotoType: string = "";
  fotoFile: any = "";
  fotoArchivo: string = "";
  message: string = "";
  messages = [];
  messagesRef: any;

  salaElegida: any = "yavirac";

  salas: Salas[] = [];
  @ViewChild("refresh") refresh;

  constructor(
    public navCtrl: NavController,
    private dataService: AuthService,
    private router: Router,
    private http: Http,
    private salaService: SalasService
  ) {
    this.user = JSON.parse(sessionStorage.getItem("user")).Persona;
    this.userName =
      this.user.nombre1 +
      " " +
      this.user.nombre2 +
      " " +
      this.user.apellido1 +
      " " +
      this.user.apellido2;
    console.log(this.userName);
    this.salaService
      .getSalas(this.user.id)
      .then(r => {
        this.salas = JSON.parse(r) as Salas[];
        console.log("salas " + this.salas[0]);
      })
      .catch(e => console.log(e));


  }

 
  checkForMessages() {
      
  
  this.messagesRef = firebase
    .database()
    .ref("/mensajes")
    .orderByChild("salaID")
    .equalTo(this.salaElegida);
    this.messagesRef.on("value", snap => {
        let data = snap.val();
        this.getMessages();
        console.log("cambio en BDD");
        if ( typeof this.refresh !== 'undefined') {
            this.refresh.nativeElement.click();
        }
    });
}


  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem("user")).Persona;
    this.getFotoPerfil();
    this.isSalaSelected();
  }

  getFotoPerfil() {
    this.srcFoto = "assets/images/user.png";
    this.dataService
      .foto(this.user.id)
      .then(respuesta => {
        if (JSON.stringify(respuesta) == "[0]") {
          return;
        }
        const fotoFile = respuesta[0].adjunto;
        const fotoNombre = respuesta[0].nombreArchivo;
        const fotoType = respuesta[0].tipoArchivo;
        this.srcFoto = "data:" + fotoType + ";base64," + fotoFile;
      })
      .catch(error => {
        this.srcFoto = "assets/images/user.png";
      });
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(["/login"]);
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
        this.fotoFile = reader.result.toString().split(",")[1];
        this.srcFoto = this.fotoFile;
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

          value: reader.result.toString().split(",")[1]
        });
      };
      console.log("tipo de archivo " + file.type);
    }
  }

  getMessages() {
   
    this.salaElegida = JSON.parse(sessionStorage.getItem('idSala'));
    let messagesRef = firebase
      .database()
      .ref("/mensajes")
      .orderByChild("salaID")
      .equalTo(this.salaElegida);

    messagesRef.on("value", snap => {
      let data = snap.val();
      this.messages = [];
      for (let key in data) {
        this.messages.push(data[key]);
      }
    });
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

  sendMessage() {
    let empty = "";


    if (this.message.trim == null) {
      alert("No puede enviar un mensaje vacio");
      this.message = "";
    } else {

        this.salaElegida = JSON.parse(sessionStorage.getItem('idSala'));
     
      let messageRef = firebase
        .database()
        .ref()
        .child("mensajes");
      //validacion tipo nulo
      if (this.fotoType === "") {
        this.fotoType = "image";
        this.fotoNombre = "documento";
      }
      messageRef.push({
        nombre: "" + this.userName,
        mensaje: "" + this.message,
        fecha: "" + Date.now(),

        salaID: this.salaElegida,
        foto: "" + this.srcFoto,
        nomDoc: "" + this.fotoNombre,
        tipo: "" + this.fotoType
      });

      this.srcFoto = "";
      this.message = "";
      this.fotoType = "image";
      this.fotoNombre = "";
    }
  }

  isSalaSelected(): Boolean {
      if (JSON.parse(sessionStorage.getItem('idSala')) === null) {
          this.salaElegida = "yavirac";
          this.checkForMessages();
          return false;
      }
      this.salaElegida = JSON.parse(sessionStorage.getItem('idSala'));
      this.checkForMessages();
      return true;
  }
}
