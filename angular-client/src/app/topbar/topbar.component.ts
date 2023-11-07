import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  sticky = false;

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    this.sticky = window.scrollY > 0;
  }
}
