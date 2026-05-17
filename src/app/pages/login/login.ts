import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]], // email or phone
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const payload = {
      phone: this.loginForm.value.identifier, // backend expects phone
      password: this.loginForm.value.password
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.isLoading = false;

        // ✅ Use auth service state (storeAuth already ran in tap)
        // This handles cases where backend may not return user object
        if (!this.authService.isVerified) {
          const user = this.authService.currentUser;
          this.router.navigate(['/otp-verification'], {
            state: { phone: user?.phone || payload.phone, role: user?.role }
          });
          return;
        }

        // ✅ Verified user → go to appropriate dashboard
        this.router.navigate([this.authService.getPostAuthRoute()]);
      },

      error: (err) => {
        this.isLoading = false;

        if (err.error?.isVerified === false) {
          this.router.navigate(['/otp-verification'], {
            state: {
              phone: err.error?.phone || payload.phone,
              role: err.error?.role,
            },
          });
          return;
        }

        this.toast.error(err.error?.message || 'Login failed');
      }
    });
  }
}
