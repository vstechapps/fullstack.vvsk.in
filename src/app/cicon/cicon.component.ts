import { Component, Input } from '@angular/core';

@Component({
  selector: 'cicon',
  standalone: true,
  imports: [],
  templateUrl: './cicon.component.html',
  styleUrl: './cicon.component.css'
})
export class CiconComponent {

  @Input()
  tech:string | undefined = "";
  
}
