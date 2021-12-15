import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table'; 
import { MatSort} from '@angular/material/sort'; 
import { ProductsService } from '@app/services/products/products.service';
import { UsersService } from '@app/services/users/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { ClientsResponse } from '@app/models/clients';
import { DetailsBuyResponse, NewBuyResponse, PreDetailsResponse } from '@app/models/new-buy';
import { ProductsResponse } from '@app/models/products';
import { BuyService } from '@app/services/buy/buy.service';
import { Router } from '@angular/router';
import { PaidModesResponse } from '@app/models/paid-modes';
import { PaidModesService } from '@app/services/paid-modes/paid-modes.service';
 

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscription: Subscription[] = [];
  
  //Lista de prodctos que va a comprar
  productsToBuy: PreDetailsResponse[] = []
  //Buscador de cliente por documento 
  searchClientDoc = new FormControl('1', 
    [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]
  );

  //Buscador de modo pago  
  searchPaidMode = new FormControl('1', 
    [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]
  );

  //Lista de los productos a comprar
  productsList: DetailsBuyResponse[]
  //Buscador de productos por el dni
  searchDni: string = ""
  //DATO DEL CLIENTE QUE REALIZA LA COMPRA
  client: ClientsResponse | null = null;
  //Datos del modo de pago
  paidmode: PaidModesResponse | null = null;
  //Flag to Spinner data 
  loadingData: boolean = false; 
  //El valor del total antes de la compra sin aplicar descuento
  preTotal: number = 0;
  // El pre subtotal antes de la compra sin aplicar descuento
  preSubtotal: number = 0;
  //El iva antes de la compra sin aplicar descuento
  preTax: number = 0;
  //Nombres de cada columna de la tabla de productos
  displayedColumns: string[] = ['nombre', 'cantidad', 'precio', 'accion']; 
  dataSource = new MatTableDataSource<ProductsResponse>();
  columns = [ 
    { title: 'Nombre', name: 'nombre',  size: "40%"}, 
    { title: 'Stock', name: 'cantidad',  size: "20%"}, 
    { title: 'Precio', name: 'precio',  size: "20%"},
    { title: 'Agregar', name: 'accion', size: "20%"},
  ] 
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;
 
  constructor(
    private userService: UsersService,
    // private pdfGenerator: InvoiceToPdfService, 
    private router: Router,
    private snackbar: MatSnackBar, 
    private productService: ProductsService,  
    private buyService: BuyService, 
    private paidModesService: PaidModesService, 
  ) { }

  ngOnInit(): void {
    //OBTENER LA LISTA DE TODOS LOS PRODUCTOS
    this.getProducts();
  }

  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 

  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
    this.dataSource.filterPredicate = (data: ProductsResponse, filter: string): boolean => { 
      return data.nombre.toString().includes(filter) || data.dni.toString().includes(filter);
     };
  }
  
  //Buscar modos de pago
  onSearchPaidMode(): void { 
    //Buscar los productos por el documento
    if(this.searchPaidMode.valid){
      this.subscription.push(
        this.paidModesService.getPaidModeById(this.searchPaidMode.value).subscribe(
          res => {
              this.paidmode = res;
              this.showSnack(true,  'Modo de pago Obtenido'); 
              this.searchPaidMode.reset();
              this.searchPaidMode.disable();
          },
          (err: any) => {
            //console.log(err) 
            this.showSnack(false,  'Modo de pago No Encontrado'); 
          }
        )
      )
    }
  } 

  //Limpiar entrada de búsqueda de modos de pago
  clearPaidModeSearch(): void {   
    this.searchPaidMode.reset(); 
  }
 
  //Buscar cliente por su documento
  searchClient(): void { 
    //Buscar los productos por el documento
    if(this.searchClientDoc.valid){
      this.subscription.push(
        this.userService.getClientById(this.searchClientDoc.value).subscribe(
          res => {
              this.client = res;
              this.showSnack(true,  'Cliente Obtenido'); 
              this.searchClientDoc.reset();
              this.searchClientDoc.disable();
          },
          (err: any) => {
            //console.log(err) 
            this.showSnack(false,  'Cliente No Encontrado'); 
          }
        )
      )
    }
  } 

  //Limpiar entrada de búsqueda de usuario
  clearClientSearch(): void {   
    this.searchClientDoc.reset(); 
  }

  //Buscar producto por el dni
  searchProduct(): void { 
    //Filtra los porductos por el DNI
    this.dataSource.filter = this.searchDni.trim().toLowerCase();
  }

  //Limpiar búsqueda de producto
  clearProductSearch(): void { 
    this.searchDni = '';
    this.dataSource.filter = "";
  }

  //Obtenr todos los productos del store
  getProducts(): void {
    this.subscription.push(
      this.productService.getAllProducts().subscribe(
        res => {
          this.dataSource.data = res; 
          this.loadingData = true
        },
        (err: any) => { 
          this.showSnack(false, 'Imposible Obtener Productos'); 
          this.loadingData = true
        }
      ) 
    )
  }

  async onChangeAmontProduct(e: any, product: PreDetailsResponse): Promise<void> {
    //Nuevo valor del input value
    const newAmount: number = e.target.value; 
    //Actualizar los valores de la compra
    const idProduct = product.id;
    this.productsToBuy = await this.productsToBuy.map((p: PreDetailsResponse) => {
      if(p.id === idProduct){
        const nuevaCantidad: number = Number.parseInt(newAmount.toString());
        const nuevoTotal: number = nuevaCantidad * p.precio;
        return {
          ...p,
          cantidad: nuevaCantidad,
          total: nuevoTotal,
        }
      }
      return { ...p };
    });
  }


  // Agregar productos a la canasta
  async addProduct(product: PreDetailsResponse): Promise<void> {
    const idProduct = product.id!;
    const existOnList: boolean = this.productsToBuy.some((p: PreDetailsResponse) => p.id === idProduct);
    // console.log("El producto existe -> ", existOnList)
    if(!existOnList){
      const newProductData: PreDetailsResponse = {
        id: idProduct,
        nombre: product.nombre,
        precio: product.precio,
        total: product.precio,
        cantidad: 1,
      };
      this.productsToBuy.push(newProductData);
    }else{
      this.productsToBuy = this.productsToBuy.map((p: PreDetailsResponse) => {
        if(p.id === idProduct){
          const cantidadActual: number = p.cantidad
          const nuevaCantidad: number = cantidadActual + 1;
          const nuevoTotal: number = nuevaCantidad * p.precio;
          return {
            ...p,
            cantidad: nuevaCantidad,
            total: nuevoTotal
          };
        }
        return { ...p };
      });
    } 
  }

  //Remover un producto del carro
  async removeProduct(product: PreDetailsResponse): Promise<void> {
    // console.log("Removiendo Producto -> ", product)
    this.productsToBuy = await this.productsToBuy.filter(p => p.id !== product.id)
  }

  //Cancelar compra
  buyCancel(): void {
    this.clearProductSearch();
    this.productsToBuy = [];
    this.productsList = [];
    this.client = null;
    this.searchClientDoc.enable();
    this.paidmode = null;
    this.searchPaidMode.enable();
  }

  //Realizar compra - abrir dialodo y obtener la oferta qe aplica a la compra
  async buy(): Promise<void> { 
    try {
      if(this.client !== null && this.paidmode !== null && this.productsToBuy.length > 0){
        this.loadingData = false;
        const listProducts = await this.productsToBuy.map(
          (p: PreDetailsResponse) => { return { cantidad: p.cantidad, id: p.id }});
        const newBuy: NewBuyResponse = {
          cliente: this.client!.id!,
          total: 0,
          subtotal: 0,
          modoPago: this.paidmode?.id!,
          iva: 0,
          fecha: new Date(),
          estado: 1,
          details: listProducts
        }
        console.log(newBuy);
        this.subscription.push(
          this.buyService.newBuy(newBuy).subscribe(
            res => { 
              const id = res.id;
              this.showSnack(true, `Compra ${id} registrada`); 
              this.loadingData = true
              this.buyCancel(); 
              this.router.navigate(['/buy'])
            },
            (err: any) => { 
              this.showSnack(false, 'Imposible realizar compra'); 
              this.loadingData = true
              this.buyCancel();
            }
          )
        )
      }
    } catch (error) {
      this.loadingData = true
      this.showSnack(false, 'Imposible Realizar compra'); 
      this.buyCancel();
    }
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
