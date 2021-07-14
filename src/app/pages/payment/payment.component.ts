import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table'; 
import { MatSort} from '@angular/material/sort'; 
import { UserData } from '@app/models/user';
import { InvoiceToPdfService } from '@app/services/invoiceToPdf/invoice-to-pdf.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from '@app/services/products/products.service';
import { OfferService } from '@app/services/offer/offer.service';
import { UsersService } from '@app/services/users/users.service';
import { BuyService } from '@app/services/buy/buy.service';
import { ProductsData } from '@app/models/products'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { ProductDetailsData } from '@app/models/product-details';
import { NewBuyDialogComponent } from '@app/components/new-buy-dialog/new-buy-dialog.component';
import { PaymentTypeData } from '@app/models/payment-type';
import { FinancingTypesData } from '@app/models/financing-type';
import { PayService } from '@app/services/pay/pay.service';
import { OfferData } from '@app/models/offer';
 

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscription: Subscription[] = [];
  //Lista de todos los tipos de  pago
  paymentsTypes: PaymentTypeData[] = [];
  //Lista de todos los medios de  pago
  paymentsMethods: PaymentMethodData[] = [];
  //Listado de todos las cuotas por tipo de usuario
  financingTypes: FinancingTypesData[] = [];
  //LISTA DE TODAS LAS OFERTAS
  offers: OfferData[] = [];
  //Datos del administrador
  userAdmin: UserData;
  //Lista de prodctos que va a comprar
  productsToBuy: ProductDetailsData[] = []
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
  //El valor del total antes de la compra sin aplicar descuento
  preTotal: number = 0;
  // El pre subtotal antes de la compra sin aplicar descuento
  preSubtotal: number = 0;
  //El iva antes de la compra sin aplicar descuento
  preTax: number = 0;
  //Nombres de cada columna de la tabla de productos
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
    private buyService: BuyService,
    private userService: UsersService,
    private payService: PayService, 
    private offerService: OfferService, 
    private pdfGenerator: InvoiceToPdfService,
    private dialog: MatDialog,  
    private snackbar: MatSnackBar, 
    private productService: ProductsService,  
  ) { }

  ngOnInit(): void {
    //OBTENER LA LISTA DE TODOS LOS PRODUCTOS
    this.getProducts();
    //OBTENER LA INFO DEL ADMIN
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
    //OBTENER LA INFO DE TODOS LOS METODOS DE PAGO - EFECTIVO - COMBINADO - TARJETA
    this.subscription.push(
      this.payService.getAllMethodsPayments().subscribe(
        res => {
          this.paymentsMethods = res.content;
          console.log('METODOS ->', res.content)  
        },
        err => {
          console.log("Error al obtener los MÉTODOS de pago -> ", err)  
        }
      )  
    )
    //OBTENER LA INFO DE TODOS LOS TIPOS DE PAGO - CONTADO O A CREDITO
    this.subscription.push(
      this.payService.getAllTypesPayments().subscribe(
        res => {
          this.paymentsTypes = res.content;
          console.log('TIPOS ->', res.content)  
        },
        err => {
          console.log("Error al obtener los TIPOS de pago -> ", err)  
        }
      )  
    )
    //OBTENER LA INFO DE TODOS LOS TIPOS DE FINANCICIÓN - 12 - 24 - 36 MESES
    this.subscription.push(
      this.payService.getAllFinancingTypes().subscribe(
        res => {
          this.financingTypes = res.content;
          console.log('FINANCIACIÓN ->', res.content)  
        },
        err => {
          console.log("Error al obtener los TIPOS de FINANCIACIÓN -> ", err)  
        }
      )  
    ) 
    //OBTENER LA LISTA DE TODAS LAS OFERTAS DE LA COMPRA
    this.subscription.push(
      this.offerService.getAllOffers().subscribe(
        res => {
          this.offers = res.content;
          console.log('OFERTAS ->', res.content)  
        },
        err => {
          console.log("Error al obtener las OFERTAS -> ", err)  
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
            console.log('Dato del cliente ->', res.content);  
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
    this.searchClientDoc.reset(); 
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

  async onChangeAmontProduct(e: any, product: ProductDetailsData): Promise<void> {
    //Nuevo valor del input value
    const newAmount: number = e.target.value; 
    //Actualizar los valores de la compra
    const idProduct = product.idNumProducto;
    this.productsToBuy = await this.productsToBuy.map((p: ProductDetailsData) => {
      if(p.idNumProducto === idProduct){
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
    await this.onGetTotalVaue();
    //console.log("Actualizando el valor del producto -> ", product);
  }

  async onGetTotalVaue(): Promise<void> {
    //Calcular el total de la compra
    const total: number = await this.productsToBuy.reduce((totalValue: number, currentValue: ProductDetailsData ) => totalValue+=currentValue.total , 0);
    //console.log("El valor total es -> ", total);
    //Calclar el valor del iva en la compra
    const tax: number = await this.productsToBuy.reduce((totalTax: number, currentValue: ProductDetailsData ) => currentValue.iva > 0 ? totalTax+=(currentValue.total*(currentValue.iva/100)) : totalTax=totalTax , 0);
    //console.log("El Valor del iva es -> ", tax);
    //Calcular el total de la compra
    const subTotal: number = await total - tax;
    //console.log("El valor subtotal es -> ", subTotal); 
    //Valores presentados en la vista
    this.preTotal = total;
    this.preSubtotal = subTotal;
    this.preTax = tax;
  }


  async addProduct(product: ProductsData): Promise<void> {
    const idProduct = product.idProduct;
    const existOnList: boolean = await this.productsToBuy.some((p: ProductDetailsData) => p.idNumProducto === idProduct);
    //console.log("El producto existe -> ", existOnList)
    if(!existOnList){
      const cantidad = 1;
      const total = product.price*cantidad;
      const newProductData: ProductDetailsData = {
        idDetalle: null,
        name: product.name, 
        idNumProducto: product.idProduct,
        idNumFactura: null,
        cantidad: 1, 
        iva: product.tax,
        precio: product.price,
        total: total 
      };
      //console.log("Añadiendo Producto -> ", product);
      this.productsToBuy.push(newProductData);
    }else{
      this.productsToBuy = this.productsToBuy.map((p: ProductDetailsData) => {
        if(p.idNumProducto === idProduct){
          const cantidadActual: number = p.cantidad
          const nuevaCantidad: number = cantidadActual + 1;
          const nuevoTotal: number = nuevaCantidad * p.precio;
          return {
            ...p,
            cantidad: nuevaCantidad,
            total: nuevoTotal,
          };
        }
        return { ...p };
      });
      //console.log("El producto ya se habia añadido -> ", product);
    } 
    await this.onGetTotalVaue();
  }

  removeProduct(product: ProductDetailsData): void {
    console.log("Removiendo Producto -> ", product)
    this.productsToBuy = this.productsToBuy.filter(p => p.idNumProducto !== product.idNumProducto)
  }

  buyCancel(): void {
    this.clearProductSearch();
    this.productsToBuy = [];
    console.log("Cancelando compra");
    this.client = null;
    this.searchClientDoc.enable();
  }

  buy(): void {
    //console.log("Realizando  compra");
    const dialogRef = this.dialog.open(NewBuyDialogComponent, {
      panelClass: ['animate__animated','animate__swing'],
      width: '70%',  
      //height: '70%',
      disableClose: true, 
      data: {
        tittle: 'Pago de Compra - Te lo Tengo',  
        buttonLabel: "Confirmar Compra",  
        paymentsMethods: this.paymentsMethods,  // Lista de los metodos de pago  
        paymentsTypes: this.paymentsTypes,       //Lista de los tipos de pago  
        financingTypes: this.financingTypes,   // Lista de los tipos de financiacion
        offers: this.offers,                   //Lista de los tipos de  ofertas
        client: this.client,                   //cliente
        //constrainInputOne: '^[0-9]*$', 
        subtotal: this.preSubtotal, 
        tax: this.preTax, 
        total: this.preTotal,
        }
    });
    this.subscription.push(
      dialogRef.afterClosed().subscribe((result: any) => {
        if(result.status){  
          console.log(result.data)
           
          const paymentData: any = {
            idPay: 50,
          }   

          //Al enviar el formulario se realiza el registro de la compra.
          //La RESPUESTA PERMITIRÁ CREAR EL RECIBO DE PAGO.
          this.subscription.push(
            this.buyService.createProduct(paymentData).subscribe(
              res => { 
                console.log('Compra Realizada -> ', res) 
                //NOMBRE COMPLETO DEL ADMINISTRADOR
                const AdminData = `${this.userAdmin.name} ${this.userAdmin.lastName}`
                this.pdfGenerator.generatePdf( 
                    AdminData, 
                    this.client!, 
                    this.productsToBuy,
                    10, 
                    this.preSubtotal, 
                    this.preTax, 
                    0, 
                    this.preTotal);
                this.showSnack(true, res.message);  
                this.getProducts();
                this.buyCancel(); 
              },
              err => {
                console.log(err.error) 
                this.showSnack(false, err.error.message || `No se pudo registrar la compra`); 
              }
            ) 
          )
        }
      })
    )  
  }
  

  //Metodo de ejmplo de como funciona el generar un pdf
  // onCreatePdf() {
  //   const customerData: UserData = {
  //     name: 'Pepito',
  //     lastName: 'Perez', 
  //     userAddress: 'Trv 39a 23 SUR',
  //     userMail: 'pepitoPeres@email.com',
  //     userPhone: '314569852',
  //     idUser: null,
  //     idDocType: {
  //       idDocType: 1, 
  //       name: 'CC'
  //     }, 
  //     idUserType: {
  //       idUserType: 1,
  //       name: 'NATURAL'
  //     }, 
  //     associated: null,
  //     userDoc: 1032494843, 
  //     userPass: 'pass123', 
  //     userCreated: '10/10/2018'
  //   }
  //   const  productsData: ProductDetailsData[] = [
  //     {
  //       name: 'Tv Samsung 32 Plgadas', 
  //       precio: 1250000, 
  //       cantidad: 3,
  //       iva: 18,
  //       total: 3550000,
  //       idDetalle: null, 
  //       idNumProducto: 1, 
  //       idNumFactura: null
  //       //el valor del producto sin iva total/(tax/100 + 1) =>  3550000/1.18 = 3008474.57
  //       // el valor del iva es igual a => total - valorSinIva => 3550000 - 3008474.57 = 541525.43
  //       //taxValue: 541525.43
  //     },
  //     {
  //       name: 'Usb 32 Gb', 
  //       precio: 80000, 
  //       cantidad: 5,
  //       iva: 18,
  //       total: 400000,
  //       idDetalle: null, 
  //       idNumProducto: 1, 
  //       idNumFactura: null 
  //       //el valor del producto sin iva total/(tax/100 + 1) =>  400000/1.18 = 338983.05
  //       // el valor del iva es igual a => total - valorSinIva => 400000 - 338983.05 = 61016.95
  //       //taxValue: 61016.95
  //     },
  //     {
  //       name: 'Celular Xiamoi S9', 
  //       precio: 950000, 
  //       cantidad: 1,
  //       iva: 0,
  //       total: 950000 ,
  //       idDetalle: null, 
  //       idNumProducto: 1, 
  //       idNumFactura: null
  //       //el valor del producto sin iva total/(tax/100 + 1) =>  400000 (no aplica iva) = 400000
  //       // el valor del iva es igual a => 0
  //       //taxValue: 0
  //     },
  //   ]  
  //   const invoiceId = 753
  //   const subtotal = 4900000
  //   //541525.43 +  61016.95 + 0 
  //   const totalTax = 602542.38 
  //   // en el caso de que aplique un descuento del 17% a la compra
  //   // El Valor del descuento =>  subtotal*(descuento/100) => 4900000*0.17
  //   // el descuento es del => 833000
  //   const discount = 833000
  //   //El total es el subtotal menos el descuento aplicado - si no aplica, el valor de la compra es igual al del total
  //   const total = 4067000
  //   //Obtener el nombre del administrador
  //   const AdminData = `${this.userAdmin.name} ${this.userAdmin.lastName}`
  //   this.pdfGenerator.generatePdf( AdminData, customerData, productsData, invoiceId, subtotal, totalTax, discount, total);
  // }



  showSnack(status: boolean, message: string, timer: number = 6500): void {
    this.snackbar.open(message, undefined , {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: timer,
      panelClass: [status ? "succes-snack" : "error-snack"],
    })
  }

}
