import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

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
    private router: Router
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],

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
      role: 'user'
    };
    console.log('Registering with payload:', payload);
    this.authService.register(payload).subscribe({
      next: (res: any) => {
        console.log('Registered:', res);
        this.isLoading = false;

        this.router.navigate(['/otp-verification'], {
          state: { phone: payload.phone, role: payload.role }
        });
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert(err.error?.message || 'Registration failed');
      }
    });
  }
}
