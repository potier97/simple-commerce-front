import {AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'; 
import {MatSort} from '@angular/material/sort'; 
import { Subscription } from 'rxjs'; 
import { OfferData } from '@app/models/offer';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2' 
import { OfferService } from '@app/services/offer/offer.service';
 
@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];
  
  searchDescription: string = ""
  //Flag to Spinner data 
  loadingData: boolean = false;
  displayedColumns: string[] = ['idOffer', 'description', 'idOfferType', 'percentage', 'accion']; 
  dataSource = new MatTableDataSource<OfferData>();
  columns = [
    { title: 'Id', name: 'idOffer',  size: "8%"},
    { title: 'Descripción', name: 'description',  size: "25%"},
    { title: 'Tipo', name: 'idOfferType',  size: "15%"},
    { title: 'Porcentaje', name: 'percentage',  size: "15%"}, 
    { title: 'Acción', name: 'accion', size: "10%"},
  ] 
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;

  constructor(  
      private snackbar: MatSnackBar,  
      private offerService: OfferService,  
    ) { }

  ngOnInit(): void { 
    this.getProducts();
  }

  getProducts(): void {
    this.subscription.push(
      this.offerService.getAllOffers().subscribe(
        res => {
          this.dataSource.data = res.content;
          //console.log('Ofertas ->', res.content) 
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
 
  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
    this.dataSource.filterPredicate = (data: OfferData, filter: string): boolean => { 
      return data.description.toLowerCase().includes(filter.toLowerCase());
     };
  }

  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 
  
  clearSearch(): void { 
    this.searchDescription = '';
    this.dataSource.filter = "";
  }

  applyFilter(): void { 
    //Filtra los porductos por la descripción de la oferta
    this.dataSource.filter = this.searchDescription.trim().toLowerCase();
  }  
   
  deleteProduct(offer: OfferData): void {
    //console.log('Eliminando oferta -> ', offer)
    //Modal de desctivar la oferta
    Swal.fire({
      title: 'Desactivar Oferta',
      text: `¿Desea desactivar la oferta ${offer.idOffer}?`,
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
        //Si el resultado es verdad se envia una peticion para desactivar (borrado logico)
        //la oferta del sistema
        // se llama al servicio que desactiva la oferta
        if (result.isConfirmed) {
          // const id: number = offer.idOffer as number
          // this.subscription.push(
          //   this.offerService.deleteOffert(id).subscribe(
          //     res => { 
          //       console.log('Se desactivo la oferta', res.content) 
          //       this.showSnack(true, res.message);  
          //       this.getProducts();
          //     },
          //     err => {
          //       console.log(err.error) 
          //       this.showSnack(false, err.error.message || "Imposible Desactivar"); 
          //     }
          //   ) 
          // )
          Swal.fire({
            title: 'Desactivado',
            text: `Convenio ${offer.idOffer} desactivado`,
            icon: 'success',
            heightAuto: false, 
            confirmButtonColor: '#c1c164', 
            confirmButtonText: 'Cerrar'
          }) 
        }else {
          Swal.fire({
            title: 'Cancelado',
            text: `Convenio ${offer.idOffer} no ha sido desactivado`,
            icon: 'info',
            heightAuto: false, 
            confirmButtonColor: '#c1c164', 
            confirmButtonText: 'Cerrar'
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
