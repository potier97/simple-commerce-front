import { AfterViewInit, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table'; 
import { MatSort} from '@angular/material/sort'; 
import { MistakeService } from '@app/services/mistake/mistake.service';
import { Subscription } from 'rxjs';
import { MistakeData } from '@app/models/mistake'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-mistakes',
  templateUrl: './mistakes.component.html',
  styleUrls: ['./mistakes.component.css']
})
export class MistakesComponent implements OnInit, AfterViewInit, OnDestroy  {

  private subscription: Subscription[] = [];

  searchMistake: string = ""
  //Flag to Spinner data 
  loadingData: boolean = false;
  displayedColumns: string[] = ['idMistake', 'description', 'errorDate', 'idPayDoc', 'idCovenant']; 
  dataSource = new MatTableDataSource<MistakeData>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;

  constructor(  
      private snackbar: MatSnackBar,  
      private router: Router,  
      private mistakeService: MistakeService,  
    ) { }

  ngOnInit(): void { 
    this.getProducts();
  }

  getProducts(): void {
    this.subscription.push(
      this.mistakeService.getAllErrors().subscribe(
        res => {
          this.dataSource.data = res.content;
          //console.log('Errores -> ', res.content) 
          this.loadingData = true
        },
        err => {
          //console.log(err) 
          this.showSnack(false, 'Imposible Obtener Errores'); 
          this.loadingData = true
        }
      ) 
    )
  }
 
  ngAfterViewInit() { 
    //Configuración de datos iniciales
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator; 
    this.dataSource.filterPredicate = (data: MistakeData, filter: string): boolean => { 
      return data.idMistake?.toString().includes(filter) || data.description.toLowerCase().includes(filter.toLowerCase());
     };
  }

  ngOnDestroy(): void { 
    //Desubs de todos los observadores cuando se destruye el componente
    for(const sub of this.subscription) {
      sub.unsubscribe();
    } 
  }  

  clearSearch(): void { 
    this.searchMistake = '';
    this.dataSource.filter = "";
  }

  viewMistake(id: number): void { 
    this.router.navigate(["/mistakes/", id])
  }

  applyFilter(): void { 
    //Filtra los porductos por el Documento
    this.dataSource.filter = this.searchMistake.trim().toLowerCase();
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
