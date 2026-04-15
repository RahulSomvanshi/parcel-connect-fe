import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CreateParcelRequest } from '../../core/services/parcel.service';
import * as ParcelActions from '../../store/parcel/parcel.actions';
import * as ParcelSelectors from '../../store/parcel/parcel.selectors';

@Component({
  selector: 'app-create-parcel',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-parcel.html',
  styleUrl: './create-parcel.css',
})
export class CreateParcel implements OnInit {
  parcelForm!: FormGroup;
  creating$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.creating$ = this.store.select(ParcelSelectors.selectCreating);
    this.error$ = this.store.select(ParcelSelectors.selectError);
  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.parcelForm = this.fb.group({
      pickup: this.fb.group({
        city: ['', Validators.required],
        address: ['', Validators.required],
      }),
      drop: this.fb.group({
        city: ['', Validators.required],
        address: ['', Validators.required],
      }),
      weight: ['', [Validators.required, Validators.min(0.1)]],
      description: [''],
      price: [''],
    });
  }

  onSubmit() {
    console.log('Form value:', this.parcelForm.value);
    console.log('Form valid:', this.parcelForm.valid);

    if (this.parcelForm.invalid) {
      this.parcelForm.markAllAsTouched();
      return;
    }

    const parcelData: CreateParcelRequest = this.parcelForm.value;
    this.store.dispatch(ParcelActions.createParcel({ parcelData }));
  }

  getRouteSummary(): string {
    const pickupCity = this.parcelForm.get('pickup.city')?.value || '';
    const dropCity = this.parcelForm.get('drop.city')?.value || '';
    return pickupCity && dropCity ? `${pickupCity} → ${dropCity}` : 'Route not specified';
  }
}
