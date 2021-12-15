import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
//Pages

//INICIO SESION
import { LoginComponent } from './pages/login/login.component';

//CREAR REGISTRO
import { SingUpComponent } from './pages/singup/singup.component';

//PÁGINA NO ENCONTRADA
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

//VENTANA GLOBAL
import { NavigationComponent } from './components/navigation/navigation.component';

//FACTURAS
import { PaymentComponent } from './pages/payment/payment.component';
import { ViewInvoiceComponent } from './pages/view-invoice/view-invoice.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';

//METODO DE PAGO
import { PaidModesComponent } from './pages/paid-modes/paid-modes.component';
import { NewPaidModesComponent } from './pages/new-paid-modes/new-paid-modes.component';
import { EditPaidModesComponent } from './pages/edit-paid-modes/edit-paid-modes.component';

//CLIENTES
import { ClientsComponent } from './pages/clients/clients.component';
import { NewClientComponent } from './pages/new-client/new-client.component';
import { EditClientComponent } from './pages/edit-client/edit-client.component';

//PRODUCTOS
import { ProductsComponent } from './pages/products/products.component'; 
import { NewProductComponent } from './pages/new-product/new-product.component'; 
import { EditProductComponent } from './pages/edit-product/edit-product.component';

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
      { path: 'buy/new', component: PaymentComponent, data: {title: 'Nueva Venta'} },
      { path: 'buy/datails/:id', component: ViewInvoiceComponent, data: {title: 'Detalle Factura'} },
      { path: 'products', component: ProductsComponent, data: {title: 'Productos'} }, 
      { path: 'products/newProduct', component: NewProductComponent, data: {title: 'Nuevo Producto'} }, 
      { path: 'products/editProduct/:id', component: EditProductComponent, data: {title: 'Editar Producto'} }, 
      { path: 'clients', component: ClientsComponent, data: {title: 'Clientes'} },
      { path: 'clients/newClient', component: NewClientComponent, data: {title: 'Nuevo Cliente'} },
      { path: 'clients/editClient/:id', component: EditClientComponent, data: {title: 'Editar Cliente'} },
      { path: 'paid-modes', component: PaidModesComponent, data: {title: 'Modo de pago'} },
      { path: 'paid-modes/newPaidModes', component: NewPaidModesComponent, data: {title: 'Nuevo Modo de pago'} },
      { path: 'paid-modes/editPaidModes/:id', component: EditPaidModesComponent, data: {title: 'Editar Modo de pago'} },
    ],
  }, 
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

 
 
 
