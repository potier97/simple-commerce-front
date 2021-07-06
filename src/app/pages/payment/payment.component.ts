import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFileService } from '@app/services/uploadFile/upload-file.service';
import { Subscription } from 'rxjs'; 
 

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];

  file: File | null = null;
  fileSelected: string | ArrayBuffer; 

  @ViewChild('txtInput') inputFile: ElementRef;

  constructor(
    private snackbar: MatSnackBar,
    private uploadFileService: UploadFileService,  
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 

  loadCovenantFile(event: any) {
    if(event.target.files && event.target.files[0]){ 
      const currentFile = event.target.files[0];
      const fileTypeList = currentFile.name.split(".")
      const fileType = fileTypeList[fileTypeList.length - 1]
      if(fileType === "txt" && currentFile.type === "text/plain"){ 
        this.file = <File> currentFile; 
        console.log("File -> ", currentFile)
      }  
    } 
  }

  deleteFile(): void {
    this.inputFile.nativeElement.value = ""; 
    console.log("Borrando Documento")
    this.file = null;
  }
  

  sendFile(): void {
    console.log("Enviando documento")
    this.subscription.push(
      this.uploadFileService.uploadPayment(this.file).subscribe(
        res => {
          console.log('documento enviado -> ', res)
          this.showSnack(true, 'Documento Procesado');   
        },
        err => {
          console.log(err) 
          this.showSnack(false, err.error.message || "Error al enviar documento");  
        }
      ) 
    )  
  }

  cancelFile(): void {
    console.log("Envio cancelado")
    this.deleteFile()
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
