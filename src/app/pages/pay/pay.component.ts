import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table'; 
import { MatSort} from '@angular/material/sort'; 
import { PayService } from '@app/services/pay/pay.service';
import { Subscription } from 'rxjs';
import { PaymentData } from '@app/models/payment'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent  implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];

  searchDate: string = ""
  //Flag to Spinner data 
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
      private payService: PayService,  
    ) { }

  ngOnInit(): void { 
    this.getProducts();
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
