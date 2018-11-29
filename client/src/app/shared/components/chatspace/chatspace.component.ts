import { Persona } from 'app/entidades/CRUD/Persona';
import { LoginResult } from './../../../entidades/especifico/Login-Result';
import { Component, OnInit } from '@angular/core';
import {FotoPerfilService} from 'app/CRUD/fotoperfil/fotoperfil.service';

@Component({
  selector: 'app-chatspace',
  templateUrl: './chatspace.component.html',
  styleUrls: ['./chatspace.component.scss']
})
export class ChatspaceComponent implements OnInit {
  minimizar = false;
  cerrar = false;
  busy: Promise<any>;
  showMenu = '';
  personaLogeada: Persona;
  userName = '';
  srcFoto: string;
  fotoNombre: string;
  fotoType: string;
  fotoFile: string;

  constructor(private fotoPerfilDataService: FotoPerfilService) { }

  ngOnInit() {
    const logedResult = JSON.parse(localStorage.getItem('logedResult')) as LoginResult;
    this.personaLogeada = logedResult.persona;
    this.userName = this.personaLogeada.nombre1 + ' ' + this.personaLogeada.nombre2 + ' ' + this.personaLogeada.apellido1 + ' ' + this.personaLogeada.apellido2;
    this.getFotoPerfil();
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
        this.showMenu = '0';
    } else {
        this.showMenu = element;
    }
  }

  getFotoPerfil() {
    this.srcFoto = 'assets/images/user.png';
    this.busy = this.fotoPerfilDataService.getFiltrado('idPersona', 'coincide', this.personaLogeada.id.toString())
        .then(respuesta => {
            if (JSON.stringify(respuesta) == '[0]') {
                return;
            }
            this.fotoFile = respuesta[0].adjunto;
            this.fotoNombre = respuesta[0].nombreArchivo;
            this.fotoType = respuesta[0].tipoArchivo;
            this.srcFoto = 'data:' + this.fotoType + ';base64,' + this.fotoFile;
        })
        .catch(error => {

        });
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
 
}
