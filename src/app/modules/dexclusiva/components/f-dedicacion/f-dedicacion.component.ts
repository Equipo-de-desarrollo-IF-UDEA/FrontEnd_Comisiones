import { Component, Input, OnInit } from '@angular/core';
import { Dexclusiva } from '@interfaces/dexclusiva';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DexclusivaService } from '@services/dedicaciones/dexclusiva.service';
import { CookieService } from 'ngx-cookie-service';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { UsuarioService } from '@services/usuarios/usuario.service';
import { Usuario } from '@interfaces/usuario';
import { LoaderService } from '@services/interceptors/loader.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CrearComisionComponentsService } from '../../services/crear-comision-components.service';
import Swal from 'sweetalert2';
// import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas);

@Component({
  selector: 'app-f-dedicacion',
  templateUrl: './f-dedicacion.component.html',
  styleUrls: ['./f-dedicacion.component.scss']
})
export class FDedicacionComponent implements OnInit {

  @Input() Dedicacion : Dexclusiva | null = null;


  isLoading: Subject<boolean> = this.loadingSvc.isLoading;
  constructor(
    private fb : FormBuilder,
    private dexclusivaSvc: DexclusivaService,
    private usuarioSvc: UsuarioService,
    private loadingSvc : LoaderService,
    private comunicationSvc : CrearComisionComponentsService
  ) { }
  
  public unidades = [
    'Instituto de Química, Facultad de Ciencias Exactas y Naturales',
  ]

  public campos = [
    'Docencia',
    'Extensión',
    'Investigación',
    'Administración'
  ]

  public Usuario = this.usuarioSvc.getActualUsuario();

  private isCorreoValid = /^[a-zA-Z0-9._%+-]+@udea.edu.co$/;
  private fExclusiva : Dexclusiva = {
    titulo: '',
    tiempo_solicitado: 0,
    campo_modalidad: '',
    descripcion_comprobante: '',
    tema_estrategico: [],
    objetivo_estrategico_desarrollo: [],
    metas: [],
    indicador: [],
    acciones_estrategicas: [],
    objetivo_estrategico_institucional: [],
    productos: []

  };

  fBasicInfo = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    identificacion: [Number, [Validators.required, Validators.min(1000), Validators.max(999999999999)]],
    extension_oficina: ['', [Validators.minLength(3), Validators.maxLength(255)]],
    celular: [Number, [Validators.min(1000000000), Validators.max(9999999999)]],
    correo: ['',[Validators.required, Validators.pattern(this.isCorreoValid)]],
    titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    tiempo_solicitado: [Number, [Validators.required, Validators.min(1), Validators.max(11)]],
    campo_modalidad: ['', [Validators.required , Validators.minLength(3), Validators.maxLength(50000)]],
    descripcion_comprobante: ['',[Validators.minLength(3), Validators.maxLength(255)]],
    tema_estrategico: this.fb.array([this.temasgroup()],[Validators.required]),
    objetivo_estrategico_desarrollo: this.fb.array([this.objEstrategicasgroup()],[Validators.required]),
    metas: this.fb.array([this.metasgroup()],[Validators.required]),
    acciones_estrategicas: this.fb.array([this.acciones_estrategicasgroup()],[Validators.required]),
    objetivo_estrategico_institucional: this.fb.array([this.objetivo_estrategico_institucionalgroup()],[Validators.required]),
    indicador: this.fb.array([this.indicadorgroup()],[Validators.required]),
    productos: this.fb.array([this.productosgroup()],[Validators.required]),
  })

  ngOnInit(): void {
    this.fBasicInfo.patchValue(this.Usuario);
    this.fBasicInfo.controls['nombre'].disable();
    this.fBasicInfo.controls['apellido'].disable();
    this.fBasicInfo.controls['identificacion'].disable();
    this.fBasicInfo.controls['correo'].disable();

    if (this.Dedicacion) {
      this.fBasicInfo.patchValue(this.Dedicacion);
    }
  }

  onSubmit(){
    let {nombre, apellido, identificacion, correo, ...others} = this.fBasicInfo.value;
    this.fExclusiva = others;
    let dedicacion_id : number | string = 0;

    this.comunicationSvc.id$.subscribe(
      (      id: string | number) => {
        dedicacion_id = id;
      }
    )
    console.log(dedicacion_id);
    this.dexclusivaSvc.postFormulario(this.fExclusiva, dedicacion_id).subscribe(
      (res : any) => {
        if (res){
          Swal.fire({
            text: 'Formato generado con éxito',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }
          )
        }
      }
    );
  }

  temasgroup() {
    return this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  get temasArr() : FormArray {
    return this.fBasicInfo.get('tema_estrategico') as FormArray;
  }
  addInputTemas() {
    this.temasArr.push(this.temasgroup());
  }


  // Objetivos Estrategicos
  objEstrategicasgroup() {
    return this.fb.group({
      objEstrategico: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  get objEstrategicosArr() : FormArray {
    return this.fBasicInfo.get('objetivo_estrategico_desarrollo') as FormArray;
  }

  addInputObjEstrategicos() {
    this.objEstrategicosArr.push(this.objEstrategicasgroup());
  }




// Metas

  metasgroup() {
    return this.fb.group({
      meta: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }


  get metasArr() : FormArray {
    return this.fBasicInfo.get('metas') as FormArray;
  }
  addInputMetas() {
    this.metasArr.push(this.metasgroup());
  }

// Acciones Estrategicas
  acciones_estrategicasgroup() {
    return this.fb.group({
      accion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }


  get acciones_estrategicasArr() : FormArray {
    return this.fBasicInfo.get('acciones_estrategicas') as FormArray;
  }
  addInputacciones_estrategicas() {
    this.acciones_estrategicasArr.push(this.acciones_estrategicasgroup());
  }


  // Objetivo Estrategico Institucional
  objetivo_estrategico_institucionalgroup() {
    return this.fb.group({
      objetivo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  get objetivo_estrategico_institucionalArr() : FormArray {
    return this.fBasicInfo.get('objetivo_estrategico_institucional') as FormArray;
  }

  objetivo_estrategico_institucional() {
    this.objetivo_estrategico_institucionalArr.push(this.objetivo_estrategico_institucionalgroup());
  }

  // Indicador
  indicadorgroup() {
    return this.fb.group({
      indicador: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  get indicadorArr() : FormArray {
    return this.fBasicInfo.get('indicador') as FormArray;
  }

  addInputIndicador() {
    this.indicadorArr.push(this.indicadorgroup());
  }


// Productos

  productosgroup() {
    return this.fb.group({
      producto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  get productosArr() : FormArray {
    return this.fBasicInfo.get('productos') as FormArray;
  }

  addInputProductos() {
    this.productosArr.push(this.productosgroup());
  }


// Eliminar del control
  removeInput(controlName: string, index: number) {
    const control = this.fBasicInfo.get(controlName) as FormArray;
    control.removeAt(index);
  }



  
  isInvalidForm(controlName: string) {
    return this.fBasicInfo.get(controlName)?.invalid && this.fBasicInfo.get(controlName)?.touched;
  }
  
}
