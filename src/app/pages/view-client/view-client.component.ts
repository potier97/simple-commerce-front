import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '@app/services/users/users.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserData } from '@app/models/user'; 
import { InvoiceService } from '@app/services/invoice/invoice.service';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceData } from '@app/models/invoice';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
 

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit, OnDestroy  {
 

  private subscription: Subscription[] = [];
  //LOADING DE SPINNERDE CARGA
  loadingData: boolean = false; 
  //cLIENTE QUE SE ESTA VISALIZANDO - CONTIEE TODOS LOS DATOS DE ESE CLIENTE 
  client: UserData;
  //ID DEL CLIENTE
  idClient: number;
  // NOMBRE DE LAS COLMNAS QUE SE VA A VISUALIZAR DE TODAS LAS FACTRAS
  displayedColumns: string[] = ['idBuy', 'purchaseDate', 'subtotal', 'tax', 'discount', 'total', 'idPayType', 'accion']; 
  dataSource = new MatTableDataSource<InvoiceData>();

  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;

  constructor( 
    private route: ActivatedRoute, 
    private snackbar: MatSnackBar,  
    private router: Router,
    private invoiceService: InvoiceService,
    private usersService: UsersService) { }
 

  //Remover todos los subscripciones de los servicios
  ngOnDestroy(): void { 
    for(const sub of this.subscription) {
      sub.unsubscribe();
    }
  }

  //Cargar los datos de ese cliente 
  //Obtener todas las compras que ha realizado ese cliente
  ngOnInit(): void {  
      //Obtener el id del cliente que se pretende visualizar
      this.subscription.push(
        this.route.params.subscribe(params => {
          this.idClient = params['id'];
          //Obtener los datos del cliente
          this.subscription.push(
            this.usersService.getClientById(this.idClient).subscribe(
              res => {
                //console.log('Response ->', res)
                this.client = res.content;
                this.showSnack(true, res.message); 
                //Obtener todas las COMPRAS de un cliente "FACTURAS"
                this.subscription.push(
                  this.invoiceService.getAllInvoicesByClient(this.idClient).subscribe(
                    res => {
                      //console.log('Response ->', res)
                      this.dataSource.data = res.content;
                      this.loadingData = true
                      //this.client = res.content;
                      //this.showSnack(true, res.message);   
                    },
                    err => {
                      this.loadingData = true
                      //console.log(err)
                      this.showSnack(false, err.error.message || "No se encontró el cliente");   
                    }
                  )
                )  
              },
              err => {
                //console.log(err)
                this.showSnack(false, err.error.message || "No se encontró el cliente");   
                this.router.navigate(['/products'])
              }
            )
          )  
        }) 
      ) 
  }

  //CONFIGURACIONES DE LA TABLA PARA PODER FILTRAR Y PAGINAR
  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
  }
  
  //Mostar mensajes de exito o error
  showSnack(status: boolean, message: string, timer: number = 6500): void {
    this.snackbar.open(message, undefined , {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: timer,
      panelClass: [status ? "succes-snack" : "error-snack"],
    })
  }

}

