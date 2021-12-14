import { 
  Component, 
  OnDestroy, 
  OnInit 
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sing-up',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingUpComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];

  angForm: FormGroup = new FormGroup({
    userDocument: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
      private fb: FormBuilder, 
      private snackbar: MatSnackBar,  
      private authService: AuthService, 
      private router: Router) 
      {}
  

  account_validation_messages = {
    userDocument: [
      { type: 'required', message: 'Correo requerida' },
      { type: 'email', message: 'Ingrese una correo valido' },
    ],
    password: [
      { type: 'required', message: 'Contraseña requerida' },
      { type: 'minlength', message: 'La contraseña debe ser de mínimo 3 carácterres', }, 
    ],
    repetedPassword: [
      { type: 'required', message: 'Contraseña Repetida requerida' },
      { type: 'minlength', message: 'La contraseña debe ser de mínimo 3 carácterres', }, 
    ],
    typeUser: [
      { type: 'required', message: 'Tipo de Usuario Requerido' },
    ],
  };

  ngOnDestroy(): void {
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  }

  ngOnInit(): void { 
    this.angForm = this.fb.group({
      userDocument: new FormControl(
        '',
        Validators.compose([
          Validators.required, 
          Validators.email,
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.minLength(3),
          Validators.required,
        ])
      ),
      repetedPassword: new FormControl(
        '',
        Validators.compose([
          Validators.minLength(3),
          Validators.required,
        ])
      ),
      typeUser: new FormControl(
        '',
        Validators.compose([
          Validators.required,
        ])
      ),
    }); 
  }
 


  //Inciar sesión por el usario
  createUser(): void {
    if (this.angForm.valid && this.angForm.value.password === this.angForm.value.repetedPassword) {
      const userReq = this.angForm.value;
      const userCredentials = {
        email: userReq.userDocument,
        password: userReq.password,
        role: userReq.typeUser
      }
      this.subscription.push(
        this.authService.singUp(userCredentials).subscribe(
          res => {
            console.log('del formato', res)
            this.showSnack(true, "Usuario creado");  
            this.router.navigate(['/login']);
          },
          (err: any) => {
            //console.log(err)
            this.showSnack(false, "No se pudo crear Usuario");   
            //Reiniciar formlario
            this.angForm.reset();
          }
        ) 
      )
      
    }
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

