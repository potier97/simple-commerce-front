import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
//Pages
import { LoginComponent } from '../pages/login/login.component';
import { PageNotFoundComponent } from '../pages/page-not-found/page-not-found.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { PaymentComponent } from '../pages/payment/payment.component';
import { CovenantComponent } from '../pages/covenant/covenant.component';
import { ProductsComponent } from '../pages/products/products.component'; 
import { NewProductComponent } from '../pages/new-product/new-product.component'; 
import { ClientsComponent } from '../pages/clients/clients.component';
import { OffersComponent } from '../pages/offers/offers.component';
import { InvocesComponent } from '../pages/invoces/invoces.component';
import { PayComponent } from '../pages/pay/pay.component';
import { MistakesComponent } from '../pages/mistakes/mistakes.component';
import { ProfileComponent } from '../pages/profile/profile.component';
//Guards
import { AuthGuard } from '../../app/guards/auth/auth.guard'
import { LoginGuard } from '../../app/guards/login/login.guard'
import { EditProductComponent } from '@app/pages/edit-product/edit-product.component';
import { NewCovenantComponent } from '@app/pages/new-covenant/new-covenant.component';
import { NewOfferComponent } from '@app/pages/new-offer/new-offer.component';
import { EditOfferComponent } from '@app/pages/edit-offer/edit-offer.component';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: '',
    component: NavigationComponent,  
    canActivateChild: [AuthGuard], 
    children: [
      { path: 'payment',   component: PaymentComponent,data: {title: 'Caja'} },
      { path: 'products', component: ProductsComponent, data: {title: 'Productos'} }, 
      { path: 'products/newProduct', component: NewProductComponent, data: {title: 'Nuevo Producto'} }, 
      { path: 'products/editProduct/:id', component: EditProductComponent, data: {title: 'Editar Producto'} }, 
      { path: 'clients', component: ClientsComponent, data: {title: 'Clientes'} },
      { path: 'offers', component: OffersComponent, data: {title: 'Ofertas'} }, 
      { path: 'offers/newOffer', component: NewOfferComponent, data: {title: 'Nueva Oferta'} }, 
      { path: 'offers/editOffer/:id', component: EditOfferComponent, data: {title: 'Editar Oferta'} },  
      { path: 'invoces', component: InvocesComponent, data: {title: 'Ventas'} },
      { path: 'covenants', component: CovenantComponent, data: {title: 'Convenios'} }, 
      { path: 'covenants/newCovenant', component: NewCovenantComponent, data: {title: 'Nuevo Convenio'} }, 
      { path: 'pay', component: PayComponent, data: {title: 'Pagos'} },
      { path: 'mistakes', component: MistakesComponent, data: {title: 'Errores'} }, 
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

 
 
 
