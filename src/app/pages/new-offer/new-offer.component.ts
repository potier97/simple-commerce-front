import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { OfferService  } from '@app/services/offer/offer.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TypeOfferData } from '@app/models/offer';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.component.html',
  styleUrls: ['./new-offer.component.css']
})
export class NewOfferComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];

  public listCategory: TypeOfferData[]= [];
  
  
  angForm: FormGroup = new FormGroup({
    description: new FormControl(''),
    typeOffer: new FormControl(''), 
    percentage: new FormControl(''),
    value: new FormControl(''), 
  });

  constructor( 
    private snackbar: MatSnackBar, 
    private fb: FormBuilder,  
    private router: Router,
    private offerService: OfferService) { }

  account_validation_messages = {
    description: [
      { type: 'required', message: 'Ingrese la descripción de la oferta' }, 
      { type: 'maxlength', message: 'El nombre es demasiado grande' }, 
    ],
    typeOffer: [
      { type: 'required', message: 'Ingrese el tipo de oferta' }, 
    ],
    percentage: [
      { type: 'required', message: 'Ingrese el porcentaje de descuento' },
      { type: 'pattern', message: 'Ingrese un porcentaje valido del 1 - 99' },
      { type: 'min', message: 'Ingrese un valor positivo' },  
      { type: 'max', message: 'Ingrese un valor menor al 99%' },  
    ], 
    value: [
      { type: 'required', message: 'Ingrese la cantidad mínima para aplicar descuento' },
      { type: 'pattern', message: 'Ingrese un valor valido de solo números' },
      { type: 'min', message: 'Ingrese un valor positivo' },  
    ],
  } 


  ngOnDestroy(): void {
    //console.log("Desubs all observers") 
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  }
 

  ngOnInit(): void { 
    this.offerService.getAllTypeOffers().subscribe(
      res => { 
        this.listCategory = res.content;  
      },
      err => {
        //console.log(err)
        this.showSnack(false, err.error.message || "No se pudo obtener los tipos de Ofertas");   
      }
    )  
    this.angForm = this.fb.group({
      description: new FormControl(
        '',
        Validators.compose([
          Validators.required, 
          Validators.maxLength(60),
        ])
      ),    
      typeOffer: new FormControl(
        '',
        Validators.compose([ 
          Validators.required, 
        ])
      ),  
      percentage: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1), 
          Validators.max(99), 
        ])
      ),
      value: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1), 
        ])
      ), 
    }); 
  }

  createNewOffer(): void {
    if (this.angForm.valid) {
      const userReq = this.angForm.value; 
      const offerData = { 
        idOffer: null,
        idOfferType: userReq.typeOffer,
        description: userReq.description,
        percentage: userReq.percentage,
        value: userReq.value,
      }     
      console.log("Oferta creada -> ", offerData)
      this.subscription.push(
        this.offerService.createOffer(offerData).subscribe(
          res => {
            //console.log('Response ->', res)
            this.resetForm();
            this.showSnack(true, res.message); 
            this.router.navigate(['/offers']);
          },
          err => {
            //console.log(err)
            this.showSnack(false, err.error.message || "No se pudo registrar la oferta");  
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

