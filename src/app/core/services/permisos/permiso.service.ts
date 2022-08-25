
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Permiso, PermisosDTO, PermisosInside } from '@interfaces/permisos';
import { prefix } from '@shared/data/ruta-api';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  private urlEndPoint:string = prefix +'permisos';
  private urlEndPointArch:string = prefix +'archivarpermiso';
  
  getPermisos: any;

  constructor( private http: HttpClient) { }
  
  scopegetPermisos(archivado: number): Observable<any> {
    let params = new HttpParams()
    
    if (archivado != 2 ){
      params = params.append('archivado', archivado);
    }
    
    params = params.append('offset', 0);
    params = params.append('limit', 100);

    console.log(params+"  parametros")

    return this.http.get<Permiso[]>(`${this.urlEndPoint}`, {
      params:params
      
    } 
    
      
    )

 }
 
 getPermiso(id: string | number): Observable<any> {
    return this.http.get<PermisosInside>(`${this.urlEndPoint}/${id}`).pipe(
      map((res) => {
        return res;
      })
    ); 
  }

  patchPermiso(permiso:Permiso): Observable<Permiso> {
    return this.http.patch<Permiso>(`${this.urlEndPointArch}/${permiso.id}`,permiso)
    // .pipe(
      // map((resp)=> {
      //   return resp;
      // })
    // )
  }


  delete(id: string | number): Observable<any> {
    return this.http.delete<PermisosInside>(`${this.urlEndPoint}/${id}`);
  }


  crearPermiso(permiso:any) {

    return this.http.post<PermisosDTO>(this.urlEndPoint, permiso);
  }


  editarPermiso(id: string, paramList:any, files: File[], permiso:any): Observable<any> {

    // En el back: /api/permisoes/:id?request=[idDoc]
    
    const params = new HttpParams().set('require', paramList);
    permiso.archivo = files;

    return this.http.patch<PermisosDTO>(`${this.urlEndPoint}/${id}`, permiso, {params: params});

  }
}
