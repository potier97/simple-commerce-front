import {AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'; 
import {MatSort} from '@angular/material/sort';
import {MatDialog, } from '@angular/material/dialog';
import { CovenantService } from '@app/services/covenant/covenant.service';
import { Subscription } from 'rxjs';
import { CovenantData } from '@app/models/covenant';
import { CustomDialogComponent } from '@app/components/custom-dialog/custom-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2' 

@Component({
  selector: 'app-covenant',
  templateUrl: './covenant.component.html',
  styleUrls: ['./covenant.component.css']
})
export class CovenantComponent implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];

  searchConvenant: string = ""
  //Flag to Spinner data 
  loadingData: boolean = false;
  displayedColumns: string[] = ['idCovenant', 'name', 'accion']; 
  dataSource = new MatTableDataSource<CovenantData>();
  columns = [
    { title: 'No.', name: 'idCovenant',  size: "8%"},
    { title: 'Nombre', name: 'name',  size: "25%"},
    { title: 'Acción', name: 'accion', size: "10%"},
  ] 
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;

  constructor(  
      private snackbar: MatSnackBar, 
      private dialog: MatDialog,  
      private covenantService: CovenantService,  
    ) { }

  ngOnInit(): void { 
    this.getCovenants();
  }

  getCovenants(): void {
    this.subscription.push(
      this.covenantService.getAllCovenants().subscribe(
        res => {
          this.dataSource.data = res.content;
          console.log('Convenios ->', res.content) 
          this.loadingData = true
        },
        err => {
          console.log(err) 
          this.showSnack(false, 'Imposible Obtener Convenios'); 
          this.loadingData = true
        }
      ) 
    )
  }
 
  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
    this.dataSource.filterPredicate = (data: CovenantData, filter: string): boolean => { 
      //console.log('data -> ' , data.name)
      //console.log('filter -> ' , filter)
      return data.name.toLocaleLowerCase().includes(filter.toLowerCase());  //&&  data.active === 1 ;
     };
  }

  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  } 

  updateName(covenant: CovenantData): void {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      panelClass: ['animate__animated','animate__swing'],
      width: '65%',  
      disableClose: true, 
      data: {
        tittle: `Renombrar Convenio ${covenant.idCovenant}`,
        label: 'Nombre',
        buttonLabel: "Cambiar",
        account_validation_messages: { 
          inputData: [
            { type: 'required', message: 'Ingrese el nombre del convenio' },
            { type: 'pattern', message: 'Ingrese un nombre sin números' },
            { type: 'min', message: 'Ingrese el nombre del convenio' },  
          ],  
        },
        constrainInput: /^([^0-9]*)$/ 
        }
    });
    this.subscription.push(
      dialogRef.afterClosed().subscribe((result: any) => {
        if(result.status){  
          const updateCovenantData = {
            idCovenant: covenant.idCovenant,
            name: result.data.inputData, 
          } 
          console.log(updateCovenantData);
          //Al cerrar el modal - se envia al api la peticion de cambiar el nombre del convenio
          this.subscription.push(
            this.covenantService.updateCovenant(updateCovenantData).subscribe(
              res => { 
                console.log('de actualizo el convenio', res.content) 
                this.showSnack(true, res.message);  
                this.getCovenants();
              },
              err => {
                console.log(err.error) 
                this.showSnack(false, err.error.message || "Imposible Actualizar"); 
              }
            ) 
          )
        }
      })
    )
  }
   
  clearSearch(): void { 
    this.searchConvenant = '';
    this.dataSource.filter = "";
  }

  applyFilter(): void { 
    //Filtra los convenios por el NOMBRE
    this.dataSource.filter = this.searchConvenant.trim().toLowerCase();
  }  
   
  deleteCovenant(covenant: CovenantData): void {
    //console.log('Eliminando Convenio -> ', covenant.name)
    //Modal de eliminar el convenio
    Swal.fire({
      title: 'Eliminar Convenio',
      text: `¿Desea eliminar el Convenio ${covenant.name}?`,
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
          Swal.fire({
            title: 'Eliminado',
            text: `Convenio ${covenant.name} eliminado`,
            icon: 'success',
            heightAuto: false, 
            confirmButtonColor: '#c1c164', 
            confirmButtonText: 'Cerrar'
          }) 
        }else {
          Swal.fire({
            title: 'Cancelado',
            text: `Convenio ${covenant.name} no ha sido eliminado`,
            icon: 'warning',
            heightAuto: false, 
            confirmButtonColor: '#c1c164', 
            confirmButtonText: 'Cerrar'
          }) 
        }
      })
    //.then((result) => {
    //   if (result.isConfirmed) {
    //     this.subscription.push(
    //       this.covenantService.deleteCovenant(covenant.idCovenant).subscribe(
    //         res => {  
    //           this.getCovenants();
    //           Swal.fire({
    //             title: 'Eliminado',
    //             text: `Convenio ${covenant.name} eliminado`,
    //             icon: 'success',
    //             heightAuto: false, 
    //             confirmButtonColor: '#c1c164', 
    //             confirmButtonText: 'Cerrar'
    //           })
    //           this.showSnack(true, res.message);
    //         },
    //         err => {
    //           console.log(err.error)  
    //           Swal.fire({
    //             title: 'Error',
    //             text: `Convenio ${covenant.name} no ha podido ser eliminado`,
    //             icon: 'error',
    //             heightAuto: false, 
    //             confirmButtonColor: '#c1c164', 
    //             confirmButtonText: 'Cerrar'
    //           })
    //           this.showSnack(false, err.error.message);
    //         }
    //       ) 
    //     )
        
    //   }
    // })
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
