import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
//import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ProductsComponent } from './pages/products/products.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { OffersComponent } from './pages/offers/offers.component';
import { InvocesComponent } from './pages/invoces/invoces.component';
import { PayComponent } from './pages/pay/pay.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from '../app/guards/auth/auth.guard'

const routes: Routes = [
  { path: 'login', component: LogInComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: '',
    component: NavigationComponent,  
    canActivate: [AuthGuard],
    children: [
      { path: 'payment',   component: PaymentComponent,data: {title: 'Caja'} },
      { path: 'products', component: ProductsComponent, data: {title: 'Productos'} },
      { path: 'categories', component: CategoriesComponent, data: {title: 'Categorias'} },
      { path: 'clients', component: ClientsComponent, data: {title: 'Clientes'} },
      { path: 'offers', component: OffersComponent, data: {title: 'Ofertas'} },
      { path: 'invoces', component: InvocesComponent, data: {title: 'Ventas'} },
      { path: 'pay', component: PayComponent, data: {title: 'Pagos'} },
      { path: 'profile', component: ProfileComponent, data: {title: 'Perfil'} },
    ],
  }, 
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

 
 
 