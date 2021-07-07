import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table'; 
import { MatSort} from '@angular/material/sort'; 
import { UsersService } from '@app/services/users/users.service';
import { Subscription } from 'rxjs'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserData } from '@app/models/user';
import Swal from 'sweetalert2' 


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];
 
  searchUser: string = ""
  //Flag to Spinner data 
  loadingData: boolean = false;
  displayedColumns: string[] = ['idUser', 'name', 'userDoc', 'idUserType', 'associated', 'accion']; 
  dataSource = new MatTableDataSource<UserData>();
  columns = [
    { title: 'Id.', name: 'idUser',  size: "8%"},
    { title: 'Nombre', name: 'name',  size: "25%"},
    { title: 'Documento', name: 'userDoc',  size: "15%"},
    { title: 'Tipo Usuario', name: 'idUserType',  size: "15%"},
    { title: 'Asociado', name: 'associated',  size:"15%"}, 
    { title: 'Acción', name: 'accion', size: "10%"},
  ] 
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;

  constructor(  
      private snackbar: MatSnackBar,  
      private usersService: UsersService,  
    ) { }

  ngOnInit(): void { 
    this.getProducts();
  }

  getProducts(): void {
    this.subscription.push(
      this.usersService.getAllClients().subscribe(
        res => {
          this.dataSource.data = res.content;
          //console.log('Clientes ->', res.content) 
          this.loadingData = true
        },
        err => {
          console.log(err) 
          this.showSnack(false, 'Imposible Obtener Clientes'); 
          this.loadingData = true
        }
      ) 
    )
  }
 
  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;  
  }

  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 
   
  clearSearch(): void { 
    this.searchUser = ''; 
    this.getProducts();
  }

  searchClient(): void { 
    //Buscar los clientes por documento de id
    //console.log('buscanco.....') 
    this.subscription.push(
      this.usersService.findByDoc(this.searchUser).subscribe(
        res => { 
          this.dataSource.data = res.content;
          //console.log('Clientes ->', res.content)  
          this.loadingData = true
        },
        err => {
          console.log(err)  
          this.showSnack(false, err.error.message || 'Imposible Obtener resultados');
          this.clearSearch();
        }
      ) 
    )
  }  
   
  deleteProduct(user: UserData): void {
    //console.log('desactivar usuario -> ' , user.idUser)
    //Modal de desactivar el producto
    Swal.fire({
      title: 'Desactivar usuario',
      text: `¿Desea desactivar el usuario ${user.idUser}?`,
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonColor: '#c1c164',
      cancelButtonColor: '#226706',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Desactivar',
      customClass: {
        popup: 'animated swing', 
      }, 
    }).then((result) => {
      if (result.isConfirmed) {
        //Se comenta la fncionalidad de eleiminar n usario (logico)
        //en el que se le pregnta si esta segro de eliminar el cliente
        // const idProduct: number = user.idUser as number
        // this.subscription.push(
        //   this.usersService.deleteUser(idProduct).subscribe(
        //     res => {  
        //       this.getProducts(); 
        //       this.showSnack(true, res.message);
        //     },
        //     err => {
        //       console.log(err.error)   
        //       this.showSnack(false, err.error.message || 'Imposible Borrar Producto');
        //     }
        //   ) 
        // )
        Swal.fire({
          title: 'Desactivado',
          text: `Usuario ${user.idUser} desactivado`,
          icon: 'success',
          heightAuto: false, 
          confirmButtonColor: '#c1c164', 
          confirmButtonText: 'Cerrar'
        }) 
      }else {
        Swal.fire({
          title: 'Cancelado',
          text: `Usuario ${user.idUser} no ha sido desactivado`,
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
