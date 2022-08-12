import { Component, Input, OnInit } from '@angular/core';
import { DexclusivaService } from '@services/dedicaciones/dexclusiva.service';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { CrearComisionComponentsService } from '../../services/crear-comision-components.service';

@Component({
  selector: 'app-crear-dedicacion',
  templateUrl: './crear-dedicacion.component.html',
  styleUrls: ['./crear-dedicacion.component.scss']
})
export class CrearDedicacionComponent implements OnInit {

  @Input()
  isLinear = false;

  @Input()
  isEditable = true;

  id$ : BehaviorSubject<Number> = new BehaviorSubject<Number>(0);

  constructor(
    private dexclusivaSvc: DexclusivaService,
    private comunicacionSvc : CrearComisionComponentsService
  ) { }

  ngOnInit(): void {
    Swal.fire({
      allowOutsideClick: false,
      title: '¡Bienvenido!',
      text: 'Para crear una nueva dedicación escribe una corta descripción solo como referencia para la aplicación.',
      input: 'text',
      preConfirm: (description) => {
        if (!description) {
          return Swal.showValidationMessage('Debes escribir una descripción');
        }
      }
    }).then((result) => {
      if (result.value) {
        this.dexclusivaSvc.postDexclusiva(result.value).subscribe(
          (data: any) => {
            this.comunicacionSvc.setId(data.dedicaciones_id);
          })
        Swal.fire({
          title: '¡Tu dedicación inició!',
          text: 'Ahora puedes empezar a crearla, el proceso es sencillo, en la parte izquierda verás un menú con 3 elementos que debes llenar para poder hacer la dedicación'
        });
      }
    })
  }

}
