import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-matching-parcels',
  imports: [RouterLink],
  templateUrl: './matching-parcels.html',
  styleUrl: './matching-parcels.css',
})
export class MatchingParcels {
  parcels = [
    { title: 'Artisan Ceramics Set', pickup: '10:00 AM', amount: '₹2,450', tier: 'Premium', tierType: 'premium', weight: '3.2 kg', from: 'Bandra, Mumbai', to: 'Koramangala, Bangalore' },
    { title: 'Laptop Accessory Bundle', pickup: '02:00 PM', amount: '₹1,200', tier: 'Standard', tierType: 'standard', weight: '1.8 kg', from: 'Andheri, Mumbai', to: 'HSR Layout, Bangalore' },
    { title: 'Educational Books Set', pickup: 'Anytime', amount: '₹850', tier: 'Lite', tierType: 'lite', weight: '4.5 kg', from: 'Dadar, Mumbai', to: 'Whitefield, Bangalore' },
  ];
}
