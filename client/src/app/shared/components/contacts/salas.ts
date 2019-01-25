import { Miembro } from './miembros';

export class Salas {
    nombre: string;
    miembros: Miembro[];
    mensajesNuevos: number;
    constructor() {
        this.mensajesNuevos = 0;
    }
}
