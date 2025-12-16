import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  selectmenu:number;
  ngOnInit(): void {
    
    this.selectmenu=0
    
  }

  gotoment(x:number){
    this.selectmenu=x
  }


}
