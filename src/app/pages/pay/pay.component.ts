import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy, ElementRef} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table'; 
import { MatSort} from '@angular/material/sort'; 
import { PayService } from '@app/services/pay/pay.service';
import { PayInvoiceService } from '@app/services/payInvoice/pay-invoice.service';
import { PayInvoiceDialogComponent } from '@app/components/pay-invoice-dialog/pay-invoice-dialog.component';
import { CovenantInvoicesDialogComponent } from '@app/components/covenant-invoices-dialog/covenant-invoices-dialog.component';
import { Subscription } from 'rxjs';
import { PaymentInvoiceData } from '@app/models/payment-invoice';
import { PaymentData } from '@app/models/payment'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { MatDialog } from '@angular/material/dialog';
import { PaymentTypeData } from '@app/models/payment-type';
import { UploadFileService } from '@app/services/uploadFile/upload-file.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent  implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];

  //Referencia del documento
  file: File | null = null;  

  searchDate: string = ""
  //Flag to Spinner data 
  //Metodos de pagos
  methodsPayments: PaymentTypeData[] = [];
  loadingData: boolean = false;
  displayedColumns: string[] = ['idPay', 'paidOut', 'payDate', 'idPayMethod', 'accion']; 
  dataSource = new MatTableDataSource<PaymentData>();
  columns = [
    { title: 'No.', name: 'idPay',  size: "8%"},
    { title: 'Monto Pagado', name: 'paidOut',  size: "25%"},
    { title: 'Fecha', name: 'payDate',  size: "20%"}, 
    { title: 'Método Pago', name: 'idPayMethod',  size:"15%"},
    { title: 'Acción', name: 'accion', size: "10%"},
  ] 
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(  
      private snackbar: MatSnackBar, 
      private dialog: MatDialog,   
      private payService: PayService,  
      private payInvoiceService: PayInvoiceService,   
      private uploadFileService: UploadFileService,  
    ) { }

  ngOnInit(): void { 
    this.subscription.push(
      this.payService.getAllTypesPayments().subscribe(
        res => {
          this.methodsPayments = res.content;
          //console.log('Pagos ->', res.content)  
        },
        err => {
          console.log("Error al obtener los metodos de pago -> " , err)  
        }
      )  
    )
    this.getProducts();
  }
 
  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
    this.dataSource.filterPredicate = (data: PaymentData, filter: string): boolean => { 
      return data.payDate.toString().includes(filter);
     };
  }

  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 

  getProducts(): void {
    this.subscription.push(
      this.payService.getAllPayments().subscribe(
        res => {
          this.dataSource.data = res.content;
          //console.log('Pagos ->', res.content) 
          this.loadingData = true
        },
        err => {
          //console.log(err) 
          this.showSnack(false, 'Imposible Obtener Pagos'); 
          this.loadingData = true
        }
      ) 
    )
  }

  //Abrir modal para enviar el documento de pagos de convenio
  openPaymentCovenantModal(): void {
    //console.log("modal convenio")
    const dialogRef = this.dialog.open(CovenantInvoicesDialogComponent, {
      panelClass: ['animate__animated','animate__swing'],
      width: '70%',   
      disableClose: true, 
      data: {
        tittle: `Documento Convenio - Pago Factura`, 
        }
    });
    this.subscription.push(
      dialogRef.afterClosed().subscribe((result: any) => {
        if(result.status){    
          //console.log('procesando pago -> ', result)
          this.file = result.data;
          this.sendFile();
        }
      })
    ) 
  }

  sendFile(): void {
    //Envio de los pagos de los convenios
    //console.log("Enviando documento") 
    this.uploadFileService.uploadPayment(this.file).subscribe(
      res => {
        //console.log('documento enviado -> ', res);
        this.showSnack(true, 'Documento Procesado');    
        this.file = null;
      },
      err => {
        console.log(err) 
        this.showSnack(false, err.error.message || "Error al enviar documento");  
      }, 
    )   
    this.showSnack(true, 'Documento Enviado');    
  }

  //Abrir modal para realizar un pago de una factura 
  openPaymentInvoiceModal(): void {
    const dialogRef = this.dialog.open(PayInvoiceDialogComponent, {
      panelClass: ['animate__animated','animate__swing'],
      width: '70%',  
      height: '60%',
      
      disableClose: true, 
      data: {
        tittle: `Pagar Factura`, // ok
        labelOne: 'Id Factura', // ok
        labelTwo: 'Monto',      // ok
        buttonLabel: "Pagar",  // ok
        methods: this.methodsPayments, 
        account_validation_messages: { 
          inputDataOne: [
            { type: 'required', message: 'Ingrese el id de la factura' },
            { type: 'pattern', message: 'Ingrese el id de la factura' }
          ],
          inputDataTwo: [
            { type: 'required', message: 'Ingrese el monto a pagar' },
            { type: 'pattern', message: 'Ingrese un monto válido - solo números' },
            { type: 'min', message: 'Ingrese un monto mínimo' },  
          ],
          inputDataThree: [
            { type: 'required', message: 'Ingrese información válida' }, 
          ] 
        },
        constrainInputOne: '^[0-9]*$', 
        constrainInputTwo: '^[0-9]*$'  
        }
    });
    this.subscription.push(
      dialogRef.afterClosed().subscribe((result: any) => {
        if(result.status){    
          const paymentData: PaymentInvoiceData = {
            idPay: null,
            payRecord: result.data.inputDataOne,  
            idInvoice: result.data.inputDataTwo,  
            payType: result.data.inputDataThree,   
          }  
          //console.log(paymentData);
          //Al enviar el formulario se envia al api la peticion de pagar una factura pendiente.
          //El resultado sera verdadero si existe y no se ha pagado.
          this.subscription.push(
            this.payInvoiceService.payInvoice(paymentData).subscribe(
              res => { 
                //console.log('de actualiza el pago -> ', res) 
                this.showSnack(true, res.message);  
                this.getProducts();
              },
              err => {
                console.log(err.error) 
                this.showSnack(false, err.error.message || `No se pudo registrar el pago`); 
              }
            ) 
          )
        }
      })
    ) 
  }
 
   
  clearSearch(): void { 
    this.searchDate = '';
    this.dataSource.filter = "";
  }

  applyFilter(): void { 
    //Filtra los porductos por fecha
    this.dataSource.filter = this.searchDate.trim().toLowerCase();
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
