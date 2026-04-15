import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-verification',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css',
})
export class OtpVerification implements OnInit, OnDestroy {
  otp: string[] = ['', '', '', '', '', ''];
  timer: number = 300; // 5 min
  interval: any;
  phone: string = '';
  isResendEnabled = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngOnInit() {
    this.phone = window.history.state?.phone || '';

    this.startTimer();
  }

  // ✅ TIMER
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.isResendEnabled = true;
        clearInterval(this.interval);
      }
    }, 1000);
  }

  get formattedTimer() {
    const min = Math.floor(this.timer / 60);
    const sec = this.timer % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }

  // ✅ OTP INPUT AUTO MOVE
  onInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (value.length === 1 && index < 5) {
      input.nextElementSibling?.focus();
    }
  }

  onBackspace(event: any, index: number) {
    if (!event.target.value && index > 0) {
      event.target.previousElementSibling?.focus();
    }
  }

  // ✅ VERIFY OTP
  verifyOtp() {
    const finalOtp = this.otp.join('');

    if (finalOtp.length !== 6) {
      alert('Enter valid OTP');
      return;
    }

    this.isLoading = true;

    this.authService.verifyOtp({
      phone: this.phone,
      otp: finalOtp
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate([this.authService.getDashboardRoute()]);
      },
      error: (err) => {
        this.isLoading = false;
        alert(err.error?.message || 'Invalid OTP');
      }
    });
  }

  // ✅ RESEND OTP
  resendOtp() {
    if (!this.isResendEnabled) return;

    this.authService.resendOtp(this.phone).subscribe({
      next: () => {
        this.timer = 300;
        this.isResendEnabled = false;
        this.startTimer();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to resend OTP');
      }
    });
  }
}
