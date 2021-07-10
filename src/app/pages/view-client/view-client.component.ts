import { Component, OnDestroy, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '@app/services/users/users.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserData } from '@app/models/user'; 
 

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit, OnDestroy  {
 

  private subscription: Subscription[] = [];
  
  client: UserData;
  idClient: number;

  constructor( 
    private route: ActivatedRoute, 
    private snackbar: MatSnackBar,  
    private router: Router,
    private usersService: UsersService) { }
 

  ngOnDestroy(): void {
    //console.log("Desubs all observers") 
    for(const sub of this.subscription) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void {  
      this.subscription.push(
        this.route.params.subscribe(params => {
          this.idClient = params['id'];
        }) 
      ) 
      this.subscription.push(
        this.usersService.getClientById(this.idClient).subscribe(
          res => {
            //console.log('Response ->', res)
            this.client = res.content;
            this.showSnack(true, res.message);   
          },
          err => {
            //console.log(err)
            this.showSnack(false, err.error.message || "No se encontró el cliente");   
            this.router.navigate(['/products'])
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

