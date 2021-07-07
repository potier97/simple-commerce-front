import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CovenantService } from '@app/services/covenant/covenant.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-covenant',
  templateUrl: './new-covenant.component.html',
  styleUrls: ['./new-covenant.component.css']
})
export class NewCovenantComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];

  angForm: FormGroup = new FormGroup({
    name: new FormControl(''), 
  });

  constructor( 
    private snackbar: MatSnackBar, 
    private fb: FormBuilder,  
    private router: Router,
    private covenantService: CovenantService) { }

  account_validation_messages = {
    name: [
      { type: 'required', message: 'Ingrese el nombre del convenio' }, 
      { type: 'maxlength', message: 'El nombre es demasiado grande' }, 
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
    }); 
  }

  createCovenant(): void {
    if (this.angForm.valid) {
      const userReq = this.angForm.value;
      const covenantData = {
        idCovenant: null,
        name: userReq.name, 
      }     
      //console.log("Convenio creado -> ", covenantData)
      this.subscription.push(
        this.covenantService.createCovenant(covenantData).subscribe(
          res => {
            //console.log('Response ->', res)
            this.resetForm();
            this.showSnack(true, res.message); 
            this.router.navigate(['/covenants']);
          },
          err => {
            //console.log(err)
            this.showSnack(false, err.error.message);  
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
