import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table'; 
import { MatSort} from '@angular/material/sort';
import { CustomerPdf, InvoicePdf } from '@app/models/invoice-pdf';
import { UserData } from '@app/models/user';
import { InvoiceToPdfService } from '@app/services/invoiceToPdf/invoice-to-pdf.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from '@app/services/products/products.service';
import { UsersService } from '@app/services/users/users.service';
import { IncrementeProduct, ProductsData } from '@app/models/products';
import { CustomDialogComponent } from '@app/components/custom-dialog/custom-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2' 
 

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscription: Subscription[] = [];
  //Datos del administrador
  userAdmin: UserData;
  //Lista de prodctos que va a comprar
  productsToBuy: ProductsData[] = []
  //Buscador de cliente por documento 
  searchClientDoc = new FormControl('1035442546', 
    [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(3),
    ]
  );
  //Buscador de productos por el dni
  searchDni: string = ""
  //DATO DEL CLIENTE QUE REALIZA LA COMPRA
  client: UserData | null = null;
  //Flag to Spinner data 
  loadingData: boolean = false;
  displayedColumns: string[] = ['name', 'amount', 'price', 'accion']; 
  dataSource = new MatTableDataSource<ProductsData>();
  columns = [ 
    { title: 'Nombre', name: 'name',  size: "55%"}, 
    { title: 'Stock', name: 'amount',  size: "15%"}, 
    { title: 'Precio', name: 'price',  size: "15%"},
    { title: 'Agregar', name: 'accion', size: "15%"},
  ] 
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;
 
  constructor(
    private userService: UsersService,
    private pdfGenerator: InvoiceToPdfService,
    private dialog: MatDialog,  
    private snackbar: MatSnackBar, 
    private productService: ProductsService,  
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.subscription.push(
      this.userService.getAdminProfile().subscribe(
        async res => { 
          //console.log("Admin ", res) 
          this.userAdmin = res.content; 
        },
        err => {
          console.log(err)   
        }
      )
    )
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
    this.dataSource.filterPredicate = (data: ProductsData, filter: string): boolean => { 
      return data.idCode.toString().includes(filter) &&  data.active === 1 ;
     };
  }
 
  
  //Buscar cliente por su documento
  searchClient(): void { 
    //Buscar los productos por el documento
    if(this.searchClientDoc.valid){
      this.subscription.push(
        this.userService.findByDoc(this.searchClientDoc.value).subscribe(
          res => {
            //console.log('Dato del cliente ->', res.content);  
            if(res.content[0] !== undefined){
              this.client = res.content[0];
              this.showSnack(true,  res.message || 'Cliente Obtenido'); 
              this.searchClientDoc.reset();
              this.searchClientDoc.disable();
            }else{
              this.showSnack(false, 'Cliente No Encontrado'); 
            }
          },
          err => {
            console.log(err) 
            this.showSnack(false,  err.error.message || 'Cliente No Encontrado'); 
          }
        )
      )
    }
  } 

  //Limpiar entrada de busqueda de usuario
  clearClientSearch(): void {   
      this.client = null;
      this.searchClientDoc.enable();
  }

  
  //Buscar producto por el dni
  searchProduct(): void { 
    //Filtra los porductos por el DNI
    this.dataSource.filter = this.searchDni.trim().toLowerCase();
  }

  //Limpiar busqueda de producto
  clearProductSearch(): void { 
    this.searchDni = '';
    this.dataSource.filter = "";
  }

  getProducts(): void {
    this.subscription.push(
      this.productService.getAllProducts().subscribe(
        res => {
          this.dataSource.data = res.content;
          //console.log('Productos ->', res.content) 
          this.loadingData = true
        },
        err => {
          //console.log(err) 
          this.showSnack(false, 'Imposible Obtener Productos'); 
          this.loadingData = true
        }
      ) 
    )
  }


  addProduct(product: ProductsData): void {
    //console.log("Añadiendo Producto -> ", product)
    this.productsToBuy.push(product)
  }

  removeProduct(product: ProductsData): void {
    console.log("Removiendo Producto -> ", product)
    this.productsToBuy = this.productsToBuy.filter(p => p.idCode !== product.idCode)
  }

  buyCancel(): void {
    this.clearProductSearch();
    this.clearClientSearch();
    this.productsToBuy = [];
    console.log("Cancelando compra");
  }

  buy(): void {
    console.log("Realizando  compra");
  }
  


  generatePdf() {
 

    const customerData: CustomerPdf = {
      customerName: 'Pepito Perez',
      address: 'Trv 39a 23 SUR',
      email: 'pepitoPeres@email.com',
      contactNo: '314569852'
    }
    const  productsData: InvoicePdf[] = [
      {
        name: 'Tv Samsung 32 Plgadas', 
        price: 1250000, 
        qty: 3,
        tax: 18,
        total: 3550000 
        //el valor del producto sin iva total/(tax/100 + 1) =>  3550000/1.18 = 3008474.57
        // el valor del iva es igual a => total - valorSinIva => 3550000 - 3008474.57 = 541525.43
        //taxValue: 541525.43
      },
      {
        name: 'Usb 32 Gb', 
        price: 80000, 
        qty: 5,
        tax: 18,
        total: 400000 
        //el valor del producto sin iva total/(tax/100 + 1) =>  400000/1.18 = 338983.05
        // el valor del iva es igual a => total - valorSinIva => 400000 - 338983.05 = 61016.95
        //taxValue: 61016.95
      },
      {
        name: 'Celular Xiamoi S9', 
        price: 950000, 
        qty: 1,
        tax: 0,
        total: 950000 
        //el valor del producto sin iva total/(tax/100 + 1) =>  400000 (no aplica iva) = 400000
        // el valor del iva es igual a => 0
        //taxValue: 0
      },
    ]  
    
    const invoiceId = 753
    const subtotal = 4900000
    //541525.43 +  61016.95 + 0 
    const totalTax = 602542.38 
    // en el caso de que aplique un descuento del 17% a la compra
    // El Valor del descuento =>  subtotal*(descuento/100) => 4900000*0.17
    // el descuento es del => 833000
    const discount = 833000
    //El total es el subtotal menos el descuento aplicado - si no aplica, el valor de la compra es igual al del total
    const total = 4067000

    const AdminData = `${this.userAdmin.name} ${this.userAdmin.lastName}`
    this.pdfGenerator.generatePdf( AdminData, customerData, productsData, invoiceId, subtotal, totalTax, discount, total);
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
