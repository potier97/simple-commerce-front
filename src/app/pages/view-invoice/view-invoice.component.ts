import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '@app/services/invoice/invoice.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { InvoiceResponse, DetailsResponse } from '@app/models/invoice';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.css']
})
export class ViewInvoiceComponent implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];
  
  //TABLA PARA EL DETALLE DE LACOMPRA
  displayedColumns: string[] = ['id', 'name', 'tax', 'price', 'amount', 'totalPrice']; 
  dataSource = new MatTableDataSource<DetailsResponse>(); 

  @ViewChild(MatSort) sort: MatSort;
 
  //Datos del cliente de la compra
  invoice: InvoiceResponse;
  //Id de la factura
  idInvoice: number; 

  constructor( 
    private route: ActivatedRoute, 
    private snackbar: MatSnackBar,  
    private router: Router,
    private invoiceService: InvoiceService) { }
 

  ngOnDestroy(): void {
    //UNSUB ALL OBSERVERS.
    for(const sub of this.subscription) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void {  
    //Obtener el id de la factura
    this.subscription.push(
      this.route.params.subscribe(params => {
        this.idInvoice = params['id'] || 1;
         //Obtener los datos de esa factura
          this.subscription.push(
            this.invoiceService.getInvoiceById(this.idInvoice).subscribe(
              res => {
                // console.log('Detalles de la Factura ->', res);
                this.dataSource.data = res.detalles;
                this.invoice = res;
                //getAllInvoicesCreditDebt
                this.showSnack(true, `Factura ${this.idInvoice} Obtenid`);   
              },
              (err: any) => {
                //console.log("Error -> ", err);
                this.showSnack(false, err.error.message || "No se encontró la factura");   
                this.router.navigate(['/invoces'])
              }
            )
          )   

      }) 
    )  

  }

  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort; 
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
