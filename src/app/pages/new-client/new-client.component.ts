import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@app/services/users/users.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocTypeData, UserData, UserTypeData, } from '@app/models/user';
import * as moment from 'moment';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit, OnDestroy {

  
  //Flag to Spinner data 
  loadingData: boolean = false; 
  private subscription: Subscription[] = [];

  //listas de otros usuarios que son de tipo Corporativo
  public listCorporative: UserData[]= [];
  //Lista de tipos de documento
  public listDocType: DocTypeData[]= [];
  //Listas de tipo de Usuario
  public listUserType: UserTypeData[]= [];


  angForm: FormGroup = new FormGroup({
    idDocType: new FormControl(''),
    idUserType: new FormControl(''),
    associated: new FormControl(''),
    userDoc: new FormControl(''),
    name: new FormControl(''),
    lastName: new FormControl(''),
    userPass: new FormControl(''),
    userMail: new FormControl(''),
    userAddress: new FormControl(''),
    userPhone: new FormControl(''),
  }); 
  

  constructor( 
    private snackbar: MatSnackBar, 
    private fb: FormBuilder,  
    private router: Router,
    private usersService: UsersService) { }

  account_validation_messages = {
    idDocType: [
      { type: 'required', message: 'Seleccione el tipo de documento' },  
    ],
    idUserType: [
      { type: 'required', message: 'Seleccione el tipo de usuario' }, 
    ],
    associated: [
      { type: 'required', message: 'Seleccione la corporación asociada para el Usuario' }, 
    ], 
    userDoc: [
      { type: 'required', message: 'Ingrese el Documento del Cliente' },
      { type: 'pattern', message: 'Ingrese un documento válido - solo números' },
      { type: 'min', message: 'Ingrese un valor positivo' },  
    ],
    name: [
      { type: 'required', message: 'Ingrese el Nombre del Cliente' }, 
      { type: 'maxlength', message: 'Ingrese un Nombre menor a 30 carácteres' }, 
    ],
    lastName: [
      { type: 'required', message: 'Ingrese los Apellidos del Cliente' },  
      { type: 'maxlength', message: 'Los Apellidos deben ser menor a 30 carácteres' },
    ],
    userPass: [
      { type: 'required', message: 'Ingrese la Contraseña del Administrador' },
      { type: 'maxlength', message: 'Contraseña muy grande' },   
    ],
    userMail: [
      { type: 'required', message: 'Ingrese el Correo del Cliente' },
      { type: 'pattern', message: 'Ingrese un correo válido' }, 
      { type: 'maxlength', message: 'Ingrese un correo menor a 30 carácteres' }, 
    ],
    userAddress: [
      { type: 'required', message: 'Ingrese la dirección del Cliente' },
      { type: 'maxlength', message: 'Ingrese un precio valido de solo números' },
      { type: 'minlength', message: 'Ingrese una dirección valida' },  
    ],
    userPhone: [
      { type: 'required', message: 'Ingrese el Teléfono del Cliente' },
      { type: 'pattern', message: 'Ingrese un Teléfono de solo números' },
      { type: 'maxlength', message: 'Ingrese un Teléfono de menos carácteres ' },  
    ],
  }; 


  ngOnDestroy(): void {
    //console.log("Desubs all observers") 
    for(const sub of this.subscription) {
      sub.unsubscribe();
    }
  }

  //Inicializar de nuevo las variables si cambia de tipo de Cliente
  changeSelected(value: any) {
    if(value.idUserType === 1){
      // natural 
      //console.log("Natural ")  
      this.angForm.controls["lastName"].reset(); 
      this.angForm.controls["userPass"].reset(); 
      this.angForm.controls["lastName"].setValue("");  
      this.angForm.controls["userPass"].setValue("Password123");    
    }else if(value.idUserType === 2){
      //Corporativo 
      //console.log("Corporativo ")
      this.angForm.controls["lastName"].reset(); 
      this.angForm.controls["userPass"].reset(); 
      this.angForm.controls["userPass"].setValue("Password123");  
      this.angForm.controls["lastName"].setValue(" ");  
    }else{
      //Admin 
      //console.log("Admin")   
      this.angForm.controls["userPass"].reset();  
      this.angForm.controls["lastName"].reset();  
      this.angForm.controls["userPass"].setValue("");  
      this.angForm.controls["lastName"].setValue("");   
    }
  }

  ngOnInit(): void {  
    this.subscription.push(
      this.usersService.getAllDocTypes().subscribe(
        res => { 
          //console.log('Reponse DocTypes -> ', res.content)
          this.listDocType = res.content;  
        },
        err => {
          //console.log(err)
          this.showSnack(false, err.error.message || "No se pudo obtener los tipos de Documentos");   
        }
      )  
    )
    this.subscription.push(
      this.usersService.getAllCorpUsers().subscribe(
        res => { 
          //console.log('Reponse Users Corporations -> ', res.content)
          this.listCorporative = res.content;  
        },
        err => {
          //console.log(err)
          this.showSnack(false, err.error.message || "No se pudo obtener los Corporativos");   
        }
      )  
    )
    this.subscription.push(
      this.usersService.getAllUserTypes().subscribe(
        res => { 
          //console.log('Reponse Users Types -> ', res.content)
          this.listUserType = res.content;  
          this.loadingData = true
        },
        err => {
          //console.log(err)
          this.showSnack(false, err.error.message || "No se pudo obtener los tipos de Usuario");   
        }
      )  
    ) 

    this.angForm = this.fb.group({ 
      idDocType: new FormControl(
        '',
        Validators.compose([
          Validators.required,  
        ])
      ),
      idUserType: new FormControl(
        this.listUserType[0] || '',
        Validators.compose([ 
          Validators.required, 
        ])
      ),
      associated: new FormControl(
        '',
        Validators.compose([ 
          //Validators.required, 
        ])
      ),
      userDoc: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1), 
        ])
      ),
      name: new FormControl(
        '',
        Validators.compose([ 
          Validators.required, 
          Validators.maxLength(30), 
        ])
      ),
      lastName: new FormControl(
        '',
        Validators.compose([  
          //Validators.required, 
          Validators.maxLength(30), 
        ])
      ),
      userPass: new FormControl(
        '',
        Validators.compose([ 
          //Validators.required, 
          Validators.maxLength(30),  
        ])),
      userMail: new FormControl(
        '',
        Validators.compose([ 
          Validators.required, 
          Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/),  // validacion de correo
          Validators.maxLength(30),  
        ])
      ),
      userAddress: new FormControl(
        '',
        Validators.compose([ 
          Validators.required, 
          Validators.maxLength(30), 
          Validators.minLength(3), 
        ])
      ),
      userPhone: new FormControl(
        '',
        Validators.compose([ 
          Validators.required, 
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),  
        ])
      ),
    }); 
  }

  createClient(): void {
    if (this.angForm.valid) {
      const userCreated = moment().format("YYYY-MM-DD");  //"2016-04-10"
      const userReq = this.angForm.value;
      const userData = {
        idUser: null,
        idDocType: userReq.idDocType,
        idUserType: userReq.idUserType,
        associated: userReq.associated === "NN" || userReq.associated === "" || userReq.idUserType.idUserType !== 1 ? null : userReq.associated,
        userDoc: userReq.userDoc,
        name: userReq.name,
        lastName: userReq.idUserType.idUserType === 2 ? "  " : userReq.lastName,
        userPass: userReq.idUserType === 3 ? userReq.userPass : "pass123",
        userMail: userReq.userMail,
        userAddress: userReq.userAddress,
        userPhone: userReq.userPhone,   
        userCreated: userCreated, 
      }     
      //console.log("Usuario a crear -> ", userData)
      this.subscription.push(
        this.usersService.createClient(userData).subscribe(
          res => {
            //console.log('Response ->', res)
            this.resetForm();
            this.showSnack(true, res.message); 
            this.router.navigate(['/clients']);
          },
          err => {
            //console.log(err)
            this.showSnack(false, err.error.message || 'No se pudo crear el cliente');  
            this.resetForm();
            this.router.navigate(['/clients']);
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
