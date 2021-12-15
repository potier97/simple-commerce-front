import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PaidModesResponse } from '@app/models/paid-modes';
import { PaidModesService } from '@app/services/paid-modes/paid-modes.service';

@Component({
  selector: 'app-edit-paid-modes',
  templateUrl: './edit-paid-modes.component.html',
  styleUrls: ['./edit-paid-modes.component.css']
})
export class EditPaidModesComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];

  angForm: FormGroup = new FormGroup({
    name: new FormControl(''),
  });
  paidMode: PaidModesResponse;
  idPaidModes: number;

  constructor( 
    private snackbar: MatSnackBar, 
    private fb: FormBuilder,  
    private router: Router,
    private route: ActivatedRoute, 
    private paidModesService: PaidModesService) { }

  account_validation_messages = {
    name: [
      { type: 'required', message: 'Ingrese el nombre del modo de pago' }, 
      { type: 'maxlength', message: 'El nombre es demasiado grande' }, 
      { type: 'minLength', message: 'El nombre es demasiado pequeño' }, 
    ],
  }; 

  ngOnDestroy(): void {
    for(const sub of this.subscription) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void { 
    this.subscription.push(
      this.route.params.subscribe(params => {
        this.idPaidModes = params['id'];
      }) 
    ) 
    this.subscription.push(
      this.paidModesService.getPaidModeById(this.idPaidModes).subscribe(
        res => {
          this.paidMode = res;  
          this.loadData();
        },
        (err: any) => {
          this.showSnack(false, 'Método de pago no existe');   
          this.router.navigate(['/paid-modes'])
        }
      )
    )   
  }

  loadData(): void {
    this.angForm = this.fb.group({
      name: new FormControl(
        this.paidMode.tipo,
        Validators.compose([
          Validators.required, 
          Validators.maxLength(10),
          Validators.minLength(3),
        ])
      ),
    });
  }

  editPaidModes(): void {
    if (this.angForm.valid) {
      const userReq = this.angForm.value;
      const paidModeData: PaidModesResponse = {
        tipo: userReq.name,
        estado: 1,
      }     
      this.subscription.push(
        this.paidModesService.updatePaidMode(this.idPaidModes, paidModeData).subscribe(
          res => {
            this.resetForm();
            this.showSnack(true, `Método de pago  ${res.id} actualizado`); 
            this.router.navigate(['/paid-modes']);
          },
          (err: any) => {
            this.showSnack(false,'Método de pago no ha podido ser actualizado');  
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
