import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentMethodData } from '@app/models/payment-method';
import { PayService } from '@app/services/pay/pay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pay-invoice-dialog',
  templateUrl: './pay-invoice-dialog.component.html',
  styleUrls: ['./pay-invoice-dialog.component.css']
})
export class PayInvoiceDialogComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  //Lista de todos los tipos de  pago
  methodsPayments: PaymentMethodData[] = [];
 
  angForm: FormGroup = new FormGroup({ 
    inputDataOne: new FormControl(''), 
    inputDataTwo: new FormControl(''), 
    inputDataThree: new FormControl(''), 
  });
  account_validation_messages = { 
    inputDataOne: [
      { type: 'required', message: 'Ingrese información válida' },
      { type: 'pattern', message: 'Ingrese información válida' }, 
    ],
    inputDataTwo: [
      { type: 'required', message: 'Ingrese información válida' },
      { type: 'pattern', message: 'Ingrese información válida' },
      { type: 'min', message: 'Ingrese información válida' },  
    ],
    inputDataThree: [
      { type: 'required', message: 'Seleccione el método de pago' }, 
    ]
  };  
  tittle: string;  

  constructor(
    private fb: FormBuilder,  
    private payService: PayService, 
    // public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnDestroy(): void {
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    }
  }

  
  ngOnInit(): void {

    if(this.data.methods) this.methodsPayments = this.data.methods
    else{
      this.subscription.push(
        this.payService.getAllMethodsPayments().subscribe(
          res => {
            this.methodsPayments = res.content;
            //console.log('LISTA DE METODOS DE PAGO ->', res.content)  
          },
          err => {
            console.log("Error al obtener los metodos de pago -> ", err)  
          }
        )  
      )
    }
    //console.log(this.methodsPayments)
    if(this.data.account_validation_messages) this.account_validation_messages = this.data.account_validation_messages; 
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
    }); 
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
