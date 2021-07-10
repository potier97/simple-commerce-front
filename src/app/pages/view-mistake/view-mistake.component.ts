import { Component, OnDestroy, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { MistakeService } from '@app/services/mistake/mistake.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MistakeData } from '@app/models/mistake'; 

@Component({
  selector: 'app-view-mistake',
  templateUrl: './view-mistake.component.html',
  styleUrls: ['./view-mistake.component.css']
})
export class ViewMistakeComponent implements OnInit, OnDestroy  {
 

  private subscription: Subscription[] = [];
  
  mistake: MistakeData;
  idMistake: string;

  constructor( 
    private route: ActivatedRoute, 
    private snackbar: MatSnackBar,  
    private router: Router,
    private mistakeService: MistakeService) { }
 

  ngOnDestroy(): void {
    //console.log("Desubs all observers") 
    for(const sub of this.subscription) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void {  
      this.subscription.push(
        this.route.params.subscribe(params => {
          this.idMistake = params['id'];
        }) 
      ) 
      this.subscription.push(
        this.mistakeService.getErrorById(this.idMistake).subscribe(
          res => {
            //console.log('Response ->', res)
            this.mistake = res.content;
            this.showSnack(true, res.message);   
          },
          err => {
            //console.log(err)
            this.showSnack(false, err.error.message || "No se encontró el error");   
            this.router.navigate(['/mistakes'])
          }
        )
      )   
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

