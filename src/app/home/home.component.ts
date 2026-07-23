import { Component, Input, Output } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Hero1Component } from '../hero1/hero1.component';
import { Hero2Component } from '../hero2/hero2.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,Hero1Component,Hero2Component],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
