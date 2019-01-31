import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MiembrosSalaPage } from './miembros-sala.page';
import { HttpModule } from '@angular/http';

const routes: Routes = [
  {
    path: '',
    component: MiembrosSalaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MiembrosSalaPage]
})
export class MiembrosSalaPageModule {}
