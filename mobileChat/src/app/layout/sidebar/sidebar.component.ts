import { SalasService } from './../../services/salas.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  salas = [];

  constructor(private salasDataService: SalasService) { }

  ngOnInit() {
    this.getSalas(76);
  }

  getSalas(id: number) {
    this.salasDataService.getSalas(id).then( r => {
      this.salas = JSON.parse(r);
      console.log(this.salas);
    }).catch( e => console.log(e) );
  }

}
