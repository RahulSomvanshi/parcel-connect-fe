import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  registerForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    });

    // Debug: Log form initialization
    console.log('Form initialized:', this.registerForm);
  }

  onSubmit() {
    console.log('🔥 FORM SUBMIT CALLED!');
    
    // First check if form exists
    if (!this.registerForm) {
      console.log('❌ Form not initialized');
      return;
    }
    
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form values:', this.registerForm.value);
    
    // Log each field's status
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      console.log(`${key}: valid=${control?.valid}, errors=${JSON.stringify(control?.errors)}, value=${control?.value}`);
    });

    if (this.registerForm.invalid) {
      console.log('❌ Form is invalid, marking all as touched');
      this.registerForm.markAllAsTouched();
      return;
    }

    console.log('✅ Form is valid, proceeding with registration');
    this.isLoading = true;

    const formValue = this.registerForm.value;

    // Clean phone number - remove +91 prefix if present
    let phone = formValue.phone;
    if (phone.startsWith('+91')) {
      phone = phone.substring(3);
    }
    phone = phone.replace(/\s/g, ''); // Remove spaces

    const payload = {
      fullName: `${formValue.firstName} ${formValue.lastName}`,
      email: formValue.email,
      phone: phone,
      password: formValue.password,
      role: formValue.role === 'both' ? 'user' : formValue.role
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
