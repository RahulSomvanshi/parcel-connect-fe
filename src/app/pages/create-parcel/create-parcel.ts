import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import {
  CreateParcelRequest,
  ParcelService,
} from '../../core/services/parcel.service';
import { AuthService } from '../../core/services/auth.service';
import * as ParcelActions from '../../store/parcel/parcel.actions';
import * as ParcelSelectors from '../../store/parcel/parcel.selectors';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-create-parcel',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-parcel.html',
  styleUrl: './create-parcel.css',
})
export class CreateParcel implements OnInit {
  parcelForm!: FormGroup;
  creating$: Observable<boolean>;
  error$: Observable<string | null>;
  prohibitedItems: string[] = [];
  matchedProhibitedItems: string[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private authService: AuthService,
    private parcelService: ParcelService,
    private toast: ToastService
  ) {
    this.creating$ = this.store.select(ParcelSelectors.selectCreating);
    this.error$ = this.store.select(ParcelSelectors.selectError);
  }

  ngOnInit() {
    if (this.authService.userRole !== 'sender') {
      this.router.navigate([this.authService.getDashboardRoute()]);
      return;
    }

    this.parcelForm = this.fb.group({
      pickupCity: ['', Validators.required],
      dropCity: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0.1)]],
      parcelDate: ['', Validators.required],
      preferredTravelDate: [''],
      description: [''],
      price: [''],
    });

    this.prefillCitiesFromStorage();
    this.loadProhibitedItems();
    this.parcelForm.get('description')?.valueChanges.subscribe((value: string) => {
      this.matchedProhibitedItems = this.findMatchedProhibitedItems(value || '');
    });
  }

  private prefillCitiesFromStorage() {
    const pickupCity = localStorage.getItem('parcel_pickup_city');
    const dropCity = localStorage.getItem('parcel_drop_city');

    if (pickupCity) {
      this.parcelForm.get('pickupCity')?.setValue(pickupCity);
      localStorage.removeItem('parcel_pickup_city');
    }
    if (dropCity) {
      this.parcelForm.get('dropCity')?.setValue(dropCity);
      localStorage.removeItem('parcel_drop_city');
    }
  }

  onSubmit() {
    if (this.parcelForm.invalid) {
      this.parcelForm.markAllAsTouched();
      return;
    }

    const v = this.parcelForm.value;
    const prohibitedMatches = this.findMatchedProhibitedItems(v.description || '');
    if (prohibitedMatches.length > 0) {
      this.toast.error(
        `Parcel can't be created with restricted items: ${prohibitedMatches.join(', ')}`
      );
      return;
    }
    const parcelData: CreateParcelRequest = {
      pickup: { city: v.pickupCity.trim() },
      drop: { city: v.dropCity.trim() },
      weight: Number(v.weight),
      parcelDate: v.parcelDate,
      preferredTravelDate: v.preferredTravelDate || undefined,
      description: v.description || undefined,
      price: v.price ? Number(v.price) : undefined,
    };

    this.store.dispatch(ParcelActions.createParcel({ parcelData }));
  }

  getRouteSummary(): string {
    const pickupCity = this.parcelForm.get('pickupCity')?.value || '';
    const dropCity = this.parcelForm.get('dropCity')?.value || '';
    return pickupCity && dropCity ? `${pickupCity} → ${dropCity}` : 'Route not specified';
  }

  private loadProhibitedItems() {
    this.parcelService.getProhibitedItems().subscribe({
      next: (items) => (this.prohibitedItems = items),
      error: () => (this.prohibitedItems = []),
    });
  }

  private findMatchedProhibitedItems(description: string): string[] {
    const text = description.toLowerCase();
    return this.prohibitedItems.filter((item) =>
      text.includes(item.toLowerCase())
    );
  }
}
