import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  angForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  account_validation_messages = {
    email: [
      { type: 'required', message: 'Cédula requerida' },
      { type: 'pattern', message: 'Ingrese una cédula valida' },
    ],
    password: [
      {
        type: 'minlength',
        message: 'La contraseña debe ser de mínimo 5 carácterres',
      },
      { type: 'required', message: 'Contraseña requerida' },
      {
        type: 'pattern',
        message:
          'Su contraseña debe contener mínimo una letra mayuscula, una minuscula y un número',
      },
    ],
  };

  ngOnInit(): void {
    
    this.angForm = this.fb.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          //Validators.,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.minLength(5),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        ])
      ),
    });
    //this.angForm.get("email")?.hasError
  }

  resetForm(): void {
    this.angForm.reset();
  }

  loginUser(): void {
    if (this.angForm.valid) {
      const userReq = this.angForm.value;
      console.log('USER', userReq);
      // this.authService.login(userReq).subscribe({
      //   complete: () => {
      //     // (res) => 
      //     // console.log("User: ", res)
      //     // if(res){
      //     //   this.router.navigate(['/pay'])
      //     // }
      //   },
      // });
    } else {
      console.log('No valido');
    }
  }
}

