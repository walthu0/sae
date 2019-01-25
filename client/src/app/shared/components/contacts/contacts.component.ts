import { FotoPerfil } from './../../../entidades/CRUD/FotoPerfil';
import { Persona } from "./../../../entidades/CRUD/Persona";
import { Carrera } from "./../../../entidades/CRUD/Carrera";
import { FotoPerfilService } from "app/CRUD/fotoperfil/fotoperfil.service";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { LoginResult } from "app/entidades/especifico/Login-Result";
import { PersonaService } from "app/CRUD/persona/persona.service";
import { ChatCarrerasService } from "app/shared/components/contacts/chat-carreras.service";
import { ChatConsultarSalasService } from "./../contacts/chat-consultar-salas.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Salas } from "./salas";
import { Miembro } from "./miembros";

@Component({
    selector: "app-contacts",
    templateUrl: "./contacts.component.html",
    styleUrls: ["./contacts.component.scss"],
    providers: [ChatCarrerasService, ChatConsultarSalasService, PersonaService]
})
export class ContactsComponent implements OnInit {
    busy: Promise<any>;
    showMenu = "";
    personaLogeada: Persona;
    userName = "";
    srcFoto: string;
    srcFotoPersonaSeleccionada: string;
    fotoNombre: string;
    fotoType: string;
    fotoFile: string;
    filtroComunidad: string;
    personasFiltroComunidad = [];
    carreras: Carrera[];
    salaElegida = "yavirac";
    salas: Salas[] = [];
    miembrosSeleccionado = [];
    miembroSeleccionado: Miembro = null;
    personaSolicitada: Persona = null;

    constructor(
        private chatConsultarSalasService: ChatConsultarSalasService,
        private fotoPerfilDataService: FotoPerfilService,
        private personaDataService: PersonaService,
        private chatCarrerasService: ChatCarrerasService,
        private modalService: NgbModal,
        private fotoDataService: FotoPerfilService,
    ) {}

    ngOnInit() {
        sessionStorage.setItem("enviarSala", JSON.stringify(this.salaElegida));
        console.log("OnInit Contacts", this.salaElegida);
        this.personaSolicitada = new Persona();
      

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

            this.chatConsultarSalasService
            //cambiar por el id de la persona logeada -------------------
                .getSalas(this.personaLogeada.id)
                .then(r => {
                    this.salas = JSON.parse(r) as Salas[];
                    this.salas.forEach(sala => {
                        sala.mensajesNuevos = 0;
                    });
                })
                .catch(e => console.log(e));
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
        sessionStorage.setItem("enviarSala", JSON.stringify(sala + ""));
        console.log("transformacion ", sala + "");
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
            .getFiltradoNombreCompleto(this.filtroComunidad)
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

    mostrarContactos(content, contactos) {
        this.miembrosSeleccionado = contactos;
        this.modalService
            .open(content, { size: 'lg' })
            .result.then(result => {}, result => {});
    }

    onSelect(entidadActual: Miembro): void {
        this.miembroSeleccionado = entidadActual;
        this.srcFotoPersonaSeleccionada = 'assets/images/user.png';
        this.personaSolicitada = new Persona();
        this.personaDataService.get(entidadActual.idPersona).then( r => {
            this.personaSolicitada = r;
        }).catch( e => console.log(e) );
        this.fotoDataService.getFiltrado('idPersona', 'coincide', entidadActual.idPersona.toString()).then( r => {
            this.srcFotoPersonaSeleccionada = 'data:' + r[0].tipoArchivo + ';base64,' + r[0].adjunto;
        }).catch( e => console.log(e) );
    }

    estaSeleccionado(porVerificar): boolean {
        if (this.miembroSeleccionado == null) {
            return false;
        }
        return porVerificar === this.miembroSeleccionado;
    }
}
