import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Navigation } from '../../models/navigation';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
//import { AuthService } from '@app/services/auth/auth.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  currentRouteTittle: string = "";
  statusSideVar: boolean = true;
 
  navigationList: Navigation[] = [
    {
      pagaName: 'Caja',
      link: '/payment',
      iconName: 'chevron_left',
      fabIcon: 'point_of_sale',
    },
    {
      pagaName: 'Productos',
      link: '/products',
      iconName: 'chevron_left',
      fabIcon: 'inventory_2',
    },
    {
      pagaName: 'Categorias',
      link: '/categories',
      iconName: 'chevron_left',
      fabIcon: 'category',
    },
    {
      pagaName: 'Clientes',
      link: '/clients',
      iconName: 'chevron_left',
      fabIcon: 'people',
    },
    {
      pagaName: 'Ofertas',
      link: '/offers',
      iconName: 'chevron_left',
      fabIcon: 'local_offer',
    },
    {
      pagaName: 'Ventas',
      link: '/invoces',
      iconName: 'chevron_left',
      fabIcon: 'shopping_bag',
    },
    {
      pagaName: 'Pagos',
      link: '/pay',
      iconName: 'chevron_left',
      fabIcon: 'paid',
    },
    {
      pagaName: 'Perfíl',
      link: '/profile',
      iconName: 'chevron_left',
      fabIcon: 'account_circle',
    }, 
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router, 
    //private authService: AuthService
  ) { 
    this.router.events.subscribe((ev: Event) => {
      if(ev instanceof NavigationEnd){
        this.currentRouteTittle = this.route.snapshot.firstChild?.data['title'];
        //console.log(this.currentRouteTittle);
      }
    }); 
  }

  ngOnInit(): void {
    console.log("Actualizo")
  }

  button(): void {
    console.log('hola');
  }

  toggleSideVar(): void {
    this.statusSideVar = !this.statusSideVar
  }

  logout(): void {
    console.log("salio")
    //this.authService.logout();

  }

  

}
