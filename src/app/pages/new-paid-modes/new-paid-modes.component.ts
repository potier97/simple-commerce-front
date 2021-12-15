import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaidModesService } from '@app/services/paid-modes/paid-modes.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaidModesResponse } from '@app/models/paid-modes';


@Component({
  selector: 'app-new-paid-modes',
  templateUrl: './new-paid-modes.component.html',
  styleUrls: ['./new-paid-modes.component.css']
})
export class NewPaidModesComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];

  angForm: FormGroup = new FormGroup({
    name: new FormControl(''),
  });

  constructor( 
    private snackbar: MatSnackBar, 
    private fb: FormBuilder,  
    private router: Router,
    private paidModesService: PaidModesService) { }

  account_validation_messages = {
    name: [
      { type: 'required', message: 'Ingrese el nombre del metodo de pago' }, 
      { type: 'maxlength', message: 'El nombre es demasiado grande' }, 
    ],
  }; 


  ngOnDestroy(): void {
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
    }); 
  }

  createProduct(): void {
    if (this.angForm.valid) {
      const userReq = this.angForm.value;
      const paidModeData: PaidModesResponse = {
        tipo: userReq.name,
        estado: 1,
      }     
      // console.log("Producto creado -> ", productData)
      this.subscription.push(
        this.paidModesService.createPaidModes(paidModeData).subscribe(
          res => {
            this.resetForm();
            this.showSnack(true, `Método de pago ${res.id} creado`); 
            this.router.navigate(['/paid-modes']);
          },
          (err: any) => {
            this.showSnack(false,'Método de pago no ha podido ser creado');  
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
