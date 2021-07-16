import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '@app/services/invoice/invoice.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { InvoiceData } from '@app/models/invoice';
import { ProductDetailsData } from '@app/models/product-details';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.css']
})
export class ViewInvoiceComponent implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];
  
  displayedColumns: string[] = ['id', 'name', 'tax', 'price', 'amount', 'totalPrice']; 
  dataSource = new MatTableDataSource<ProductDetailsData>(); 

  @ViewChild(MatSort) sort: MatSort;

 
  //Datos del cliente de la compra
  invoice: InvoiceData;
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
        this.idInvoice = params['id'];

        //Obtener el detalle de la factura
        this.subscription.push(
          this.invoiceService.getDetailsInvoiceById(this.idInvoice).subscribe(
            res => {
              //console.log('Response ->', res); 
              this.dataSource.data = res.content;
              //this.showSnack(true, res.message);   
            },
            err => {
              //console.log("Error -> ", err);
              this.showSnack(false, err.error.message || "No se encontró la factura");   
            }
          )
        ) 
         //Obtener los datos de esa factura
          this.subscription.push(
            this.invoiceService.getInvoiceById(this.idInvoice).subscribe(
              res => {
                //console.log('Detalles de la Factura ->', res);
                this.invoice = res.content;
                this.showSnack(true, res.message);   
              },
              err => {
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
