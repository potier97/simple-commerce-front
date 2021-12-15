import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table'; 
import { MatSort} from '@angular/material/sort'; 
import { ProductsService } from '@app/services/products/products.service';
import { Subscription } from 'rxjs'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2' 
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductsResponse } from '@app/models/products';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];
 
  searchDni: string = "";

  angForm: FormGroup = new FormGroup({ 
    searchUser: new FormControl(''),
  }); 

  //Flag to Spinner data 
  loadingData: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'dni', 'quantity', 'price', 'created', 'accion']; 
  dataSource = new MatTableDataSource<ProductsResponse>();
  columns = [
    { title: 'Id.', name: 'id',  size: "5%"},
    { title: 'Nombre', name: 'name',  size: "15%"},
    { title: 'Documento', name: 'dni',  size: "15%"},
    { title: 'Telefono', name: 'quantity',  size: "15%"},
    { title: 'Correo', name: 'price',  size: "20%"},
    { title: 'Creación', name: 'created',  size:"20%"}, 
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
      private productsService: ProductsService,  
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
      this.productsService.getAllProducts().subscribe(
        res => {
          this.dataSource.data = res;
          // console.log('Productos ->', res) 
          this.loadingData = true
        },
        (err: any) => {
          //console.log(err) 
          this.showSnack(false, 'Imposible Obtener Productos'); 
          this.loadingData = true
        }
      ) 
    )
  }
 
  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
    this.dataSource.filterPredicate = (data: ProductsResponse, filter: string): boolean => { 
      return data.nombre.toString().includes(filter) || data.dni.toString().includes(filter);
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
   
  deleteProduct(user: ProductsResponse): void {
    //console.log('desactivar usuario -> ' , user.idUser)
    //Modal de desactivar el producto
    Swal.fire({
      title: 'Desactivar producto',
      text: `¿Desea desactivar el producto ${user.id}?`,
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
          this.productsService.deleteProduct(user.id!).subscribe(
            res => {  
              this.getClients(); 
              this.showSnack(true, `Producto ${user.id} eliminado`);
            },
            err => {  
              this.showSnack(false, 'Imposible Borrar Producto');
            }
          ) 
        )
        Swal.fire({
          title: 'Desactivado',
          text: `Producto ${user.id} desactivado`,
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
          text: `Producto ${user.id} no ha sido desactivado`,
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
