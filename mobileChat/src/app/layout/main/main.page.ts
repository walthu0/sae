import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  user: any;
  srcFoto: string;
  constructor(private dataService: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user')).Persona;
    this.getFotoPerfil();
  }

  getFotoPerfil() {
    this.srcFoto = 'assets/images/user.png';
    this.dataService.foto(this.user.id)
        .then(respuesta => {
            if (JSON.stringify(respuesta) == '[0]') {
                return;
            }
            const fotoFile = respuesta[0].adjunto;
            const fotoNombre = respuesta[0].nombreArchivo;
            const fotoType = respuesta[0].tipoArchivo;
            this.srcFoto = 'data:' + fotoType + ';base64,' + fotoFile;
        })
        .catch(error => {
          this.srcFoto = 'assets/images/user.png';
        });
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
