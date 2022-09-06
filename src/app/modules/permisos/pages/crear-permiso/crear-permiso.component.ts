import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup} from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';

// --------- SERVICIOS E INTERFACES ---------
import { LoaderService } from '@services/interceptors/loader.service';
import { PermisoService } from '@services/permisos/permiso.service';
import { TiposPermiso } from '@interfaces/tipos_permiso';
import { TipoPermisoService } from '@services/permisos/tipo-permiso.service';

@Component({
  selector: 'app-crear-permiso',
  templateUrl: './crear-permiso.component.html',
  styleUrls: ['./crear-permiso.component.scss']
})
export class CrearPermisoComponent implements OnInit {


  formPermiso: FormGroup;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null = null;
  model: NgbDateStruct | null = null;
  diaHabil:number = 0;


  today = this.calendar.getToday();
  files : any[]=[];
  archivos = [1];
  clicked = 0;
  error = '';
  submitted = false;

  // Loader
  isLoading: Subject<boolean> = this.loaderService.isLoading;

  // Tipos Permiso
  tiposPermiso$: Observable<TiposPermiso[]>;

  constructor(
    private formBuilder: FormBuilder,
    private calendar : NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private ngZone: NgZone,
    private router: Router,

    private loaderService: LoaderService,
    private permisosSvc: PermisoService,
    private tiposPermisoSvc: TipoPermisoService

  ) {
    // Tipos de permiso
    this.tiposPermiso$ = this.tiposPermisoSvc.getTiposPermiso();

    // Form permiso
    this.formPermiso = this.formBuilder.group({
      fecha_inicio : ['', [Validators.required]],
      fecha_fin : ['',[Validators.required]],
      justificacion : ['', [Validators.required,Validators.minLength(30),Validators.maxLength(350)]],
      tipos_permiso_id : [0,[Validators.required,Validators.min(1)]]
    });
    
    this.fromDate = null;
    this.toDate = null;
  }


  ngOnInit(): void {
  }



  // --------------------------------------
  // ------------- DATEPICKER -------------
  // --------------------------------------


  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.formPermiso.patchValue({
      fecha_inicio : this.formatter.format(this.fromDate),
      fecha_fin : this.formatter.format(this.toDate)
    });
  }


  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
        date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
        this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }


  // ----------- TIPOS DE PERMISOS ------------

  onTipoDePermiso(event:any){
    const idTipoPermiso = event;

    this.tiposPermisoSvc.getTipoPermisoId(idTipoPermiso).subscribe({
      next: (res) => {
        this.diaHabil = res.dias;
      }
    });
  }

  // ----------- MANEJO DE ERRORES EN EL FORM ------------
  get f() {
  
    return this.formPermiso.controls;
  }

  // --------------------------------------
  // -------- ARCHIVOS - ANEXOS -----------
  // --------------------------------------

  onUpload(event:Event, index: number) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if (file) {
      this.files.splice(index, 1, file);
    }
    console.log(this.files)

  }

  removeFile(index: number) {
    if (this.archivos.length > 1) {
    this.archivos.splice(index, 1);};
    this.files.splice(index, 1);
  }

  validSize() {
    const size = this.files.map(a => a.size).reduce((a, b) => a + b, 0);
    return size < 2 * 1024 * 1024;
  }

  isInvalidForm(controlName: string) {
    return this.formPermiso.get(controlName)?.invalid && this.formPermiso.get(controlName)?.touched;
  }


 // ----------------------------------------
 // ----------- CREAR PERMISO ------------
 // ----------------------------------------
 onSubmit() {

  this.submitted = true;
  
  // Se detiene aqui si el formulario es invalido
  if (this.formPermiso.invalid) {
    console.log('invalid form')
    return;
  }
  
  const body = {
    fecha_inicio: this.formPermiso.value.fecha_inicio,
    fecha_fin: this.formPermiso.value.fecha_fin,
    fecha_resolucion: new Date(this.formatter.format(this.today)),
    justificacion: this.formPermiso.value.justificacion,
    tipos_permiso_id: this.formPermiso.value.tipos_permiso_id
  }


  const reqBody: FormData = new FormData();
  reqBody.append('tipos_permiso_id', body.tipos_permiso_id);
  reqBody.append('fecha_inicio', body.fecha_inicio);
  reqBody.append('fecha_fin', body.fecha_fin);
  reqBody.append('justificacion', body.justificacion);

  for (const file of this.files) {
    reqBody.append('archivo', file, file.name) 
  }
  
  this.permisosSvc.postPermiso(reqBody).subscribe({
    next: (res) => { 
      Swal.fire({
        title: 'Creada',
        text: '¡El permiso se creó con éxito!',
        icon: 'success',
        confirmButtonColor: '#3AB795',
      });
      //ngZone: facilitate change detection
      this.ngZone.run(() =>
        this.router.navigateByUrl(`/home`)
      );
    },
    error: (err) => {
      if (err.status === 404 || err.status === 401) {
        this.error = err.error.msg;
      }
    }
  });
}

}
