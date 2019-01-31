import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-miembros-sala',
  templateUrl: './miembros-sala.page.html',
  styleUrls: ['./miembros-sala.page.scss'],
})
export class MiembrosSalaPage implements OnInit {

  sala: any;
  miembroSeleccionado: any;
  fotoSeleccionado: any;

  constructor(private http: Http) { }

  ngOnInit() {
    this.refreshSala();
  }

  refreshSala() {
    if (JSON.parse(sessionStorage.getItem('sala')) === null) {
      return false;
    }
    this.sala = JSON.parse(sessionStorage.getItem('sala'));
    return true;
  }

  seleccionarMiembro(miembro: any) {
    this.miembroSeleccionado = miembro;
    this.fotoSeleccionado = {tipoArchivo: null};
    this.getFotoPerfil(miembro.idPersona);
  }

  getFotoPerfil(id: number) {
    this.http.get(environment.api + 'fotoperfil/leer_filtrado?columna=idPersona&tipo_filtro=coincide&filtro=' + id.toString()).toPromise().then(
      r => {
        this.fotoSeleccionado = r.json()[0];
      }
    ).catch( e => console.log (e) );
  }
}
