import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Comision } from '@interfaces/comisiones';
import { Observable } from 'rxjs';
import { ultimoElement } from "@shared/clases/ultimo-estado";
import { NgbdSortableHeader, SortEvent } from '@shared/directivas/sortable.directive';
import { BuscarComisionesService } from '@services/busquedas/buscar-comisiones.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-buscar-comision',
  templateUrl: './buscar-comision.component.html',
  styleUrls: ['./buscar-comision.component.scss'],
  providers: [BuscarComisionesService, DecimalPipe]
})
export class BuscarComisionComponent {
  comisiones$: Observable<Comision[]>;
  total$: Observable<number>;
  ListComisiones = false;
  error='';
  ultimoElemento = ultimoElement


  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    public service: BuscarComisionesService,
    ) {
      this.comisiones$ = service.comisiones$;
      this.total$ = service.total$;
      this.ultimoElemento = ultimoElement;
    }


    onSort({column, direction}: SortEvent) {
      // resetting other headers
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
  
      this.service.sortColumn = "";
      this.service.sortDirection = direction;
    }

  }


  // public comisiones: Comision[] = [];
  // public page: number = 0;
  // public search: string = ''
  // ultimoElemento = ultimoElement

  // constructor(private solicitudService: SolicitudesService,
  //   ) { this.ultimoElemento = ultimoElement
    
  // }

  // ngOnInit(): void {

  //   this.solicitudService.buscarComisiones().subscribe(
  //     comisiones => this.comisiones = comisiones
  //   );

  //   // this.permisos = this.permisosService.getPermisos();

    
  // }

  // nextPage(){

  //   this.page += 5;

  // }

  // prevPage(){
  //   if(this.page > 0)
  //   this.page -= 5;

  // }

  // onSearchComision(search: string){
  //   this.search=  search;
  //   console.log(search)
  // }

 

    // console.log(this.termino)

   
  
  


