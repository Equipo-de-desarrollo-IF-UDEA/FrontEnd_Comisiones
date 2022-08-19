import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { pathToFileURL } from 'url';
import { VerPermisoComponent } from './pages/ver-permiso/ver-permiso.component';
import { CrearPermisoComponent } from './pages/crear-permiso/crear-permiso.component';
import { EditarPermisoComponent } from './pages/editar-permiso/editar-permiso.component';

const routes: Routes = [
  {
    path: 'ver-permiso/:id',
    component: VerPermisoComponent
  },

  {
    path: 'crear-permiso',
    component: CrearPermisoComponent
  },

  {
    path: 'editar-permiso/:id',
    component: EditarPermisoComponent
  },

  {
    path: 'asociar-estado/:id',
    component: EditarPermisoComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermisosRoutingModule { }


