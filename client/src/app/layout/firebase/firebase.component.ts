import { Component, OnInit } from "@angular/core";
import { ProductoService } from "./servicios/producto.service";
import { Producto } from "./modelos/producto";

@Component({
    selector: "app-firebase",
    templateUrl: "./firebase.component.html",
    styleUrls: ["./firebase.component.scss"]
})
export class FirebaseComponent implements OnInit {
    productos: Producto[];

    constructor(public productoService: ProductoService) {}

    ngOnInit() {
        this.reset();
    }

    aceptar() {
        if (this.productoService.productoSeleccionado.id == null) {
            this.productoService.crearProducto();
        } else {
            this.productoService.actualizarProducto();
        }
        this.reset();
    }

    reset() {
        this.productoService
            .leerProductos()
            .snapshotChanges()
            .subscribe(item => {
                this.productos = [];
                item.forEach(element => {
                    let productoLeido: Producto;
                    productoLeido = element.payload.toJSON() as Producto;
                    productoLeido.id = element.key;
                    this.productos.push(productoLeido as Producto);
                });
            });
        this.productoService.productoSeleccionado = new Producto();
    }

    editar(producto: Producto) {
        this.productoService.productoSeleccionado = Object.assign({}, producto);
    }

    borrar(producto: Producto) {
        this.productoService.borrarProducto(producto.id);
        this.productoService.productoSeleccionado = new Producto();
    }
}
