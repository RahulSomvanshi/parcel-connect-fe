import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sender-dashboard',
  imports: [RouterLink],
  templateUrl: './sender-dashboard.html',
  styleUrl: './sender-dashboard.css',
})
export class SenderDashboard {
  shipments = [
    { id: 'KL-2024-8839', destination: 'Bengaluru, KA', status: 'Out for Delivery', statusType: 'warning', amount: '₹2,450', time: 'Today, 10:24 AM' },
    { id: 'KL-2024-9021', destination: 'Mumbai, MH', status: 'Picked Up', statusType: 'primary', amount: '₹1,120', time: 'Yesterday' },
    { id: 'KL-2024-7742', destination: 'Jaipur, RJ', status: 'Delivered', statusType: 'success', amount: '₹890', time: 'Oct 24, 2023' },
  ];
}
