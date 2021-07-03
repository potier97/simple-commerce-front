import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '@app/services/products/products.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];

  angForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    idCode: new FormControl(''),
    amount: new FormControl(''),
    tax: new FormControl(''),
    price: new FormControl(''),
  });

  constructor( 
    private snackbar: MatSnackBar, 
    private fb: FormBuilder,  
    private router: Router,
    private productService: ProductsService) { }

  account_validation_messages = {
    name: [
      { type: 'required', message: 'Ingrese el nombre del producto' }, 
      { type: 'maxlength', message: 'El nombre es demasiado grande' }, 
    ],
    idCode: [
      { type: 'required', message: 'Ingrese el DNI del producto' },
      { type: 'pattern', message: 'Ingrese un código valido de solo números' },
    ],
    amount: [
      { type: 'required', message: 'Ingrese la cantidad de productos disponibles' },
      { type: 'pattern', message: 'Ingrese una cantidad valida (solo números)' },
      { type: 'min', message: 'Ingrese un valor positivo' },  
    ], 
    tax: [
      { type: 'required', message: 'Ingrese el Impuesto al consumidor' },
      { type: 'pattern', message: 'Ingrese un porcentaje valido de solo números' },
      { type: 'min', message: 'Ingrese un valor positivo' },  
    ],
    price: [
      { type: 'required', message: 'Contraseña requerida' },
      { type: 'pattern', message: 'Ingrese un precio valido de solo números' },
      { type: 'min', message: 'Ingrese un valor positivo' },  
    ],
  }; 


  ngOnDestroy(): void {
    //console.log("Desubs all observers") 
    for(const sub of this.subscription) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void { 
    this.angForm = this.fb.group({
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required, 
          Validators.maxLength(30),
        ])
      ),
      idCode: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ])
      ),
      amount: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1), 
        ])
      ),
      tax: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(0), 
        ])
      ),
      price: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1), 
        ])
      ),
    }); 
  }

  createProduct(): void {
    if (this.angForm.valid) {
      const userReq = this.angForm.value;
      const productData = {
        idProduct: 0,
        name: userReq.name,
        idCode: userReq.idCode,
        amount: userReq.amount,
        active: 1,
        price: userReq.price,   
        tax: userReq.tax,
      }     
      //console.log("Producto creado -> ", productData)
      this.subscription.push(
        this.productService.createProduct(productData).subscribe(
          res => {
            //console.log('Response ->', res)
            this.resetForm();
            this.showSnack(true, res.message); 
            this.router.navigate(['/products']);
          },
          err => {
            //console.log(err)
            this.showSnack(false, err.message);  
            this.resetForm();
          }
        ) 
      )
    }
      
  }

  resetForm(): void {
    this.angForm.reset();
  } 

  showSnack(status: boolean, message: string, timer: number = 6500): void {
    this.snackbar.open(message, undefined , {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: timer,
      panelClass: [status ? "succes-snack" : "error-snack"],
    })
  }

}
