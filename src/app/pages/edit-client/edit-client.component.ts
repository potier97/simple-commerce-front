import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '@app/services/users/users.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientsResponse } from '@app/models/clients';


@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];

  angForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    lastname: new FormControl(''),
    userId: new FormControl(''),
    email: new FormControl(''),
    userPhone: new FormControl(''),
  });
  client: ClientsResponse;
  idClient: number;

  constructor( 
    private snackbar: MatSnackBar, 
    private fb: FormBuilder,  
    private router: Router,
    private route: ActivatedRoute, 
    private usersService: UsersService) { }

  account_validation_messages = {
    name: [
      { type: 'required', message: 'Ingrese el nombre del cliente' }, 
      { type: 'maxlength', message: 'El nombre es demasiado grande' }, 
      { type: 'minLength', message: 'El nombre es demasiado pequeño' }, 
    ],
    lastname: [
      { type: 'required', message: 'Ingrese el apellido del cliente' }, 
      { type: 'maxlength', message: 'El apellido es demasiado grande' }, 
      { type: 'minLength', message: 'El apellido es demasiado pequeño' }, 
    ],
    userId: [
      { type: 'required', message: 'Ingrese la cedula del cliente' },
      { type: 'pattern', message: 'Ingrese una cantidad valida (solo números)' },
      { type: 'minLength', message: 'Ingrese una cedula valida' },  
    ], 
    email: [
      { type: 'required', message: 'Ingrese el correo del cliente' },
      { type: 'email', message: 'Ingrese un correo valido' },
    ],
    userPhone: [
      { type: 'required', message: 'Ingrese el teléfono del cliente' },
      { type: 'pattern', message: 'Ingrese un teléfono valido (solo números)' },
      { type: 'minLength', message: 'Ingrese un teléfono valido' },  
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
        this.idClient = params['id'];
      }) 
    ) 
    this.subscription.push(
      this.usersService.getClientById(this.idClient).subscribe(
        res => {
          this.client = res;  
          this.loadData();
        },
        (err: any) => {
          this.showSnack(false, 'Cliente no existe');   
          this.router.navigate(['/clients'])
        }
      )
    )   
  }


  loadData(): void {
    this.angForm = this.fb.group({
      name: new FormControl(
        this.client.nombre,
        Validators.compose([
          Validators.required, 
          Validators.maxLength(10),
          Validators.minLength(3),
        ])
      ),
      lastname: new FormControl(
        this.client.apellido,
        Validators.compose([ 
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(3),
        ])
      ),
      userId: new FormControl(
        this.client.cedula,
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(3),
        ])
      ),
      email: new FormControl(
        this.client.correo,
        Validators.compose([ 
          Validators.required,
          Validators.email,
        ])
      ),
      userPhone: new FormControl(
        this.client.telefono,
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(3),
        ])
      ),
    });
  }

  editClient(): void {
    if (this.angForm.valid) {
      const userReq = this.angForm.value;
      const clientData: ClientsResponse = {
        nombre: userReq.name,
        apellido: userReq.lastname,
        cedula: userReq.userId,
        correo: userReq.email,
        telefono: userReq.userPhone,
        estado: 1,
      }     
      this.subscription.push(
        this.usersService.updateClient(this.idClient, clientData).subscribe(
          res => {
            this.resetForm();
            this.showSnack(true, `Cliente ${res.id} actualizado`); 
            this.router.navigate(['/clients']);
          },
          (err: any) => {
            this.showSnack(false,'Cliente no ha podido ser actualizado');  
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
