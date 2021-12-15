import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table'; 
import { MatSort} from '@angular/material/sort'; 
import { InvoiceService } from '@app/services/invoice/invoice.service';
import { Subscription } from 'rxjs'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2' 
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InvoiceResponse } from '@app/models/invoice';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];
 
  searchDni: string = "";

  angForm: FormGroup = new FormGroup({ 
    searchUser: new FormControl(''),
  }); 

  //Flag to Spinner data 
  loadingData: boolean = false;
  displayedColumns: string[] = ['id', 'done', 'subtotal', 'iva', 'total', 'client', 'accion']; 
  dataSource = new MatTableDataSource<InvoiceResponse>();
  columns = [
    { title: 'Id.', name: 'id',  size: "5%"},
    { title: 'Registro', name: 'done',  size: "20%"},
    { title: 'Subtotal', name: 'subtotal',  size: "15%"},
    { title: 'Iva', name: 'iva',  size: "15%"},
    { title: 'Total', name: 'total',  size: "15%"},
    { title: 'Cliente', name: 'client',  size:"20%"}, 
    { title: 'Acción', name: 'accion', size: "10%"},
  ] 
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;

  account_validation_messages = {
    searchUser: [
      { type: 'required', message: 'Ingrese un nombre' },
    ], 
  }; 

  constructor(  
      private snackbar: MatSnackBar,  
      private fb: FormBuilder,  
      private invoiceService: InvoiceService,  
    ) { }

  ngOnInit(): void { 
    this.getClients();
    this.angForm = this.fb.group({  
      searchUser: new FormControl(
        '',
        Validators.compose([ 
          Validators.required,
        ])
      ) 
    }); 
  }

  getClients(): void {
    this.subscription.push(
      this.invoiceService.getAllInvoices().subscribe(
        res => {
          this.dataSource.data = res;
          // console.log('Facturas ->', res) 
          this.loadingData = true
        },
        (err: any) => {
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
    this.dataSource.filterPredicate = (data: InvoiceResponse, filter: string): boolean => { 
      return data.id.toString().includes(filter) || data.idCliente.nombre.includes(filter);
     };
  }

  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 
   
  clearSearch(): void {   
    this.searchDni = '';
    this.dataSource.filter = "";
  }

  applyFilter(): void { 
    //Filtra los porductos por el DNI
    this.dataSource.filter = this.searchDni.trim().toLowerCase();
  } 

  deleteProduct(user: InvoiceResponse): void {
    //console.log('desactivar usuario -> ' , user.idUser)
    //Modal de desactivar el producto
    Swal.fire({
      title: 'Desactivar Factura',
      text: `¿Desea desactivar la factura ${user.id}?`,
      icon: 'warning',
      iconColor:'#c1c164',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonColor: '#c1c164',
      cancelButtonColor: '#226706',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Desactivar',
      showClass: {
        popup: 'animate__animated animate__swing'
      }, 
    }).then((result) => {
      if (result.isConfirmed) {
        //Se comenta la fncionalidad de eleiminar n usario (logico)
        this.subscription.push(
          this.invoiceService.deleteInvoice(user.id!).subscribe(
            res => {  
              this.getClients(); 
              this.showSnack(true, `Factura ${user.id} eliminada`);
            },
            err => {
              this.showSnack(false, 'Imposible Borrar Factura');
            }
          ) 
        )
        Swal.fire({
          title: 'Desactivado',
          text: `Factura ${user.id} desactivada`,
          icon: 'success',
          iconColor:'#c1c164',
          heightAuto: false, 
          confirmButtonColor: '#c1c164', 
          confirmButtonText: 'Cerrar',
          showClass: {
            popup: 'animate__animated animate__swing'
          }  
        }) 
      }else {
        Swal.fire({
          title: 'Cancelado',
          text: `Factura ${user.id} no ha sido desactivada`,
          icon: 'info',
          iconColor:'#c1c164',
          heightAuto: false, 
          confirmButtonColor: '#c1c164', 
          confirmButtonText: 'Cerrar',
          showClass: {
            popup: 'animate__animated animate__swing'
          }  
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
