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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateData } from '@app/models/dates';
import * as moment from 'moment';
import { Router } from '@angular/router';



@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent  implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];

  //Referencia del documento
  file: File | null = null;  

  
  //Flag to Spinner data 
  loadingData: boolean = false;
  //Metodos de pagos
  methodsPayments: PaymentTypeData[] = [];
  displayedColumns: string[] = ['idPay', 'paimentDate', 'paidOut', 'payMethod', 'paydoc', 'accion']; 
  dataSource = new MatTableDataSource<PaymentData>();

  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;

  //SELECTOR DE  BUSCADOR POR TIPO - ID - FECHA
  modeSearch = new FormControl('id');
  //Buscar por el id del pago
  searchPayment = new FormControl('',
  [
    Validators.required,
    Validators.pattern('^[0-9]*$'),  
  ]);
  //FORMLARIO DE BÚSQUEDA POR LOS DATOS - INICIO - FIN
  range = new FormGroup({
    start: new FormControl('',
    [
      Validators.required, 
    ]),
    end: new FormControl('',
    [
      Validators.required, 
    ])
  });
  
  constructor(  
      private snackbar: MatSnackBar, 
      private dialog: MatDialog,   
      private payService: PayService,  
      private route: Router,  
      private payInvoiceService: PayInvoiceService,   
      private uploadFileService: UploadFileService,  
    ) { }

  ngOnInit(): void { 
    this.subscription.push(
      this.payService.getAllMethodsPayments().subscribe(
        res => {
          this.methodsPayments = res.content;
          //console.log('Pagos ->', res.content)  
        },
        err => {
          //console.log("Error al obtener los metodos de pago -> " , err)   
          this.showSnack(false, err.error.message || 'Imposible Obtener Pagos');
        }
      )  
    )
    this.getPayments();
  }
 
  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
    this.dataSource.filterPredicate = (data: PaymentData, filter: string): boolean => { 
      return data.idPay!.toString().includes(filter);
     };
  }

  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 

  //Obtener todas los pagos de la base de datos
  getPayments(): void {
    this.loadingData = false;
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

  //Reiniciar el formulario del input que se ha dejado de ver
  //Con el fin de desactivar el validador del boton de búsqueda
  changeFindMethod(value: string): void {
    //console.log("Cambio a -> ", value)
    //console.log("Rango -> ", this.range.valid)
    if(value === 'id'){
      this.range.reset();
      this.range.controls["start"].setValue("");  
      this.range.controls["end"].setValue("");
    }else{
      this.searchPayment.reset();
      this.searchPayment.setValue('');
    }
  }


  //Buscar el id de la factura asociado al pago
  searchInvoice(paymentId: number): void { 
    //console.log("Pago -> ", paymentId)
     this.subscription.push(
        this.payService.findInvoiceByPayment(paymentId).subscribe(
          res => {
            //console.log('Pagos ->', res.content)  
            this.route.navigate(['/invoces/datailsInvoice/', res.content]);
          },
          err => { 
            this.showSnack(false, err.error.message || 'No se encontró la factura');      
          }
        ) 
      ) 
  }

  searchPayments(): void {
    if(this.modeSearch.value === 'id'){
      //console.log("Buscando por id",  this.searchPayment.value)
      this.loadingData = false;
      this.subscription.push(
        this.payService.findById(this.searchPayment.value).subscribe(
          res => {
            this.dataSource.data = res.content;
            //console.log('Pagos ->', res.content) 
            this.loadingData = true
          },
          err => { 
            this.showSnack(false, err.error.message || 'Imposible Obtener Pagos');             
            this.loadingData = true
          }
        ) 
      )
    }else{
      //console.log("Buscando por fecha",  this.range.value)
      this.loadingData = false;
      moment.locale('es-es');
      const dates: DateData = {
        start: moment(this.range.value.start).format("YYYY-MM-DD"),
        end: moment(this.range.value.end).format("YYYY-MM-DD")
      }
      //console.log("Dates -> ", dates)
      this.subscription.push(
        this.payService.findByDate(dates).subscribe(
          res => {
            this.dataSource.data = res.content;
            //console.log('Pagos ->', res.content) 
            this.showSnack(true, res.message || "Pagos Obtenidos"); 
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
        this.getPayments();
        this.file = null;
      },
      err => {
        //console.log(err) 
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
            idPay: null, // ID DEL PAGO
            payRecord: result.data.inputDataTwo,  // ID DE LA FACTURA
            idInvoice: result.data.inputDataOne,  // MONTO A PAGAR
            payMethod: result.data.inputDataThree,  // MÉTODO DE PAGO
          }  
          //console.log(paymentData);
          //Al enviar el formulario se envia al api la peticion de pagar una factura pendiente.
          //El resultado sera verdadero si existe y no se ha pagado.
          this.subscription.push(
            this.payInvoiceService.payInvoice(paymentData).subscribe(
              res => { 
                //console.log('de actualiza el pago -> ', res) 
                this.showSnack(true, res.message);  
                this.getPayments();
              },
              err => {
                //console.log(err.error) 
                this.showSnack(false, err.error.message || `No se pudo registrar el pago`); 
              }
            ) 
          )
        }
      })
    ) 
  }
 
   
  clearSearch(): void { 
    this.searchPayment.reset(); 
    this.range.reset();
    this.getPayments();
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
