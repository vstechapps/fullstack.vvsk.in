import { Component } from '@angular/core';
import { AppService } from '../services/app.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.css'
})
export class SubscribeComponent {

  user: any = null;

  private paymentInfo = {
    upiId: 'vvskchaitanya-6@okaxis', // Replace with your UPI ID
    payeeName: 'vvskchaitanya', // Replace with your name or business name
    currency: 'INR', // Currency code
    price: 4499 // Price in INR
  };

  constructor(private app: AppService, private userService: UserService) {
     this.userService.user$.subscribe((user: any) => {
       this.user = user;
     }); 
   }

  payNow(): void {
    // Implement the payment logic here
    console.log('Pay Now button clicked');
    if(!this.user) {
      alert('Please log in to proceed with the payment.');
      return;
    }
    if(this.app.isMobile) {
      // Handle mobile-specific payment logic
      // navigate to UPI link
      // Construct UPI deep link
      let date = new Date().toUTCString();
      let description = this.user.id+"_"+this.user.email+"_"+date;
      const upiLink = `upi://pay?pa=${this.paymentInfo.upiId}&pn=${encodeURIComponent(this.paymentInfo.payeeName)}&am=${this.paymentInfo.price}&cu=${this.paymentInfo.currency}&tn=${encodeURIComponent(description)}`;
      window.open(upiLink, '_blank');
    }else{
      // Handle desktop-specific payment logic
      // Show QR code for payment on screen using popup

    }
  }

}
