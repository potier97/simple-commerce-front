import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
//Pages
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SingUpComponent } from './pages/singup/singup.component';
import { NavigationComponent } from './components/navigation/navigation.component';
// import { PaymentComponent } from './pages/payment/payment.component';
import { ProductsComponent } from './pages/products/products.component'; 
// import { NewProductComponent } from './pages/new-product/new-product.component'; 
import { ClientsComponent } from './pages/clients/clients.component';
// import { NewClientComponent } from '@app/pages/new-client/new-client.component';
// import { EditClientComponent } from '@app/pages/edit-client/edit-client.component';
import { ViewInvoiceComponent } from '@app/pages/view-invoice/view-invoice.component';
import { PaidModesComponent } from '@app/pages/paid-modes/paid-modes.component';
// import { NewPaidModesComponent } from '@app/pages/new-paid-modes/new-paid-modes.component';
// import { EditPaidModesComponent } from '@app/pages/edit-paid-modes/edit-paid-modes.component';
// import { EditProductComponent } from '@app/pages/edit-product/edit-product.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';


//Guards
import { LoginGuard } from './guards/login/login.guard'
import { AuthGuard } from './guards/auth/auth.guard'


const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  { 
    path: 'singup', 
    component: SingUpComponent,
    canActivate: [LoginGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: '',
    component: NavigationComponent,  
    canActivateChild: [AuthGuard], 
    children: [
      { path: 'buy',   component: InvoicesComponent,data: {title: 'Facturas'} },
  //     { path: 'buy', component: InvocesComponent, data: {title: 'Ventas'} },
      { path: 'buy/datails/:id', component: ViewInvoiceComponent, data: {title: 'Detalle Factura'} },
      { path: 'products', component: ProductsComponent, data: {title: 'Productos'} }, 
  //     { path: 'products/newProduct', component: NewProductComponent, data: {title: 'Nuevo Producto'} }, 
  //     { path: 'products/editProduct/:id', component: EditProductComponent, data: {title: 'Editar Producto'} }, 
      { path: 'clients', component: ClientsComponent, data: {title: 'Clientes'} },
  //     { path: 'clients/newClient', component: NewClientComponent, data: {title: 'Nuevo Cliente'} },
  //     { path: 'clients/editClient/:id', component: EditClientComponent, data: {title: 'Editar Cliente'} },
      { path: 'paid-modes', component: PaidModesComponent, data: {title: 'Modos Pagos'} },
  //     { path: 'paid-modes/newPaidModes', component: NewPaidModesComponent, data: {title: 'Nuevo Cliente'} },
  //     { path: 'paid-modes/editPaidModes/:id', component: EditPaidModesComponent, data: {title: 'Editar Cliente'} },
    ],
  }, 
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

 
 
 
