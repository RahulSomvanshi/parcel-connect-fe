import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-parcels',
  imports: [RouterLink],
  templateUrl: './my-parcels.html',
  styleUrl: './my-parcels.css',
})
export class MyParcels {
  parcels = [
    {
      id: 'KL-2024-8839', description: 'Artisan Ceramics Set', from: 'Indiranagar, Bengaluru', to: 'Bandra West, Mumbai',
      status: 'In Transit', statusType: 'warning', amount: '₹2,450', date: 'Oct 24, 2024',
      traveller: { name: 'Arjun Sharma', phone: '+91 98765 43210', location: 'Solapur Logistics Hub' },
      progress: 65
    },
    {
      id: 'KL-2024-9021', description: 'Laptop Accessory Bundle', from: 'Koramangala, Bengaluru', to: 'Andheri East, Mumbai',
      status: 'Picked Up', statusType: 'primary', amount: '₹1,120', date: 'Oct 22, 2024',
      traveller: { name: 'Priya Patel', phone: '+91 87654 32109', location: 'Bengaluru Airport' },
      progress: 25
    },
    {
      id: 'KL-2024-7742', description: 'Handcrafted Gift Box', from: 'MG Road, Bengaluru', to: 'C-Scheme, Jaipur',
      status: 'Delivered', statusType: 'success', amount: '₹890', date: 'Oct 20, 2024',
      traveller: { name: 'Vikram Singh', phone: '+91 76543 21098', location: 'Delivered' },
      progress: 100
    },
  ];

  activeFilter = 'all';
  filters = ['all', 'in-transit', 'picked-up', 'delivered'];
}
