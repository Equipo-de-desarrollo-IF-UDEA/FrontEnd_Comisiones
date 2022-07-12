import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioInDB, UsuarioResponse } from '@interfaces/usuario';
import { prefix } from '@shared/data/ruta-api';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private cookie: CookieService,
    private route: Router,
    private http: HttpClient
  ) { }

  prefix = prefix + 'usuarios';

  getUsuario() {
    const basicUsuario = JSON.parse(this.cookie.get('usuario'));
    return this.http.get<UsuarioResponse>(`${this.prefix}/${basicUsuario.id}`);
  }

  getActualUsuario() {
    if (this.cookie.check('usuario')) {
      const basicUsuario = JSON.parse(this.cookie.get('usuario'));
      return basicUsuario;
    } else {
      this.route.navigate(['/login']);
      return false;
    }
  }

  getUsuariobyId(id:Number){
    return this.http.get<UsuarioResponse>(`${this.prefix}/${id}`);
  }
}
