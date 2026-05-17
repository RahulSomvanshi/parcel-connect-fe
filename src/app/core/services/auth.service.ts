import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, firstValueFrom, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface UserData {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  role: 'admin' | 'sender' | 'traveller';
  isVerified: boolean;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: UserData;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;
  private bootstrapDone = false;

  private currentUserSubject = new BehaviorSubject<UserData | null>(
    this.getStoredUser()
  );

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /** Called once at app start — loads user from DB when token exists */
  bootstrap(force = false): Promise<void> {
    if (this.bootstrapDone && !force) {
      return Promise.resolve();
    }

    const token = this.getToken();
    if (!token) {
      this.bootstrapDone = true;
      return Promise.resolve();
    }

    return firstValueFrom(
      this.http.get<{ user: UserData }>(`${this.baseUrl}/auth/me`).pipe(
        tap((res) => {
          if (res?.user) {
            this.applyUser(res.user);
          }
        }),
        catchError(() => {
          this.clearSession(false);
          return of(null);
        }),
        finalize(() => {
          this.bootstrapDone = true;
        })
      )
    ).then(() => undefined);
  }

  get isBootstrapDone(): boolean {
    return this.bootstrapDone;
  }

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

  /** Role from synced user (DB via /me on refresh). */
  get userRole(): 'admin' | 'sender' | 'traveller' | null {
    const role = this.currentUser?.role;
    if (role === 'admin' || role === 'sender' || role === 'traveller') {
      return role;
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  clearSession(keepLandingIntent = false): void {
    this.bootstrapDone = false;
    const pendingFlow = keepLandingIntent
      ? localStorage.getItem('pending_flow')
      : null;
    const pendingCreate = keepLandingIntent
      ? localStorage.getItem('pending_create_parcel')
      : null;
    const pickup = keepLandingIntent
      ? localStorage.getItem('parcel_pickup_city')
      : null;
    const drop = keepLandingIntent
      ? localStorage.getItem('parcel_drop_city')
      : null;
    const travelFrom = keepLandingIntent
      ? localStorage.getItem('travel_from_city')
      : null;
    const travelTo = keepLandingIntent
      ? localStorage.getItem('travel_to_city')
      : null;

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);

    if (!keepLandingIntent) {
      localStorage.removeItem('pending_flow');
      localStorage.removeItem('pending_create_parcel');
      localStorage.removeItem('parcel_pickup_city');
      localStorage.removeItem('parcel_drop_city');
      localStorage.removeItem('travel_from_city');
      localStorage.removeItem('travel_to_city');
      return;
    }

    if (pendingFlow) localStorage.setItem('pending_flow', pendingFlow);
    else localStorage.removeItem('pending_flow');
    if (pendingCreate) {
      localStorage.setItem('pending_create_parcel', pendingCreate);
    } else {
      localStorage.removeItem('pending_create_parcel');
    }
    if (pickup) localStorage.setItem('parcel_pickup_city', pickup);
    else localStorage.removeItem('parcel_pickup_city');
    if (drop) localStorage.setItem('parcel_drop_city', drop);
    else localStorage.removeItem('parcel_drop_city');
    if (travelFrom) localStorage.setItem('travel_from_city', travelFrom);
    else localStorage.removeItem('travel_from_city');
    if (travelTo) localStorage.setItem('travel_to_city', travelTo);
    else localStorage.removeItem('travel_to_city');
  }

  private applyUser(user: UserData): void {
    const normalized = this.normalizeUser(user);
    localStorage.setItem('user', JSON.stringify(normalized));
    this.currentUserSubject.next(normalized);
  }

  private normalizeUser(user: UserData): UserData {
    const u = { ...user };
    if (!u._id && (u as any).id) {
      u._id = (u as any).id;
    }
    if (u.isVerified === undefined && (u as any).isVerifed !== undefined) {
      u.isVerified = (u as any).isVerifed;
    }
    return u;
  }

  private storeAuth(res: AuthResponse): void {
    const token = res.token ?? res.accessToken;
    if (token) {
      localStorage.setItem('token', token);
      this.bootstrapDone = false;
    }
    if (res.refreshToken) {
      localStorage.setItem('refreshToken', res.refreshToken);
    }
    if (res.user) {
      this.applyUser(res.user);
    }
  }

  register(data: Record<string, unknown>): Observable<AuthResponse> {
    this.clearSession(true);
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, data);
  }

  login(data: { phone: string; password: string }): Observable<AuthResponse> {
    this.clearSession(true);
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/login`, data)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  verifyOtp(data: { phone: string; otp: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/verify-otp`, data)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  resendOtp(phone: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/auth/resend-otp`, {
      phone,
    });
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/refresh-token`, {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(tap((res) => this.storeAuth(res)));
  }

  logout(): void {
    this.clearSession(false);
    this.router.navigate(['/landing']);
  }

  getDashboardRoute(): string {
    switch (this.userRole) {
      case 'admin':
        return '/dashboard/admin';
      case 'traveller':
        return '/dashboard/traveller';
      case 'sender':
        return '/dashboard/sender';
      default:
        return '/login';
    }
  }

  setPendingFlow(flow: 'sender' | 'traveller' | null): void {
    if (flow === 'sender') {
      localStorage.setItem('pending_flow', 'sender');
    } else if (flow === 'traveller') {
      localStorage.setItem('pending_flow', 'traveller');
      localStorage.removeItem('pending_create_parcel');
    } else {
      localStorage.removeItem('pending_flow');
      localStorage.removeItem('pending_create_parcel');
    }
  }

  getPostAuthRoute(): string {
    const pendingFlow = localStorage.getItem('pending_flow') as
      | 'sender'
      | 'traveller'
      | null;
    const role = this.userRole;
    if (!role) return '/landing';

    if (pendingFlow === 'sender' && role === 'sender') {
      localStorage.removeItem('pending_flow');
      if (localStorage.getItem('pending_create_parcel') === 'true') {
        localStorage.removeItem('pending_create_parcel');
        return '/dashboard/create-parcel';
      }
      return '/dashboard/sender';
    }

    if (pendingFlow === 'traveller' && role === 'traveller') {
      localStorage.removeItem('pending_flow');
      return '/dashboard/add-travel-plan';
    }

    localStorage.removeItem('pending_flow');
    localStorage.removeItem('pending_create_parcel');
    return this.getDashboardRoute();
  }

  canAccessSenderMode(): boolean {
    return this.userRole === 'sender';
  }

  canAccessTravellerMode(): boolean {
    return this.userRole === 'traveller';
  }

  canAccessAdminMode(): boolean {
    return this.userRole === 'admin';
  }

  getRoleLabel(): string {
    switch (this.userRole) {
      case 'admin':
        return 'Admin';
      case 'traveller':
        return 'Traveller';
      case 'sender':
        return 'Sender';
      default:
        return 'Guest';
    }
  }

  switchAccountForFlow(target: 'sender' | 'traveller'): boolean {
    const role = this.userRole;
    if (!this.isLoggedIn || role === target) {
      return true;
    }
    const label =
      role === 'admin' ? 'Admin' : role === 'traveller' ? 'Traveller' : 'Sender';
    const targetLabel = target === 'sender' ? 'Sender' : 'Traveller';
    const ok = confirm(
      `You are signed in as ${label}. Log out and continue as ${targetLabel}?`
    );
    if (!ok) return false;
    this.clearSession(true);
    return true;
  }
}
