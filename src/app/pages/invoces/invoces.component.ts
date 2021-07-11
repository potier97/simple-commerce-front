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


@Component({
  selector: 'app-invoces',
  templateUrl: './invoces.component.html',
  styleUrls: ['./invoces.component.css']
})
export class InvocesComponent implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];

  searchInvoice: string = ""
  currentMonth: string = ""
  //Flag to Spinner data 
  loadingData: boolean = false;
  displayedColumns: string[] = ['idBuy', 'purchaseDate', 'idClient', 'total', 'idPayType', 'accion']; 
  dataSource = new MatTableDataSource<InvoiceData>();
  columns = [
    { title: 'No.', name: 'idBuy',  size: "8%"},
    { title: 'Fecha', name: 'purchaseDate',  size: "25%"},
    { title: 'Cliente', name: 'idClient',  size: "20%"}, 
    { title: 'Total Pago', name: 'total',  size:"15%"},
    { title: 'Tipo Pago', name: 'idPayType', size: "10%"},
    { title: 'Acción', name: 'accion', size: "10%"}, 
  ] 
 


  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(  
      private snackbar: MatSnackBar,  
      private invoiceService: InvoiceService,  
    ) { }

  ngOnInit(): void { 
    this.getProducts();
    moment.locale('es-es');
    this.currentMonth = moment().format('MMMM YYYY')
  }

  getProducts(): void {
    this.subscription.push(
      this.invoiceService.getAllInvoices().subscribe(
        res => {
          this.dataSource.data = res.content;
          //console.log('Facturas ->', res.content) 
          this.loadingData = true
        },
        err => {
          //console.log(err) 
          this.showSnack(false, 'Imposible Obtener Facturas'); 
          this.loadingData = true
        }
      ) 
    )
  }

  
  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
    this.dataSource.filterPredicate = (data: InvoiceData, filter: string): boolean => { 
      return data.idBuy!.toString().includes(filter);
     };
  }
  
  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 
  
  clearSearch(): void { 
    this.searchInvoice = '';
    this.dataSource.filter = "";
  }
  
  applyFilter(): void { 
    //Filtra los porductos por la fecha y el id
    this.dataSource.filter = this.searchInvoice.trim().toLowerCase();
  } 
  
  
  generateMonthInvoice(): void {
    console.log("Generando facturas")
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
      customClass: {
        popup: 'animated swing', 
      }, 
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: 'Generando',
          text: `Las facturas mensuales se estan generando`,
          icon: 'info',
          iconColor:'#c1c164',
          heightAuto: false,  
          confirmButtonColor: '#c1c164', 
          confirmButtonText: 'Cerrar'
        })
        // const idProduct: number = product.idProduct as number
        // this.subscription.push(
        //   this.productService.deleteProduct(idProduct).subscribe(
        //     res => {  
        //       this.getProducts();
        //       Swal.fire({
        //         title: 'Desactivar',
        //         text: `Producto ${product.idCode} desactivado`,
        //         icon: 'success',
        //         heightAuto: false, 
        //         confirmButtonColor: '#c1c164', 
        //         confirmButtonText: 'Cerrar'
        //       })
        //       this.showSnack(true, res.message);
        //     },
        //     err => {
        //       console.log(err.error)  
     
        //       this.showSnack(false, err.error.message || 'Imposible Borrar Producto');
        //     }
        //   ) 
        // )
        
      }else{
        Swal.fire({
          title: 'Cancelado',
          text: `Ha decidido no generar las facturas mensuales`,
          icon: 'info',
          iconColor:'#c1c164',
          heightAuto: false,  
          confirmButtonColor: '#c1c164', 
          confirmButtonText: 'Cerrar'
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