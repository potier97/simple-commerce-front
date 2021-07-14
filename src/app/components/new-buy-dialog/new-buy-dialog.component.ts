import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentTypeData } from '@app/models/payment-type';
import { PaymentMethodData } from '@app/models/payment-method';
import { FinancingTypesData } from '@app/models/financing-type';
import { PayService } from '@app/services/pay/pay.service';
import { OfferService } from '@app/services/offer/offer.service';
import { Subscription } from 'rxjs';
import { OfferData } from '@app/models/offer';
import { UserData } from '@app/models/user';

@Component({
  selector: 'app-new-buy-dialog',
  templateUrl: './new-buy-dialog.component.html',
  styleUrls: ['./new-buy-dialog.component.css']
})
export class NewBuyDialogComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  //Lista de todos los tipos de  pago
  paymentsTypes: PaymentTypeData[] = [];
  //Lista de todos los medios de  pago
  paymentsMethods: PaymentMethodData[] = [];
  //Listado de todos las cuotas por tipo de usuario
  financingTypes: FinancingTypesData[] = [];
  //Listado de todas las ofertas
  offers: OfferData[] = [];

  //SUBTOTAL DE LA COMPRA - SUMADO DE TODOS LOS PRODUCTOS SIN IVA NI DESCUENTOS
  subtotal: number = 0; 
  // TOTAL DEL IVA APLICADO A LA COMPRA
  tax: number = 0; 
  // TOTAL DEL COSTO DE LA COMPRA
  total: number = 0; 
  //DESCUENTOS APLICADO A LA  COMPRA
  discount: number = 0; 
  //INFORMACION DEL CLIENTE
  client: UserData; 
 
  angForm: FormGroup = new FormGroup({ 
    inputDataOne: new FormControl(''), 
    inputDataTwo: new FormControl(''), 
    inputDataThree: new FormControl(''), 
    inputDataFour: new FormControl(''), 
  });
  account_validation_messages = { 
    inputDataOne: [
      { type: 'required', message: 'Seleccione modo de pago' }, 
    ],
    inputDataTwo: [
      { type: 'required', message: 'Seleccione el número de cuotas' }, 
    ],
    inputDataThree: [
      { type: 'required', message: 'Seleccione el medio de pago' }, 
    ],
    inputDataFour: [
      { type: 'required', message: 'Ingrese la cuota Inicial' }, 
    ]
  };  
  tittle: string;  

  constructor(
    private fb: FormBuilder,  
    private offerService: OfferService, 
    private payService: PayService, 
    // public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subtotal = this.data.subtotal;
    this.tax = this.data.tax;
    this.total = this.data.total; 
    this.client = this.data.client;
    //CREANDO UN NUEVO FORMULARIO
    this.angForm = this.fb.group({ 
      inputDataOne: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
          Validators.pattern(this.data.constrainInputOne), 
        ])
      ), 
      inputDataTwo: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
          Validators.pattern(this.data.constrainInputTwo),
          Validators.min(1), 
        ])
      ), 
      inputDataThree: new FormControl(
        '',
        Validators.compose([ 
          Validators.required, 
        ])
      ),
      inputDataFour: new FormControl(
        '',
        Validators.compose([ 
          Validators.required, 
        ])
      ),
    }); 
  }

  ngOnDestroy(): void {
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    }
  }

  
  ngOnInit(): void {
    //Si no se obtiene la lista de los MÉTODOS de pago
    if(this.data.paymentsMethods) this.paymentsMethods = this.data.paymentsMethods
    else{
      this.subscription.push(
        this.payService.getAllMethodsPayments().subscribe(
          res => {
            this.paymentsMethods = res.content;
            console.log('MÉTODOS ->', res.content)  
          },
          err => {
            console.log("Error al obtener los MÉTODOS de pago -> ", err)  
          }
        )  
      )
    } 
    //Si no se obtiene la lista de los TIPOS de pago
    if(this.data.paymentsTypes) this.paymentsTypes = this.data.paymentsTypes
    else{
      this.subscription.push(
        this.payService.getAllTypesPayments().subscribe(
          res => {
            this.paymentsTypes = res.content;
            console.log('TIPOS DE PAGO ->', res.content)  
          },
          err => {
            console.log("Error al obtener los TIPOS de pago -> ", err)  
          }
        )  
      )
    }
    //Si no se obtiene la lista de las FINANCIACIÓN para pagos a credito
    if(this.data.financingTypes) this.financingTypes = this.data.financingTypes
    else{
      this.subscription.push(
        this.payService.getAllFinancingTypes().subscribe(
          res => {
            this.financingTypes = res.content;
            console.log('FINANCIACIÓN ->', res.content)  
          },
          err => {
            console.log("Error al obtener las FINANCICIÓN de pago -> ", err)  
          }
        )  
      )
    }
    //Si no se obtiene la lista de las OFERTAS
    if(this.data.offers) this.offers = this.data.offers
    else{
      this.subscription.push(
        this.offerService.getAllOffers().subscribe(
          res => {
            this.offers = res.content;
            console.log('OFERTAS ->', res.content)  
          },
          err => {
            console.log("Error al obtener las OFERTAS de pago -> ", err)  
          }
        )  
      )
    } 
  } 



  closeDialog(status: boolean): object {
    if(status){
      return {
        status,
        data: this.angForm.value
      }
    }else{
      return {
        status
      }
    }
  }
}
