import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentTypeData } from '@app/models/payment-type';
import { PaymentMethodData } from '@app/models/payment-method';
import { FinancingTypesData } from '@app/models/financing-type';  

@Component({
  selector: 'app-new-buy-dialog',
  templateUrl: './new-buy-dialog.component.html',
  styleUrls: ['./new-buy-dialog.component.css']
})
export class NewBuyDialogComponent implements OnInit {
 
  //Lista de todos los tipos de  pago
  paymentsTypes: PaymentTypeData[] = [];
  //Lista de todos los medios de  pago
  paymentsMethods: PaymentMethodData[] = [];
  //Listado de todos las cuotas por tipo de usuario
  financingTypes: FinancingTypesData[] = [];

  //SUBTOTAL DE LA COMPRA - SUMADO DE TODOS LOS PRODUCTOS SIN IVA NI DESCUENTOS
  subtotal: number = 0; 
  // TOTAL DEL IVA APLICADO A LA COMPRA
  tax: number = 0; 
  // TOTAL DEL COSTO DE LA COMPRA
  total: number = 0; 
  //PORCENTAJE DE DESCUENTO
  discountPercentage: number = 0;   
  //DESCUENTOS APLICADO A LA  COMPRA
  discount: number = 0;  
 
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
      { type: 'required', message: 'Ingrese el valor de la cuota inicial' }, 
      { type: 'pattern', message: 'Ingrese solo números' },
    ]
  };  
  tittle: string;  

  constructor(
    private fb: FormBuilder,   
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subtotal = this.data.subtotal;
    this.tax = this.data.tax;
    this.total = this.data.total;  
    //Lista de las FINANCIACIÓN para pagos a credito para ese usuario
    this.financingTypes = this.data.financingTypes;
    this.discountPercentage = this.data.discountPercentage; 
    //TIPOS de pago
    this.paymentsTypes = this.data.paymentsTypes   
    //MÉTODOS de pago
    this.paymentsMethods = this.data.paymentsMethods
    
    //CREANDO UN NUEVO FORMULARIO
    this.angForm = this.fb.group({ 
      inputDataOne: new FormControl(
        this.data.paymentsTypes[0],   // TIPO DE PAGO - CONTADO O A CREDITO
        Validators.compose([ 
          Validators.required, 
        ])
      ), 
      inputDataTwo: new FormControl(
        this.data.financingTypes[0],  // NUMERO DE CUOTAS
        Validators.compose([ 
          
        ])
      ), 
      inputDataThree: new FormControl(
        this.data.paymentsMethods[0], // MEDIO DE PAGO - EFECTIVO - COMBINADO - TARJETA
        Validators.compose([ 
          Validators.required, 
        ])
      ),
      inputDataFour: new FormControl(
        {value: 0, disabled: true},  // CUOTA INICIAL
        Validators.compose([  
          Validators.pattern('^[0-9]*$'), 
        ])
      ),
    }); 
  }
 

  //Realizar o aplicar el descuento cuando la compra es de CONTADO
  async onGetDiscount(): Promise<void> { 
    this.discount = await this.discountPercentage > 0 ? this.total*(this.discountPercentage /100) : 0
    this.total = await this.subtotal + this.tax - this.discount
  }

  //Realizar o aplicar el valor sin el descuento CREDITO
  async onGetWitOutDiscount(): Promise<void> { 
    this.discount = 0
    this.total = await this.subtotal + this.tax;
  } 
 
  ngOnInit(): void { 
    //console.log("this.angForm.value.idPayType ", this.angForm.value )
    if(this.angForm.value.inputDataOne.idPayType === 1) this.onGetDiscount()
    else  this.onGetWitOutDiscount()
  } 

  //Reset cuando se cambie el tipo  de compra
  changeTypePayment(value: any): void {
    if(value.idPayType === 1) this.onGetDiscount()
    else  this.onGetWitOutDiscount()
    // this.angForm.controls["inputDataTwo"].reset();
    // this.angForm.controls["inputDataFour"].reset(); 
    // this.angForm.controls["inputDataTwo"].setValue("");  
    // this.angForm.controls["inputDataFour"].setValue("");   
  }
 

  closeDialog(status: boolean): object {
    if(status){
      const data = {
        subtotal: this.subtotal,
        tax: this.tax,
        total: this.total,
        discountPercentage: this.discountPercentage,
        discount: this.discount,
        ...this.angForm.value
      } 
      return {
        status,
        data: data
      }
    }else{
      return {
        status
      }
    }
  }
}
