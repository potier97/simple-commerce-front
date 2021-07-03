import {AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'; 
import {MatSort} from '@angular/material/sort';
import { ProductsService } from '@app/services/products/products.service';
import { Subscription } from 'rxjs';
import { ProductsData } from '@app/models/products';
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
    { title: 'Id', name: 'idProduct',  size: "15%"},
    { title: 'Nombre', name: 'name',  size: "30%"},
    { title: 'DNI', name: 'idCode',  size: "10%"},
    { title: 'Stock', name: 'amount',  size: "15%"},
    { title: 'Iva', name: 'tax',  size:"10%"},
    { title: 'Precio', name: 'price',  size: "10%"},
    { title: 'Acción', name: 'accion', size: "10$"},
  ]
 

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private productService: ProductsService) { }

  ngOnInit(): void { 
    this.subscription.push(
      this.productService.getAllProducts().subscribe(
        res => {
          this.dataSource.data = res.content;
          //console.log('del formato', res.content) 
        },
        err => {
          console.log(err) 
        }
      ) 
    )
  }
 
  ngAfterViewInit() { 
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: ProductsData, filter: string): boolean => {
      //console.log("data  del filtro: ", data.idCode, " - - filter: ", filter) 
      return data.idCode.toString().includes(filter) &&  data.active === 1 ;
     };
  }

  ngOnDestroy(): void { 
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 

  clearSearch(): void { 
    this.searchDni = '';
    this.dataSource.filter = "";
  }

  applyFilter(): void { 
    this.dataSource.filter = this.searchDni.trim().toLowerCase();
  }  

  addProduct(): void {
    console.log("Añadiendo producto")
  } 

  editProduct(product: ProductsData): void {
    console.log('Editando producto -> ' , product.idCode)
  }

  updateStock(product: ProductsData): void {
    console.log('Amentando stock de producto -> ' , product.idCode)

  }

  deleteProduct(product: ProductsData): void {
    //console.log('Eliminando producto -> ' , product.idCode)
    Swal.fire({
      title: 'Eliminar producto',
      text: `¿Desea eliminar el producto ${product.idCode}?`,
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonColor: '#c1c164',
      cancelButtonColor: '#226706',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscription.push(
          this.productService.deleteProduct(product.idProduct).subscribe(
            res => { 
              this.subscription.push(
                this.productService.getAllProducts().subscribe(
                  res => {
                    this.dataSource.data = res.content;
                  },
                  err => {
                    console.log(err) 
                  }
                ) 
              )
              Swal.fire({
                title: 'Eliminado',
                text: `Producto ${product.idCode} eliminado`,
                icon: 'success',
                heightAuto: false, 
                confirmButtonColor: '#c1c164', 
                confirmButtonText: 'Cerrar'
              })
            },
            err => {
              console.log(err)  
              Swal.fire({
                title: 'Error',
                text: `Producto ${product.idCode} no ha podido ser eliminado`,
                icon: 'error',
                heightAuto: false, 
                confirmButtonColor: '#c1c164', 
                confirmButtonText: 'Cerrar'
              })
            }
          ) 
        )
        
      }
    })
  }

}
