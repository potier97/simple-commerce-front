import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule, HTTP_INTERCEPTORS } from  '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtModule } from "@auth0/angular-jwt";
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './core/angular-material.module';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

//Interceptors
import { JwtInterceptorInterceptor } from './interceptor/jwtInterceptor/jwt-interceptor.interceptor'

//Services
import { AuthService } from './services/auth/auth.service'

//Guards
import { AuthGuard } from "./guards/auth/auth.guard";
import { LoginGuard } from "./guards/login/login.guard";

//Components
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ProductsComponent } from './pages/products/products.component'; 
import { ClientsComponent } from './pages/clients/clients.component';
import { LoginComponent } from './pages/login/login.component';  
import { SingUpComponent } from './pages/singup/singup.component';
import { NewProductComponent } from './pages/new-product/new-product.component';
import { CustomDialogComponent } from './components/custom-dialog/custom-dialog.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { NewClientComponent } from './pages/new-client/new-client.component';
import { EditClientComponent } from './pages/edit-client/edit-client.component';
import { ViewInvoiceComponent } from './pages/view-invoice/view-invoice.component';
import { PayInvoiceDialogComponent } from './components/pay-invoice-dialog/pay-invoice-dialog.component';
import { CovenantInvoicesDialogComponent } from './components/covenant-invoices-dialog/covenant-invoices-dialog.component';
import { NewBuyDialogComponent } from './components/new-buy-dialog/new-buy-dialog.component';

// Registro del tipo de datos y region a Colombia
import localeCo from '@angular/common/locales/es-CO'
import { registerLocaleData } from '@angular/common';
import { PaidModesComponent } from './pages/paid-modes/paid-modes.component';
import { NewPaidModesComponent } from './pages/new-paid-modes/new-paid-modes.component';
import { EditPaidModesComponent } from './pages/edit-paid-modes/edit-paid-modes.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
registerLocaleData(localeCo);

@NgModule({
  declarations: [
    AppComponent, 
    PageNotFoundComponent,
    NavigationComponent,
    PaymentComponent,
    ProductsComponent,
    ClientsComponent,
    LoginComponent,  
    SingUpComponent,
    NewProductComponent,
    CustomDialogComponent,
    EditProductComponent,
    PaidModesComponent,
    NewPaidModesComponent,
    EditPaidModesComponent,
    NewClientComponent,
    InvoicesComponent,
    EditClientComponent,
    ViewInvoiceComponent,
    PayInvoiceDialogComponent,
    CovenantInvoicesDialogComponent,
    NewBuyDialogComponent, 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    FlexLayoutModule,  
    JwtModule, 
  ],
  providers: [
    AuthService, 
    AuthGuard,
    LoginGuard,
    {
      provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true
    },
    {
      provide: LOCALE_ID, useValue: "es-CO"
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
