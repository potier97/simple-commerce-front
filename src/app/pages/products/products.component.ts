import {AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'; 
import {MatSort} from '@angular/material/sort';
import {MatDialog, } from '@angular/material/dialog';
import { ProductsService } from '@app/services/products/products.service';
import { Subscription } from 'rxjs';
import { ProductsData } from '@app/models/products';
import { CustomDialogComponent } from '@app/components/custom-dialog/custom-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2' 


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];

  searchDni: string = ""
  displayedColumns: string[] = ['idProduct', 'name', 'idCode', 'amount', 'tax', 'accion']; 
  dataSource = new MatTableDataSource<ProductsData>();
  columns = [
    { title: 'Id', name: 'idProduct',  size: "5%"},
    { title: 'Nombre', name: 'name',  size: "30%"},
    { title: 'DNI', name: 'idCode',  size: "15%"},
    { title: 'Stock', name: 'amount',  size: "15%"},
    { title: 'Iva', name: 'tax',  size:"15%"},
    { title: 'Precio', name: 'price',  size: "10%"},
    { title: 'Acción', name: 'accion', size: "10$"},
  ] 
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;

  constructor(  
      private snackbar: MatSnackBar, 
      private dialog: MatDialog,  
      private productService: ProductsService,  
    ) { }

  ngOnInit(): void { 
    this.getProducts();
  }

  getProducts(): void {
    this.subscription.push(
      this.productService.getAllProducts().subscribe(
        res => {
          this.dataSource.data = res.content;
          //console.log('Prodctos ->', res.content) 
        },
        err => {
          console.log(err) 
          this.showSnack(false, 'Imposible Obtener Productos'); 
        }
      ) 
    )
  }
 
  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
    this.dataSource.filterPredicate = (data: ProductsData, filter: string): boolean => { 
      return data.idCode.toString().includes(filter) &&  data.active === 1 ;
     };
  }

  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 
 
  updateStock(product: ProductsData): void {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      panelClass: ['animate__animated','animate__swing'],
      width: '50%',  
      disableClose: true, 
      data: {
        tittle: `Añadir Stock a ${product.name}`,
         animal: 'sdcsdcsdc'
        }
    });
    this.subscription.push(
      dialogRef.afterClosed().subscribe((result: any) => {
        if(result.status){  
          const updateProductData = {
            idProduct: product.idProduct,
            amount: result.data.amount,
            idCode: product.idCode
          } 
          console.log(updateProductData);
          //Al cerrar el modal - se envia al api la peticion de incrementar la cantidad de registros
          this.subscription.push(
            this.productService.increaseProduct(updateProductData).subscribe(
              res => { 
                console.log('de actualizar el producto', res.content) 
                this.showSnack(true, res.message);  
                this.getProducts();
              },
              err => {
                console.log(err.error) 
                this.showSnack(false, err.error.message); 
              }
            ) 
          )
        }
      })
    )
  }

  clearSearch(): void { 
    this.searchDni = '';
    this.dataSource.filter = "";
  }

  applyFilter(): void { 
    //Filtra los porductos por el DNI
    this.dataSource.filter = this.searchDni.trim().toLowerCase();
  }  
 
  editProduct(product: ProductsData): void {
    console.log('Editando producto -> ' , product.idCode)
  } 

  deleteProduct(product: ProductsData): void {
    //console.log('Eliminando producto -> ' , product.idCode)
    //Modal de eliminar el producto
    Swal.fire({
      title: 'Eliminar producto',
      text: `¿Desea eliminar el producto ${product.idCode}?`,
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonColor: '#c1c164',
      cancelButtonColor: '#226706',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      customClass: {
        popup: 'animated swing', 
      }, 
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscription.push(
          this.productService.deleteProduct(product.idProduct).subscribe(
            res => {  
              this.getProducts();
              Swal.fire({
                title: 'Eliminado',
                text: `Producto ${product.idCode} eliminado`,
                icon: 'success',
                heightAuto: false, 
                confirmButtonColor: '#c1c164', 
                confirmButtonText: 'Cerrar'
              })
              this.showSnack(true, res.message);
            },
            err => {
              console.log(err.error)  
              Swal.fire({
                title: 'Error',
                text: `Producto ${product.idCode} no ha podido ser eliminado`,
                icon: 'error',
                heightAuto: false, 
                confirmButtonColor: '#c1c164', 
                confirmButtonText: 'Cerrar'
              })
              this.showSnack(false, err.error.message);
            }
          ) 
        )
        
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
