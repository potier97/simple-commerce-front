import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from  '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtModule } from "@auth0/angular-jwt";
import { AppRoutingModule } from './core/app-routing.module';
import { AngularMaterialModule } from './core/angular-material.module'; 

//Services
import { AuthService } from './services/auth/auth.service'

//Guards
import { AuthGuard } from "./guards/auth/auth.guard";

//Components
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
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


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
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
    LoginComponent
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
  providers: [AuthService, AuthGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
