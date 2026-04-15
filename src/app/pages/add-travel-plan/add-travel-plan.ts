import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createTravelPlan } from '../../store/traveller/traveller.actions';

@Component({
  selector: 'app-add-travel-plan',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './add-travel-plan.html',
  styleUrl: './add-travel-plan.css',
})
export class AddTravelPlan {
  travelPlanForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store) {
    this.travelPlanForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      travelDate: ['', Validators.required],
      vehicleType: ['bus', Validators.required],
      availableWeight: [0, [Validators.required, Validators.min(1)]],
      departureTime: [''],
      arrivalTime: [''],
      maxItemSize: ['small'],
      restrictions: ['']
    });
  }

  onSubmit() {
    if (this.travelPlanForm.valid) {
      const formValue = this.travelPlanForm.value;
      const travelPlanData = {
        from: formValue.from,
        to: formValue.to,
        travelDate: formValue.travelDate,
        vehicleType: formValue.vehicleType.toLowerCase() as 'bus' | 'train' | 'car',
        availableWeight: formValue.availableWeight
      };
      this.store.dispatch(createTravelPlan({ travelPlanData }));
    }
  }
}
