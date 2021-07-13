import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css']
})
export class CustomDialogComponent implements OnInit {

  angForm: FormGroup = new FormGroup({ 
    inputData: new FormControl(''), 
  });
  account_validation_messages = { 
    inputData: [
      { type: 'required', message: 'Ingrese información válida' },
      { type: 'pattern', message: 'Ingrese información válida' },
      { type: 'min', message: 'Ingrese información válida' },  
    ]
  };  
  tittle: string;
  animal: string;
  name: string;

  constructor(
    private fb: FormBuilder,  
    // public dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  
  ngOnInit(): void {
    if(this.data.account_validation_messages) this.account_validation_messages = this.data.account_validation_messages; 
    this.angForm = this.fb.group({ 
      inputData: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
          Validators.pattern(this.data.constrainInput),
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
