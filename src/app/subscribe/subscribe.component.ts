import { Component } from '@angular/core';
import { AppService } from '../services/app.service';
import { UserService } from '../services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [NgIf],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.css'
})
export class SubscribeComponent {

  user: any = null;
  paymentModal = false;
  upiLink: string | null = null;
  qrCodeUrl: string | null = null;

  private paymentInfo = {
    upiId: 'vvskchaitanya-6@okaxis', // Replace with your UPI ID
    payeeName: 'vvskchaitanya', // Replace with your name or business name
    currency: 'INR', // Currency code
    price: 2999 // Price in INR
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
      // show a popup dialog to ask the user to log in
      alert('Please log in to proceed with the payment.');
      return;
    }
    // user logged in create a UPI deep link and navigate to it
    let date = new Date().toISOString();
    let description = this.user.id+"_"+this.user.email+"_"+date;
    this.upiLink = `upi://pay?pa=${this.paymentInfo.upiId}&pn=${encodeURIComponent(this.paymentInfo.payeeName)}&am=${this.paymentInfo.price}&cu=${this.paymentInfo.currency}&tn=${encodeURIComponent(description)}`;
      
    if(this.app.isMobile) {
      // Handle mobile-specific payment logic
      // navigate to UPI link
      // Construct UPI deep link
      window.open(this.upiLink, '_blank');
    }else{
      // Handle desktop-specific payment logic
      // Show QR code for payment on screen using popup modal generate using google chart api
      const qrSize = 300;
      this.qrCodeUrl = `https://quickchart.io/qr?size=${qrSize}&text=${encodeURIComponent(this.upiLink)}&&caption=TheFullStack&captionFontSize=15`;
      // Show the QR code in a popup modal
      this.paymentModal = true;
    }
  }

  togglePaymentModal(): void {
    // Implement the logic to toggle the payment modal visibility
    console.log('Toggle Payment Modal button clicked');
    this.paymentModal = !this.paymentModal;
  }

}
