import { environment } from "./../../../environments/environment";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FirebaseRoutingModule } from "./firebase-routing.module";
import { FirebaseComponent } from "./firebase.component";

import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { FormsModule } from "@angular/forms";
import { ProductoService } from "./servicios/producto.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FirebaseRoutingModule,
        AngularFireModule.initializeApp(environment.firebase2)
    ],
    declarations: [FirebaseComponent],
    providers: [ProductoService]
})
export class FirebaseModule {}
