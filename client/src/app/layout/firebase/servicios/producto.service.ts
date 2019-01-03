import { Injectable } from "@angular/core";
import { Producto } from "../modelos/producto";
import { AngularFireList, AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class ProductoService {
    productoList: AngularFireList<any>;
    productoSeleccionado: Producto;

    constructor(private firebase: AngularFireDatabase) {}

    leerProductos() {
        return (this.productoList = this.firebase.list("productos"));
    }

    crearProducto() {
        this.productoList.push(this.productoSeleccionado);
    }

    actualizarProducto() {
        this.productoList.update(this.productoSeleccionado.id, {
            nombre: this.productoSeleccionado.nombre,
            clase: this.productoSeleccionado.clase,
            precio: this.productoSeleccionado.precio
        });
    }

    borrarProducto(id: string) {
        this.productoList.remove(id);
    }
}
