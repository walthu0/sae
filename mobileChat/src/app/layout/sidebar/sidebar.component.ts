import { SalasService } from './../../services/salas.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  salas = [];
  entidadSeleccionada: any;

  constructor(private salasDataService: SalasService) { }

  ngOnInit() {
    this.getSalas(76);
  }

  getSalas(id: number) {
    this.salasDataService.getSalas(id).then( r => {
      this.salas = JSON.parse(r);
      this.entidadSeleccionada = this.salas[0];
    }).catch( e => console.log(e) );
  }

  salaSeleccionada(sala: any) {
    this.entidadSeleccionada = sala;
    sessionStorage.setItem('idSala', JSON.stringify(sala.idSala));
    console.log("sala seleccionada "+sala.idSala);
    sessionStorage.setItem('sala', JSON.stringify(sala));
  }
}
