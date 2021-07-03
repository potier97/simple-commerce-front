import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css']
})
export class CustomDialogComponent implements OnInit {

  angForm: FormGroup = new FormGroup({ 
    amount: new FormControl(''), 
  });
  account_validation_messages = { 
    amount: [
      { type: 'required', message: 'Ingrese la cantidad de productos disponibles' },
      { type: 'pattern', message: 'Ingrese un número valido de solo números' },
      { type: 'min', message: 'Ingrese un valor positivo' },  
    ],  
  };  
  tittle: string;
  animal: string;
  name: string;

  constructor(
    private fb: FormBuilder,  
    // public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  
 
  ngOnInit(): void {
    this.angForm = this.fb.group({ 
      amount: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1), 
        ])
      ), 
    }); 
  } 

  closeDialog(status: boolean): object {
    if(status){
      return {
        status,
        data: this.angForm.value
      }
    }else{
      return {
        status
      }
    }
  }
}
