import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface UserData {
    _id: string;
    fullName: string;
    email?: string;
    phone: string;
    role: 'sender' | 'traveller' | 'admin';
    isVerified: boolean;
}

export interface AuthResponse {
    message: string;
    token?: string;
    refreshToken?: string;
    user?: UserData;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = 'http://localhost:5000/api/auth';

    private currentUserSubject = new BehaviorSubject<UserData | null>(
        this.getStoredUser()
    );

    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        // 🔥 restore session on app start
        const user = this.getStoredUser();
        if (user) {
            this.currentUserSubject.next(user);
        }
    }

    // ─────────────────────────────
    // 🔐 AUTH STATE
    // ─────────────────────────────

    private getStoredUser(): UserData | null {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    }

    get currentUser(): UserData | null {
        return this.currentUserSubject.value;
    }

    get isLoggedIn(): boolean {
        return !!this.getToken();
    }

    get isVerified(): boolean {
        return !!this.currentUser?.isVerified;
    }

    get userRole(): 'sender' | 'traveller' | 'admin' {
        return this.currentUser?.role || 'sender';
    }

    // ─────────────────────────────
    // 🔑 TOKEN MANAGEMENT
    // ─────────────────────────────

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    private storeAuth(res: AuthResponse): void {
        if (res.token) {
            localStorage.setItem('token', res.token);
        }

        if (res.refreshToken) {
            localStorage.setItem('refreshToken', res.refreshToken);
        }

        if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
            this.currentUserSubject.next(res.user);
        }
    }

    // ─────────────────────────────
    // 🌐 API CALLS
    // ─────────────────────────────

    register(data: any): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.baseUrl}/register`, data)
            .pipe(tap((res) => this.storeAuth(res)));
    }

    login(data: { phone: string; password: string }): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.baseUrl}/login`, data)
            .pipe(tap((res) => this.storeAuth(res)));
    }

    verifyOtp(data: { phone: string; otp: string }): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.baseUrl}/verify-auth`, data)
            .pipe(
                tap((res) => {
                    this.storeAuth(res);

                    // 🔥 ensure verification state updated locally
                    if (this.currentUser) {
                        const updated = {
                            ...this.currentUser,
                            isVerified: true,
                        };
                        localStorage.setItem('user', JSON.stringify(updated));
                        this.currentUserSubject.next(updated);
                    }
                })
            );
    }

    resendOtp(phone: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/resend-otp`, { phone });
    }

    // ─────────────────────────────
    // 🔁 REFRESH TOKEN (MISSING FIX)
    // ─────────────────────────────

    refreshToken(): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.baseUrl}/refresh-token`, {
                refreshToken: this.getRefreshToken(),
            })
            .pipe(tap((res) => this.storeAuth(res)));
    }

    // ─────────────────────────────
    // 🚪 LOGOUT
    // ─────────────────────────────

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        this.currentUserSubject.next(null);

        this.router.navigate(['/login']);
    }

    // ─────────────────────────────
    // 🧭 NAVIGATION HELPERS
    // ─────────────────────────────

    getDashboardRoute(): string {
        return this.userRole === 'traveller'
            ? '/dashboard/traveller'
            : '/dashboard/sender';
    }
}