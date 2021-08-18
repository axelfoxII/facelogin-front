import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccesoPasswordComponent } from './auth/acceso-password/acceso-password.component';
import { LoginComponent } from './auth/login/login.component';
import { UploadFilesComponent } from './pages/upload-files/upload-files.component';

const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'acceso-password', component: AccesoPasswordComponent},
  {path:'upload-files', component: UploadFilesComponent},
  {path:'**', pathMatch:'full', redirectTo:'login'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
