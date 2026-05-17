import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { StatsService, PublicStats } from '../../core/services/stats.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  registerForm!: FormGroup;
  cityForm!: FormGroup;
  isLoading = false;
  publicStats: PublicStats | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private statsService: StatsService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    });

    this.cityForm = this.fb.group({
      pickupCity: ['', Validators.required],
      dropCity: ['', Validators.required],
    });

    this.statsService.getPublicStats().subscribe({
      next: (stats) => (this.publicStats = stats),
    });
  }

  /** Sender: pickup + drop city → register or create parcel */
  onSendParcel() {
    const pickup = this.cityForm.get('pickupCity')?.value?.trim();
    const drop = this.cityForm.get('dropCity')?.value?.trim();

    if (!pickup || !drop) {
      this.toast.warning('Please enter both pickup and drop cities.');
      return;
    }

    localStorage.setItem('parcel_pickup_city', pickup);
    localStorage.setItem('parcel_drop_city', drop);
    localStorage.setItem('pending_create_parcel', 'true');
    this.authService.setPendingFlow('sender');

    this.handleFlowAction('sender', '/dashboard/create-parcel');
  }

  /** Traveller: register or add travel plan */
  onBecomeTraveller() {
    const fromCity = this.cityForm.get('pickupCity')?.value?.trim();
    const toCity = this.cityForm.get('dropCity')?.value?.trim();
    if (fromCity && toCity) {
      localStorage.setItem('travel_from_city', fromCity);
      localStorage.setItem('travel_to_city', toCity);
    }
    this.authService.setPendingFlow('traveller');
    this.handleFlowAction('traveller', '/dashboard/add-travel-plan');
  }

  private handleFlowAction(
    target: 'sender' | 'traveller',
    destination: string
  ): void {
    // If token exists but user profile is missing, treat as guest and avoid OTP redirects.
    if (this.authService.isLoggedIn && !this.authService.currentUser) {
      this.authService.clearSession(true);
    }
    const role = this.authService.userRole;

    if (this.authService.isLoggedIn) {
      if (!this.authService.isVerified) {
        this.router.navigate(['/otp-verification'], {
          state: { phone: this.authService.currentUser?.phone, role: target },
        });
        return;
      }

      if (role === target) {
        this.router.navigate([destination]);
        return;
      }

      if (!this.authService.switchAccountForFlow(target)) {
        return;
      }
    }

    this.registerForm.patchValue({ role: target });
    document
      .querySelector('.landing-form-panel')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  onSubmit() {
    if (!this.registerForm || this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.registerForm.value;

    let phone = formValue.phone;
    if (phone.startsWith('+91')) {
      phone = phone.substring(3);
    }
    phone = phone.replace(/\s/g, '');

    const role = formValue.role as 'sender' | 'traveller';
    this.authService.setPendingFlow(role);

    const payload = {
      fullName: `${formValue.firstName} ${formValue.lastName}`,
      email: formValue.email,
      phone,
      password: formValue.password,
      role,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/otp-verification'], {
          state: { phone, role },
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.message || 'Registration failed');
      },
    });
  }
}
