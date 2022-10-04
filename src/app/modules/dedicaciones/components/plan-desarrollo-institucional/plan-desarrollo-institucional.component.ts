import { Component, Input, OnInit } from '@angular/core';
import { plandesarrollo, tema, objetivo, accion, indicador, ObjetivoTemaId } from '@interfaces/dedicaciones/plandesarrollo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { planDesarrolloFormat } from '@shared/data/plan-desarrollo';
import { prefix } from '@shared/data/ruta-api';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-plan-desarrollo-institucional',
  templateUrl: './plan-desarrollo-institucional.component.html',
  styleUrls: ['./plan-desarrollo-institucional.component.scss']
})




export class PlanDesarrolloInstitucionalComponent implements OnInit {

  @Input() planDesarrollo!: plandesarrollo;



  temas: tema[] = planDesarrolloFormat.temas;

  selectedPlanDesarrollo: plandesarrollo = {
    temas: []
  }


  selectedTema: number[] = [];

  selectedTemas: tema[] = [];

  selectedObjetivo: number[] = [];


  selectedObjetivos: ObjetivoTemaId[] = [];

  selectedAccion: number[] = [];


  acciones: any[] = [];

  selectedIndicadores: number[] = [];

  indicadores: any[] = [];

  logosurl = prefix + 'logos/';

  objetivos$: Subject<any[] | undefined> = new Subject();
  acciones$: Subject<any[] | undefined> = new Subject();
  inidcadores$: Subject<any[] | undefined> = new Subject();

  constructor(
    public activeModal: NgbActiveModal
  ) {
    if (this.planDesarrollo) {
      this.selectedPlanDesarrollo = this.planDesarrollo
      this.selectedTema = this.selectedPlanDesarrollo.temas.map(tema => tema.id)
      this.selectedTemas = this.selectedPlanDesarrollo.temas
      this.selectedObjetivo = this.selectedPlanDesarrollo.temas.map(tema => {
        return tema.objetivos.map(objetivo => objetivo.id)
      }).flat()
      this.selectedObjetivos = this.selectedPlanDesarrollo.temas.map(tema => {
        return tema.objetivos.map(objetivo => { return { ...objetivo, idTema: tema.id }})
      }).flat()
      this.selectedAccion = this.selectedObjetivos.map(objetivo =>{
        return objetivo.acciones.map(accion => accion.id)
      }).flat()
      this.selectedIndicadores = this.selectedObjetivos.map(objetivo =>{
        return objetivo.indicadores.map(indicador => indicador.id)
      }).flat()
    }
  }

  ngOnInit(): void {
  }

  selectTema(value: number, tema: tema) {
    if (this.selectedTema.indexOf(value) != -1) {
      let index = this.selectedTema.indexOf(value);
      this.selectedTema.splice(index, 1);
      this.selectedTemas.splice(index, 1)
      this.selectedPlanDesarrollo.temas.splice(index, 1)
    } else {
      this.selectedTema.push(value);
      this.selectedTemas.push(tema)
      this.selectedPlanDesarrollo.temas.push({
        id: value,
        titulo: this.temas[value].titulo,
        subtitulo: this.temas[value].subtitulo,
        objetivos: []
      })
    }
  }

  selectObjetivo(objetivo: objetivo, idTema: number) {
    let index = this.selectedObjetivo.indexOf(objetivo.id);
    if (index != -1) {
      this.selectedObjetivo.splice(index, 1);
      this.selectedObjetivos.splice(index, 1);
      let indexObjetivo = this.selectedPlanDesarrollo.temas[idTema].objetivos.indexOf(objetivo)
      this.selectedPlanDesarrollo.temas[idTema].objetivos.splice(indexObjetivo, 1)
    } else {
      this.selectedObjetivo.push(objetivo.id);
      this.selectedObjetivos.push({ ...objetivo, idTema: idTema });
      this.planDesarrollo.temas[idTema].objetivos.push({
        id: objetivo.id,
        descripcion: objetivo.descripcion,
        acciones: [],
        indicadores: []
      })
    }
  }

  selectAccion(accion: accion, idTema: number, idObjetivo: number) {
    let index = this.selectedAccion.indexOf(accion.id);
    if (index != -1) {
      this.selectedAccion.splice(index, 1);
      this.acciones.splice(index, 1);
      let indexAccion = this.selectedPlanDesarrollo.temas[idTema].objetivos[idObjetivo].acciones.indexOf(accion)
      this.selectedPlanDesarrollo.temas[idTema].objetivos[idObjetivo].acciones.splice(indexAccion, 1)
    } else {
      this.selectedAccion.push(accion.id)
      this.selectedPlanDesarrollo.temas[idTema].objetivos[idObjetivo].acciones.push(accion)
    }
  }

  selectIndicador(indicador: indicador, idTema: number, idObjetivo: number) {
    let index = this.selectedIndicadores.indexOf(indicador.id);
    if (index != -1) {
      this.selectedIndicadores.splice(index, 1);
      this.indicadores.slice(index, 1);
      let indexIndicador = this.selectedPlanDesarrollo.temas[idTema].objetivos[idObjetivo].indicadores.indexOf(indicador);
      this.selectedPlanDesarrollo.temas[idTema].objetivos[idObjetivo].indicadores.splice(indexIndicador, 1);
    } else {
      this.selectedIndicadores.push(indicador.id);
      this.selectedPlanDesarrollo.temas[idTema].objetivos[idObjetivo].indicadores.push(indicador);
    }

  }



  submit() {
  }

}
