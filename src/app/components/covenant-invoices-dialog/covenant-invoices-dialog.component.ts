import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-covenant-invoices-dialog',
  templateUrl: './covenant-invoices-dialog.component.html',
  styleUrls: ['./covenant-invoices-dialog.component.css']
})
export class CovenantInvoicesDialogComponent implements OnInit {
 
  //Titulo del modal
  tittle: string;  
  //Archivo a subir
  file: File | null = null;  
  //Referencia al input del documento
  @ViewChild('txtInput', {static: true}) inputFile: ElementRef;

  constructor( 
    public dialogRef: MatDialogRef<CovenantInvoicesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  loadCovenantFile(event: any) {
    if(event.target.files && event.target.files[0]){ 
      const currentFile = event.target.files[0];
      const fileTypeList = currentFile.name.split(".")
      const fileType = fileTypeList[fileTypeList.length - 1]
      if(fileType === "txt" && currentFile.type === "text/plain"){ 
        this.file = <File> currentFile; 
        //console.log("File -> ", currentFile)
      }   
    } 
  }

  deleteFile(): void {
    this.inputFile.nativeElement.value = ""; 
    //console.log("Borrando Documento")
    this.file = null;
  }
 
  
  ngOnInit(): void {} 

  closeDialog(status: boolean): object {
    if(status){
      return {
        status,
        data: this.file
      }
    }else{ 
      return {
        status
      }
    }
  }
}
