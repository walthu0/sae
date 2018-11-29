import { LoginResult } from 'app/entidades/especifico/Login-Result';
import { Persona } from './../../../entidades/CRUD/Persona';
import { FotoPerfilService } from 'app/CRUD/fotoperfil/fotoperfil.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
    busy: Promise<any>;
    showMenu = '';
    personaLogeada: Persona;
    userName = '';
    srcFoto: string;
    fotoNombre: string;
    fotoType: string;
    fotoFile: string;


    aparecer: boolean = true;
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
  botonAparecer(){
if(this.aparecer == true){
    this.aparecer = false;
}else{
    this.aparecer = true;
}
  }

}
