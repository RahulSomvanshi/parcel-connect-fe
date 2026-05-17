import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { createTravelPlan } from '../../store/traveller/traveller.actions';
import { TravellerService } from '../../core/services/traveller.service';
import { EarningsPreview } from '../../core/services/stats.service';
import { formatInr } from '../../core/utils/earnings.util';

@Component({
  selector: 'app-add-travel-plan',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-travel-plan.html',
  styleUrl: './add-travel-plan.css',
})
export class AddTravelPlan implements OnInit, OnDestroy {
  travelPlanForm: FormGroup;
  earningsPreview: EarningsPreview | null = null;
  previewLoading = false;
  formatInr = formatInr;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private travellerService: TravellerService
  ) {
    this.travelPlanForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      travelDate: ['', Validators.required],
      vehicleType: ['bus', Validators.required],
      availableWeight: [0, [Validators.required, Validators.min(1)]],
      departureTime: [''],
      arrivalTime: [''],
      maxItemSize: ['small'],
      restrictions: [''],
    });
  }

  ngOnInit() {
    this.prefillRouteFromLanding();
    this.travelPlanForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.loadEarningsPreview());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private prefillRouteFromLanding() {
    const fromCity = localStorage.getItem('travel_from_city');
    const toCity = localStorage.getItem('travel_to_city');

    if (fromCity) {
      this.travelPlanForm.get('from')?.setValue(fromCity);
      localStorage.removeItem('travel_from_city');
    }
    if (toCity) {
      this.travelPlanForm.get('to')?.setValue(toCity);
      localStorage.removeItem('travel_to_city');
    }
  }

  loadEarningsPreview() {
    const { from, to, availableWeight } = this.travelPlanForm.value;
    const fromCity = String(from || '').trim();
    const toCity = String(to || '').trim();
    if (!fromCity || !toCity) {
      this.earningsPreview = null;
      return;
    }

    this.previewLoading = true;
    this.travellerService
      .getEarningsPreview(
        fromCity,
        toCity,
        Number(availableWeight) > 0 ? Number(availableWeight) : undefined
      )
      .subscribe({
        next: (preview) => {
          this.earningsPreview = preview;
          this.previewLoading = false;
        },
        error: () => {
          this.earningsPreview = null;
          this.previewLoading = false;
        },
      });
  }

  onSubmit() {
    if (this.travelPlanForm.valid) {
      const formValue = this.travelPlanForm.value;
      const travelPlanData = {
        from: String(formValue.from || '').trim(),
        to: String(formValue.to || '').trim(),
        travelDate: formValue.travelDate,
        vehicleType: formValue.vehicleType.toLowerCase() as 'bus' | 'train' | 'car',
        availableWeight: Number(formValue.availableWeight),
      };
      this.store.dispatch(createTravelPlan({ travelPlanData }));
    }
  }
}
