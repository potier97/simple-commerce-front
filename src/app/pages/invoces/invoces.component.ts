import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table'; 
import { MatSort} from '@angular/material/sort'; 
import { InvoiceService } from '@app/services/invoice/invoice.service';
import { Subscription } from 'rxjs';
import { InvoiceData } from '@app/models/invoice'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import Swal from 'sweetalert2' ;
import * as moment from 'moment';
import { MonthData } from '@app/models/month';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-invoces',
  templateUrl: './invoces.component.html',
  styleUrls: ['./invoces.component.css']
})
export class InvocesComponent implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];
 
  currentMonth: string = ""
  //Flag to Spinner data 
  loadingData: boolean = false;
  displayedColumns: string[] = ['idBuy', 'purchaseDate', 'idClient', 'total', 'idPayType', 'accion']; 
  dataSource = new MatTableDataSource<InvoiceData>(); 

  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;

  
  //Buscador de Facturas
  searchInvoice = new FormControl('', 
    [
      Validators.required,
      Validators.pattern('^[0-9]*$'), 
    ]
  );

  constructor(  
      private snackbar: MatSnackBar,  
      private invoiceService: InvoiceService,  
    ) { }

  ngOnInit(): void { 
    this.getInvoices();
    moment.locale('es-es');
    this.currentMonth = moment().format('MMMM YYYY')
  }

  getInvoices(): void {
    this.loadingData = false;
    this.subscription.push(
      this.invoiceService.getAllInvoices().subscribe(
        res => {
          this.dataSource.data = res.content;
          //console.log('Facturas ->', res.content) 
          this.loadingData = true
        },
        err => {
          //console.log(err) 
          this.showSnack(false, err.error.message || 'Imposible Obtener Facturas'); 
          this.loadingData = true
        }
      ) 
    )
  }

  //CONFIGURACIONES DE LA TABLA PARA PODER FILTRAR Y PAGINAR
  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }
  
  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 
  
  clearClientSearch(): void { 
    this.searchInvoice.reset() 
    this.getInvoices();
  }

  searchIdInvoice(): void {
      // Buscar FACTURAS que se parezcan al id que el usuario introdujo
      this.loadingData = false;
      if(this.searchInvoice.valid){
        this.subscription.push(
          this.invoiceService.findInvoiceById(this.searchInvoice.value).subscribe(
            res => { 
              this.dataSource.data = res.content;
              //console.log('Facturas ->', res.content) 
              this.loadingData = true;
            },
            err => {
              //console.log(err) 
              this.showSnack(false,  err.error.message || 'Factura No Encontrada'); 
              this.loadingData = true;
            }
          )
        )
      }
  }
   
  
  
  generateMonthInvoice(): void {
    //console.log("Generando facturas")
    //Modal para generar facturas del mes
    Swal.fire({
      title: 'Generar Facturas',
      text: `¿Desea generar facturas del mes ${this.currentMonth}?`,
      icon: 'warning',
      iconColor:'#c1c164',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonColor: '#c1c164',
      cancelButtonColor: '#226706',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Generar', 
      showClass: {
        popup: 'animate__animated animate__swing'
      }  
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Generando',
          text: `Las facturas mensuales se estan generando`,
          icon: 'info',
          iconColor:'#c1c164',
          heightAuto: false,  
          confirmButtonColor: '#c1c164', 
          confirmButtonText: 'Cerrar',
          showClass: {
            popup: 'animate__animated animate__swing'
          },
        }) 
        moment.locale('es-es');
        const month = moment().format('L')
        //console.log(month)
        const data: MonthData = {
          currentMont: month
        } 
        this.invoiceService.generateMonthInvoices(data).subscribe(
          res => {  
            this.getInvoices(); 
            this.showSnack(true, res.message);
          },
          err => {
            //console.log(err.error)  
            this.showSnack(false, err.error.message || 'Imposible Generar Facturas');
          }
        )  
      }else{
        Swal.fire({
          title: 'Cancelado',
          text: `Ha decidido no generar las facturas mensuales`,
          icon: 'info',
          iconColor:'#c1c164',
          heightAuto: false,  
          confirmButtonColor: '#c1c164', 
          confirmButtonText: 'Cerrar',
          showClass: {
            popup: 'animate__animated animate__swing'
          },
        })
      }
    })
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