import { Persona } from "./../../../entidades/CRUD/Persona";
import { FotoPerfilService } from "app/CRUD/fotoperfil/fotoperfil.service";
import { Component, OnInit, Input } from "@angular/core";
import { LoginResult } from "app/entidades/especifico/Login-Result";
import { PersonaService } from "app/CRUD/persona/persona.service";

@Component({
    selector: "app-contacts",
    templateUrl: "./contacts.component.html",
    styleUrls: ["./contacts.component.scss"]
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
    constructor(private fotoPerfilDataService: FotoPerfilService, private personaDataService: PersonaService) {}

    ngOnInit() {
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
