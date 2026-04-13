import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-deliveries',
  imports: [RouterLink],
  templateUrl: './my-deliveries.html',
  styleUrl: './my-deliveries.css',
})
export class MyDeliveries {
  deliveries = [
    {
      id: 'KL-99281', title: 'Premium Electronics Kit', sender: 'Rahul Sharma', phone: '+91 98765 43210',
      date: 'May 24, 2024', time: 'Before 6:00 PM',
      from: 'Indiranagar, Bengaluru', to: 'Bandra West, Mumbai',
      status: 'Active', statusType: 'warning'
    },
    {
      id: 'KL-99304', title: 'Document Courier (Urgent)', sender: 'Anita Desai', phone: '+91 91234 56789',
      date: 'May 25, 2024', time: 'Morning Slot',
      from: 'Hitech City, Hyderabad', to: 'Sector 62, Noida',
      status: 'Pending Pickup', statusType: 'primary'
    },
    {
      id: 'KL-99412', title: 'Handcrafted Gift Box', sender: 'Vikram Singh', phone: '+91 99887 76655',
      date: 'May 24, 2024', time: 'ASAP',
      from: 'Civil Lines, Jaipur', to: 'Connaught Place, Delhi',
      status: 'In Transit', statusType: 'success'
    },
  ];
}
