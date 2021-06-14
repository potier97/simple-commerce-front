import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  angForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private fb: FormBuilder) {}

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
        message:'Su contraseña debe contener mínimo una letra mayuscula, una minuscula y un número',
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

  sendReqest(): void {
    if (this.angForm.valid) {
      console.log('USER', this.angForm.value);
    } else {
      console.log('No valido');
    }
  }

}
