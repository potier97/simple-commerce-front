import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '@app/services/users/users.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocTypeData, UserData } from '@app/models/user'; 


@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit, OnDestroy {

  
  //Flag to Spinner data 
  loadingData: boolean = false; 
  private subscription: Subscription[] = []; 
  //Lista de tipos de documento
  public listDocType: DocTypeData[]= []; 
  //DATO DEL  CLIENTE A ACTUALIZAR
  client: UserData;
  //ID DEL CLIENTE ACTUALIZADO
  idClient: number;

  angForm: FormGroup = new FormGroup({
    idDocType: new FormControl(''),
    userDoc: new FormControl(''),
    name: new FormControl(''),
    lastName: new FormControl(''), 
    userMail: new FormControl(''),
    userAddress: new FormControl(''),
    userPhone: new FormControl(''),
  }); 
  

  constructor( 
    private route: ActivatedRoute, 
    private snackbar: MatSnackBar, 
    private fb: FormBuilder,  
    private router: Router,
    private usersService: UsersService) { }

  account_validation_messages = {
    idDocType: [
      { type: 'required', message: 'Seleccione el tipo de documento' },  
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

   
  ngOnInit(): void {  
    this.subscription.push(
      this.route.params.subscribe(params => {
        this.idClient = params['id'];

        //OBTENER TODOS LOS TIPOS DE DOCUMENTOS
        this.subscription.push(
          this.usersService.getAllDocTypes().subscribe(
            res => { 
              //console.log('Reponse DocTypes -> ', res.content)
              this.listDocType = res.content;   
                //OBTENER EL CLIENTE A ACTUALIZARTODOS LOS TIPOS DE DOCUMENTOS
                this.subscription.push(
                  this.usersService.getClientById(this.idClient).subscribe(
                    response => { 
                      //console.log('Reponse User Data -> ', response.content)
                      this.client = response.content; 
                      //OFF FLAG TO SHOW SER DATA
                      this.loadData(response.content);
                      setTimeout(() => {
                        this.loadingData = true  
                      }, 250);
                    },
                    err => {
                      //console.log(err)
                      this.showSnack(false, err.error.message || "No se pudo obtener el usuario");   
                      this.router.navigate(['/products'])
                    }
                  )  
                ) 
            },
            err => {
              //console.log(err)
              this.showSnack(false, err.error.message || "No se pudo obtener los tipos de Documentos");   
            }
          )  
        )  
      }) 
    )  
  }

  loadData(data: UserData): void {
    this.angForm = this.fb.group({ 
      idDocType: new FormControl(
        this.listDocType.find(doc => doc.idDocType === data.idDocType.idDocType),
        //this.listDocType[0],
        Validators.compose([
          Validators.required,  
        ])
      ),  
      userDoc: new FormControl(
        data.userDoc,
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1), 
        ])
      ),
      name: new FormControl(
        data.name,
        Validators.compose([ 
          Validators.required, 
          Validators.maxLength(30), 
        ])
      ),
      lastName: new FormControl(
        data.lastName,
        Validators.compose([  
          //Validators.required, 
          Validators.maxLength(30), 
        ])
      ), 
      userMail: new FormControl(
        data.userMail,
        Validators.compose([ 
          Validators.required, 
          Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/),  // validacion de correo
          Validators.maxLength(30),  
        ])
      ),
      userAddress: new FormControl(
        data.userAddress,
        Validators.compose([ 
          Validators.required, 
          Validators.maxLength(30), 
          Validators.minLength(3), 
        ])
      ),
      userPhone: new FormControl(
        data.userPhone,
        Validators.compose([ 
          Validators.required, 
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(10),  
        ])
      ),
    });  
  }

  validateChangeData(): boolean {
    let isChange: boolean = false;
    //Tipo documento
    if(this.angForm.value.idDocType.idDocType !== this.client.idDocType.idDocType) isChange = true
    // Documento Cliente
    if(this.angForm.value.userDoc !== this.client.userDoc) isChange = true
    // Nombre Cliente
    if(this.angForm.value.name !== this.client.name) isChange = true
    // Apellido Cliente
    if(this.angForm.value.lastName !== this.client.lastName) isChange = true
    // Correo Cliente
    if(this.angForm.value.userMail !== this.client.userMail) isChange = true
    // Direccion del cliente
    if(this.angForm.value.userAddress !== this.client.userAddress) isChange = true
    // Telefono del cliente
    if(this.angForm.value.userPhone !== this.client.userPhone) isChange = true
    return isChange
  }

  updateClient(): void {
    const status = this.validateChangeData();
    if (this.angForm.valid && status) { 
      const userReq = this.angForm.value;
      const userData = {
        idUser: this.idClient,
        idDocType: userReq.idDocType,
        idUserType: this.client.idUserType,
        associated: this.client.associated,
        userDoc: userReq.userDoc,
        name: userReq.name,
        lastName: this.client.idUserType.idUserType === 2 ? this.client.lastName : userReq.lastName,
        userPass: this.client.userPass,
        userMail: userReq.userMail,
        userAddress: userReq.userAddress,
        userPhone: userReq.userPhone,   
        userCreated: this.client.userCreated   
      }     
      //console.log("Usuario a actualizar -> ", userData)
      //Servicio para actualizar el cliente
      this.subscription.push(
        this.usersService.updateClient(userData).subscribe(
          res => {
            console.log('Response from update User ->', res)
            this.resetForm();
            this.showSnack(true, res.message); 
            this.router.navigate(['/clients']);
          },
          err => {
            //console.log(err)
            this.showSnack(false, err.error.message || 'No se pudo actualizar el cliente');  
            this.resetForm();
            this.router.navigate(['/clients']);
          }
        ) 
      )
    }else{
      this.showSnack(false, 'Los datos del cliente no han cambiado'); 
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
