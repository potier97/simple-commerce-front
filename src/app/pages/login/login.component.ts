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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

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
      { type: 'email', message: 'Correo Invalido' },
    ],
    password: [
      { type: 'required', message: 'Contraseña requerida' },
      { type: 'minlength', message: 'La contraseña debe ser de mínimo 3 carácterres', }, 
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
    }); 
  }
 


  //Inciar sesión por el usario
  loginUser(): void {
    if (this.angForm.valid) {
      const userReq = this.angForm.value;
      const userCredentials = {
        email: userReq.userDocument,
        password: userReq.password
      }
      this.subscription.push(
        this.authService.login(userCredentials).subscribe(
          res => {
            // console.log('del formato', res)
            this.router.navigate(['/buy']);
          },
          (err: any) => {
            //console.log(err)
            this.showSnack(false, "No se pudo Iniciar sesión");   
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

