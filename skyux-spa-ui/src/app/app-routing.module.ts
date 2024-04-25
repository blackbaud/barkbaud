import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRouteIndexComponent } from './auth/index.component';
import { DogsIdRouteIndexComponent } from './dogs/_id/index.component';
import { DogsRouteIndexComponent } from './dogs/index.component';
import { RootRouteIndexComponent } from './index.component';
import { AppRouteGuard } from './index.guard';
import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: RootRouteIndexComponent },
      { path: 'dogs', component: DogsRouteIndexComponent },
      { path: 'dogs/:id', component: DogsIdRouteIndexComponent },
      { path: 'auth', component: AuthRouteIndexComponent }
    ],
    canActivate: [AppRouteGuard],
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AppRouteGuard],
})
export class AppRoutingModule { }
