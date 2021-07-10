import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule, HTTP_INTERCEPTORS } from  '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtModule } from "@auth0/angular-jwt";
import { AppRoutingModule } from './core/app-routing.module';
import { AngularMaterialModule } from './core/angular-material.module';  

//Interceptors
import { JwtInterceptorInterceptor } from './interceptor/jwtInterceptor/jwt-interceptor.interceptor'

//Services
import { AuthService } from './services/auth/auth.service'

//Guards
import { AuthGuard } from "./guards/auth/auth.guard";
import { LoginGuard } from "./guards/login/login.guard";

//Components
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ProductsComponent } from './pages/products/products.component'; 
import { ClientsComponent } from './pages/clients/clients.component';
import { OffersComponent } from './pages/offers/offers.component';
import { InvocesComponent } from './pages/invoces/invoces.component';
import { PayComponent } from './pages/pay/pay.component';
import { CovenantComponent } from './pages/covenant/covenant.component';
import { MistakesComponent } from './pages/mistakes/mistakes.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component'; 
import { FilterDataPipe } from './pipes/filterData/filter-data.pipe';
import { NewProductComponent } from './pages/new-product/new-product.component';
import { CustomDialogComponent } from './components/custom-dialog/custom-dialog.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { NewCovenantComponent } from './pages/new-covenant/new-covenant.component';
import { NewOfferComponent } from './pages/new-offer/new-offer.component';
import { EditOfferComponent } from './pages/edit-offer/edit-offer.component';
import { NewClientComponent } from './pages/new-client/new-client.component';
import { EditClientComponent } from './pages/edit-client/edit-client.component';
import { ViewClientComponent } from './pages/view-client/view-client.component';
import { ViewMistakeComponent } from './pages/view-mistake/view-mistake.component'; 


@NgModule({
  declarations: [
    AppComponent, 
    PageNotFoundComponent,
    NavigationComponent,
    PaymentComponent,
    ProductsComponent,
    ClientsComponent,
    OffersComponent,
    InvocesComponent,
    PayComponent,
    CovenantComponent,
    MistakesComponent,
    ProfileComponent,
    LoginComponent, 
    FilterDataPipe,
    NewProductComponent,
    CustomDialogComponent,
    EditProductComponent,
    NewCovenantComponent,
    NewOfferComponent,
    EditOfferComponent,
    NewClientComponent,
    EditClientComponent,
    ViewClientComponent,
    ViewMistakeComponent
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
