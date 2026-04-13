import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-traveller-dashboard',
  imports: [RouterLink],
  templateUrl: './traveller-dashboard.html',
  styleUrl: './traveller-dashboard.css',
})
export class TravellerDashboard {
  journeys = [
    { from: 'Mumbai (BOM)', to: 'London (LHR)', date: 'Oct 28, 2024', status: 'Upcoming', icon: 'flight' },
    { from: 'Bangalore', to: 'New Delhi', date: 'Nov 02, 2024', status: 'Pending', icon: 'train' },
  ];

  suggestedMatch = {
    title: 'Handcrafted Decor',
    payout: '₹3,200',
    route: 'Mumbai → London',
    requests: 8,
  };
}
