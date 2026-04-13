import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

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
    private router: Router
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
      next: (res: any) => {
        this.isLoading = false;

        // 🔥 if not verified → OTP
        if (!res.user?.isVerified) {
          this.router.navigate(['/otp-verification'], {
            state: { phone: res.user.phone }
          });
          return;
        }

        // 🔥 else dashboard
        this.router.navigate([this.authService.getDashboardRoute()]);
      },

      error: (err) => {
        this.isLoading = false;
        alert(err.error?.message || 'Login failed');
      }
    });
  }
}
