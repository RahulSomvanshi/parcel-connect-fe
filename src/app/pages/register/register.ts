import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit() {
    const pendingFlow = localStorage.getItem('pending_flow');
    const defaultRole = pendingFlow === 'traveller' ? 'traveller' : 'sender';

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [defaultRole, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.registerForm.value;

    const payload = {
      fullName: formValue.firstName + ' ' + formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password,
      role: formValue.role,
    };
    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;

        this.router.navigate(['/otp-verification'], {
          state: { phone: payload.phone, role: payload.role }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.message || 'Registration failed');
      }
    });
  }
}
