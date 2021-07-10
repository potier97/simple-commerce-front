import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerPdf, InvoicePdf } from '@app/models/invoice-pdf';
import { UserData } from '@app/models/user';
import { InvoiceToPdfService } from '@app/services/invoiceToPdf/invoice-to-pdf.service';
import { UploadFileService } from '@app/services/uploadFile/upload-file.service';
import { UsersService } from '@app/services/users/users.service';
import { Subscription } from 'rxjs'; 
 

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];

  file: File | null = null; 
  userAdmin: UserData;

  @ViewChild('txtInput') inputFile: ElementRef;

  constructor(
    private userService: UsersService,
    private pdfGenerator: InvoiceToPdfService,
    private snackbar: MatSnackBar,
    private uploadFileService: UploadFileService,  
  ) { }

  ngOnInit(): void {
    this.subscription.push(
      this.userService.getAdminProfile().subscribe(
        async res => { 
          //console.log("Admin ", res) 
          this.userAdmin = res.content; 
        },
        err => {
          console.log(err)  
          return null 
        }
      )
    )
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
    //Envio de los pagos de los convenios
    //console.log("Enviando documento") 
    this.uploadFileService.uploadPayment(this.file).subscribe(
      res => {
        console.log('documento enviado -> ', res);
        this.showSnack(true, 'Documento Procesado');    
      },
      err => {
        console.log(err) 
        this.showSnack(false, err.error.message || "Error al enviar documento");  
      }, 
    )   
    this.showSnack(true, 'Documento Enviado');   
    this.deleteFile();  
  }
 

  showSnack(status: boolean, message: string, timer: number = 6500): void {
    this.snackbar.open(message, undefined , {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: timer,
      panelClass: [status ? "succes-snack" : "error-snack"],
    })
  }


  generatePdf() {
 

    const customerData: CustomerPdf = {
      customerName: 'Pepito Perez',
      address: 'Trv 39a 23 SUR',
      email: 'pepitoPeres@email.com',
      contactNo: '314569852'
    }
    const  productsData: InvoicePdf[] = [
      {
        name: 'Tv Samsung 32 Plgadas', 
        price: 1250000, 
        qty: 3,
        tax: 18,
        total: 3550000 
        //el valor del producto sin iva total/(tax/100 + 1) =>  3550000/1.18 = 3008474.57
        // el valor del iva es igual a => total - valorSinIva => 3550000 - 3008474.57 = 541525.43
        //taxValue: 541525.43
      },
      {
        name: 'Usb 32 Gb', 
        price: 80000, 
        qty: 5,
        tax: 18,
        total: 400000 
        //el valor del producto sin iva total/(tax/100 + 1) =>  400000/1.18 = 338983.05
        // el valor del iva es igual a => total - valorSinIva => 400000 - 338983.05 = 61016.95
        //taxValue: 61016.95
      },
      {
        name: 'Celular Xiamoi S9', 
        price: 950000, 
        qty: 1,
        tax: 0,
        total: 950000 
        //el valor del producto sin iva total/(tax/100 + 1) =>  400000 (no aplica iva) = 400000
        // el valor del iva es igual a => 0
        //taxValue: 0
      },
    ]  
    
    const invoiceId = 753
    const subtotal = 4900000
    //541525.43 +  61016.95 + 0 
    const totalTax = 602542.38 
    // en el caso de que aplique un descuento del 17% a la compra
    // El Valor del descuento =>  subtotal*(descuento/100) => 4900000*0.17
    // el descuento es del => 833000
    const discount = 833000
    //El total es el subtotal menos el descuento aplicado - si no aplica, el valor de la compra es igual al del total
    const total = 4067000

    const AdminData = `${this.userAdmin.name} ${this.userAdmin.lastName}`
    this.pdfGenerator.generatePdf( AdminData, customerData, productsData, invoiceId, subtotal, totalTax, discount, total);
  }

}
