import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from  '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtModule } from "@auth0/angular-jwt";
import { AppRoutingModule } from './app-routing.module';

//Services
import { AuthService } from './services/auth/auth.service'

//Guards
import { AuthGuard } from "./guards/auth/auth.guard";

//Components
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { LogInComponent } from './components/log-in/log-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ProductsComponent } from './pages/products/products.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { OffersComponent } from './pages/offers/offers.component';
import { InvocesComponent } from './pages/invoces/invoces.component';
import { PayComponent } from './pages/pay/pay.component';
import { CovenantComponent } from './pages/covenant/covenant.component';
import { MistakesComponent } from './pages/mistakes/mistakes.component';
import { ProfileComponent } from './pages/profile/profile.component'; 


@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    DashboardComponent,
    PageNotFoundComponent,
    NavigationComponent,
    PaymentComponent,
    ProductsComponent,
    CategoriesComponent,
    ClientsComponent,
    OffersComponent,
    InvocesComponent,
    PayComponent,
    CovenantComponent,
    MistakesComponent,
    ProfileComponent
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
