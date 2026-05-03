import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'

export interface UserData {
    _id: string;
    fullName: string;
    email?: string;
    phone: string;
    role: 'user' | 'admin';
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
    private baseUrl = environment.apiUrl;
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

    get userRole(): 'user' | 'admin' {
        return this.currentUser?.role || 'user';
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

    private storeAuth(res: any): void {
        if (res.token) {
            localStorage.setItem('token', res.token);
        }

        if (res.refreshToken) {
            localStorage.setItem('refreshToken', res.refreshToken);
        }

        // Handle user data — backend may return it in different shapes
        const userData: UserData | null = res.user || null;

        if (userData) {
            // 🔥 Fix backend typo: 'isVerifed' → 'isVerified'
            if (userData.isVerified === undefined && (userData as any).isVerifed !== undefined) {
                userData.isVerified = (userData as any).isVerifed;
            }
            // Also check response root level
            if (userData.isVerified === undefined && res.isVerified !== undefined) {
                userData.isVerified = res.isVerified;
            }
            localStorage.setItem('user', JSON.stringify(userData));
            this.currentUserSubject.next(userData);
        }
    }

    // ─────────────────────────────
    // 🌐 API CALLS
    // ─────────────────────────────

    register(data: any): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.baseUrl}/auth/register`, data)
            .pipe(tap((res) => this.storeAuth(res)));
    }

    login(data: { phone: string; password: string }): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.baseUrl}/auth/login`, data)
            .pipe(
                tap((res: any) => {
                    console.log('🔍 Login API raw response:', JSON.stringify(res, null, 2));
                    this.storeAuth(res);
                    console.log('🔍 Stored user:', JSON.stringify(this.currentUser, null, 2));
                    console.log('🔍 isVerified:', this.isVerified);
                })
            );
    }

    verifyOtp(data: { phone: string; otp: string }): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.baseUrl}/auth/verify-otp`, data)
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
        return this.http.post(`${this.baseUrl}/auth/resend-otp`, { phone });
    }

    // ─────────────────────────────
    // 🔁 REFRESH TOKEN (MISSING FIX)
    // ─────────────────────────────

    refreshToken(): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`${this.baseUrl}/auth/refresh-token`, {
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
        return '/dashboard';
    }
}