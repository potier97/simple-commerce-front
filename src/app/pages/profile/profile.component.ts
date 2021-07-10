import { Component, OnDestroy, OnInit } from '@angular/core';  
import { UsersService } from '@app/services/users/users.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserData } from '@app/models/user'; 

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy  {
 

  private subscription: Subscription[] = [];
  
  admin: UserData;

  constructor(  
    private snackbar: MatSnackBar,   
    private usersService: UsersService) { }
 

  ngOnDestroy(): void {
    //console.log("Desubs all observers") 
    for(const sub of this.subscription) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void {   
      this.subscription.push(
        this.usersService.getAdminProfile().subscribe(
          res => {
            //console.log('Response ->', res)
            this.admin = res.content;
            //this.showSnack(true, res.message);   
          },
          err => {
            //console.log(err)
            this.showSnack(false, err.error.message || 'No se encontró el Administrador');    
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

