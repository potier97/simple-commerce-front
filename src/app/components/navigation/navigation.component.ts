import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  currentRouteTittle: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private authService: AuthService
  ) { 
    this.router.events.subscribe((ev: Event) => {
      if(ev instanceof NavigationEnd) this.currentRouteTittle = this.route.snapshot.firstChild?.data['title']; 
    }); 
  }

  ngOnInit(): void {
    console.log("Actualizo")
  }

  onOpen(url: string): void {
    window.open(url, '_blank');
  }

  public onLogout(): void {
    this.authService.logout();
  }
}
