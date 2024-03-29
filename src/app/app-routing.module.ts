import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KplListTableComponent } from './kpl-list-table/kpl-list-table.component';
import { PlayerDetailComponent } from './player-detail/player-detail.component';

const routes: Routes = [
  { path: '', component: KplListTableComponent },
  { path: 'player/:id', component: PlayerDetailComponent } // Route for detail page with player id parameter
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
