import { Injectable } from '@angular/core';

// importacion de http o httpClient segun la clase

import {Http, Headers, Response} from '@angular/http';

//importa la clace persona
import { ClasePersona  } from '../clases/Clase-Persona';

@Injectable({
  providedIn: 'root'
})
export class SalasService {

  constructor( private http: Http
      ) { }
      getSalas(id: number) {
        const data = { id: id };   
        return this.http.post('http://www.yavirac.edu.ec/ignug/server/chat/consultar_salas', JSON.stringify(data)).toPromise().then(
          respuesta => {
            return respuesta.json();
          }
        ).catch(
          error => {
            Promise.reject(error.message || error);
          }
        );
        
        
        }

 
}
