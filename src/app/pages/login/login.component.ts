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
      private authService: AuthService, 
      private router: Router) 
      {}
  

  account_validation_messages = {
    userDocument: [
      { type: 'required', message: 'Cédula requerida' },
      { type: 'pattern', message: 'Ingrese una cédula valida' },
    ],
    password: [
      { type: 'required', message: 'Contraseña requerida' },
      { type: 'minlength', message: 'La contraseña debe ser de mínimo 3 carácterres', }, 
      { type: 'pattern', message: 'Su contraseña debe contener letras y números',
      },
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
        '132565895',
        Validators.compose([
          Validators.required, 
          Validators.pattern('^[0-9]*$'),
        ])
      ),
      password: new FormControl(
        'pass123',
        Validators.compose([
          Validators.minLength(3),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        ])
      ),
    }); 
  }

  resetForm(): void {
    this.angForm.reset();
  }

  loginUser(): void {
    if (this.angForm.valid) {
      const userReq = this.angForm.value;
      const userCredentials = {
        username: userReq.userDocument,
        password: userReq.password
      }
      this.subscription.push(
        this.authService.login(userCredentials).subscribe(
          res => {
            //console.log('del formato', res)
            this.router.navigate(['/payment']);
          },
          err => {
            console.log(err)
            this.resetForm();
          }
        ) 
      )
      
    }
  }
}

