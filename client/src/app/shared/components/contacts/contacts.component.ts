import { Persona } from "./../../../entidades/CRUD/Persona";
import { Carrera } from "./../../../entidades/CRUD/Carrera";
import { FotoPerfilService } from "app/CRUD/fotoperfil/fotoperfil.service";
import { Component, OnInit, Input, ViewChild  } from "@angular/core";
import { LoginResult } from "app/entidades/especifico/Login-Result";
import { PersonaService } from "app/CRUD/persona/persona.service";
import { ChatCarrerasService } from "app/shared/components/contacts/chat-carreras.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { ChatConsultarSalasService } from "./../contacts/chat-consultar-salas.service";

@Component({
    selector: "app-contacts",
    templateUrl: "./contacts.component.html",
    styleUrls: ["./contacts.component.scss"],
    providers: [ChatCarrerasService, ChatConsultarSalasService ]
})
export class ContactsComponent implements OnInit {
    

    
    busy: Promise<any>;
    showMenu = "";
    personaLogeada: Persona;
    userName = "";
    srcFoto: string;
    fotoNombre: string;
    fotoType: string;
    fotoFile: string;
    filtroComunidad: string;
    personasFiltroComunidad = [];
    carreras: Carrera[];
    salaElegida = "TODOScontacts"
    salas = [];
   

    constructor(private chatConsultarSalasService: ChatConsultarSalasService, private fotoPerfilDataService: FotoPerfilService, private personaDataService: PersonaService, private chatCarrerasService: ChatCarrerasService) {

       
    }

    ngOnInit() {
      
        
        sessionStorage.setItem("enviarSala", JSON.stringify(this.salaElegida));
        console.log("OnInit Contacts",this.salaElegida);
        this.chatConsultarSalasService.getSalas(76).then(
            r => {
               this.salas = JSON.parse(r);
            }
        ).catch( e=> console.log(e) );
     
     
        
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

           
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = "0";
        } else {
            this.showMenu = element;
        }
    }

    refreshContactVisibleState() {
        const estado = JSON.parse(
            localStorage.getItem("contactSpaceVisibleState")
        ) as Boolean;
        return estado;
    }

    salaSeleccionada(sala) {
        
        sessionStorage.setItem("enviarSala", JSON.stringify(sala+""));
        console.log("transformacion ",sala+"");
      //  var nom = this.carreras.map(({ nombre }) => nombre);
      
       // this.salaElegida = (nom+"")
       // console.log("sera ",this.salaElegida);
       

    }

    searchPersonas() {
        this.personasFiltroComunidad = [];
        if (this.filtroComunidad.length < 3) {
            return;
        }
        this.busy = this.personaDataService
            .getFiltradoNombreCompleto(
                this.filtroComunidad
            )
            .then(respuesta => {
                if (JSON.stringify(respuesta) == "[0]") {
                } else {
                    respuesta.forEach(persona => {
                        this.personasFiltroComunidad.push(persona);
                    });
                }
            })
            .catch(error => {});
    }
   
}
