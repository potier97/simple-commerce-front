import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { OfferService  } from '@app/services/offer/offer.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TypeOfferData, OfferData } from '@app/models/offer';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.css']
})
export class EditOfferComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];

  //Flag to Spinner data 
  loadingData: boolean = false;

  public listCategory: TypeOfferData[]= [];

  offer: OfferData;
  idOffert: number;
  
  
  angForm: FormGroup = new FormGroup({
    description: new FormControl(''),
    typeOffer: new FormControl(''), 
    percentage: new FormControl(''),
    value: new FormControl(''), 
  });

  constructor( 
    private route: ActivatedRoute, 
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

  //Comparar los valores del selected
  compareObjects(offerA: TypeOfferData, offerB: TypeOfferData): boolean { 
    if(!offerA || !offerB) return false; 
    return offerA.name === offerB.name && offerA.idOfferType === offerB.idOfferType;
  }

  loadData(): void {   
    // var conclusion = (Object.getOwnPropertyNames(this.listCategory[0]).toString() == Object.getOwnPropertyNames(this.offer.idOfferType).toString()) ?
    // 'Tienen las misma estructura': 'No tienen la misma estructura';
    // console.log('Conclusión: ' + conclusion);
    this.angForm = this.fb.group({
      description: new FormControl(
        this.offer.description,
        Validators.compose([
          Validators.required, 
          Validators.maxLength(60),
        ])
      ),
      typeOffer: new FormControl(  
        this.offer.idOfferType,
        //this.listCategory[0],
        Validators.compose([ 
          Validators.required, 
        ])
      ),
      percentage: new FormControl(
        this.offer.percentage,
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1), 
        ])
      ),
      value: new FormControl(
        this.offer.value,
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(0), 
        ])
      )
    });  
  }
 

  ngOnInit(): void { 
    this.subscription.push(
      this.route.params.subscribe(params => {
        this.idOffert = params['id'];
      }) 
    ) 
    this.subscription.push(
      this.offerService.getAllTypeOffers().subscribe(
        res => {  
          this.listCategory = res.content;   
          this.subscription.push(
            this.offerService.getOffer(this.idOffert).subscribe(
              res => {
                //console.log('Response -> ', res)
                this.offer = res.content;
                this.showSnack(true, res.message);  
                this.loadData();
                this.loadingData = true
              },
              err => {
                //console.log("Error -> ", err)
                this.showSnack(false, err.error.message || `No se pudo obtener la oferta ${this.idOffert}`);   
                this.router.navigate(['/offers'])
                this.loadingData = true
              }
            )
          )   
        },
        err => {
          console.log("Error -> ", err)
          this.showSnack(false, err.error.message || "No se pudo obtener los tipos de Ofertas");   
        }
      )  
    )

    
  }

  editOffer(): void {
    if (this.angForm.valid) {
      const userReq = this.angForm.value; 
      const offerData = { 
        idOffer: this.offer.idOffer,
        idOfferType: userReq.typeOffer,
        description: userReq.description,
        percentage: userReq.percentage,
        value: userReq.value,
      }     
      //console.log("Oferta actualizada -> ", offerData)
      this.subscription.push(
        this.offerService.updateOffer(offerData).subscribe(
          res => {
            //console.log('Response ->', res)
            this.resetForm();
            this.showSnack(true, res.message); 
            this.router.navigate(['/offers']);
          },
          err => {
            //console.log(" Error ", err)
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
