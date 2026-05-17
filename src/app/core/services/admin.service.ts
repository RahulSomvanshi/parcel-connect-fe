import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment'


// ── Admin User Interface ──
export interface AdminUser {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  role: 'sender' | 'traveller' | 'admin';
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ── Admin Parcel Interface ──
export interface AdminParcelUser {
  _id: string;
  fullName: string;
  phone: string;
  role: string;
}

export interface AdminParcel {
  _id: string;
  sender?: AdminParcelUser | string;
  traveller?: AdminParcelUser | string | null;
  pickup: {
    city: string;
    address: string;
  };
  drop: {
    city: string;
    address: string;
  };
  weight: number;
  description?: string;
  price?: number;
  status:
    | 'PENDING'
    | 'MATCHED'
    | 'OPEN'
    | 'ACCEPTED'
    | 'PICKED_UP'
    | 'IN_TRANSIT'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REJECTED'
    | 'searching'
    | 'matched'
    | 'in_transit'
    | 'delivered';
  createdAt?: string;
  updatedAt?: string;
}

// ── Pagination Interface ──
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface AdminDashboardBundle {
  stats: AdminStats;
  users: PaginatedResponse<AdminUser>;
  parcels: PaginatedResponse<AdminParcel>;
  travellers: AdminUser[];
}

export interface AdminStats {
  users: {
    total: number;
    senders: number;
    travellers: number;
    admins: number;
    verified: number;
    unverified: number;
  };
  parcels: {
    total: number;
    searching: number;
    matched: number;
    in_transit: number;
    delivered: number;
  };
  trips: {
    total: number;
    active: number;
  };
  revenue: {
    total: number;
    delivered: number;
    companyShare: number;
    travellerShare: number;
    companyFeePercent: number;
  };
  recentUsers: AdminUser[];
  recentParcels: AdminParcel[];
}

export interface AdminProhibitedItemsResponse {
  defaultItems: string[];
  customItems: string[];
  allItems: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  constructor(private http: HttpClient) {}
   private baseUrl = environment.apiUrl;

  /** Load stats, users page, parcels page, and travellers in one request (backend Promise.all) */
  getDashboard(
    page: number = 1,
    limit: number = 5
  ): Observable<AdminDashboardBundle> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<AdminDashboardBundle>(`${this.baseUrl}/admin/dashboard`, {
      params,
    });
  }

  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.baseUrl}/admin/stats`);
  }

  getAllUsers(
    page: number = 1,
    limit: number = 5,
    role?: 'sender' | 'traveller' | 'admin'
  ): Observable<PaginatedResponse<AdminUser>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const requestParams = role ? params.set('role', role) : params;

    return this.http.get<PaginatedResponse<AdminUser>>(
      `${this.baseUrl}/admin/users`,
      { params: requestParams }
    );
  }

  // Get all parcels with pagination
  getAllParcels(page: number = 1, limit: number = 5): Observable<PaginatedResponse<AdminParcel>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<AdminParcel>>(
      `${this.baseUrl}/admin/parcels`,
      { params }
    );
  }

  // Create a new traveller user
  createTravellerUser(data: { fullName: string; email?: string; phone: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/travellers`, data);
  }

  // Create a travel plan for an existing traveller user
  createTravelPlan(data: { userId: string; from: string; to: string; travelDate: string; vehicleType: string; availableWeight: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/trips`, data);
  }

  // Get all traveller users
  getTravellers(page: number = 1, limit: number = 5): Observable<PaginatedResponse<AdminUser>> {
    return this.getAllUsers(page, limit, 'traveller');
  }

  getProhibitedItems(): Observable<AdminProhibitedItemsResponse> {
    return this.http.get<AdminProhibitedItemsResponse>(
      `${this.baseUrl}/admin/prohibited-items`
    );
  }

  updateProhibitedItems(items: string[]): Observable<{ message: string; customItems: string[] }> {
    return this.http.put<{ message: string; customItems: string[] }>(
      `${this.baseUrl}/admin/prohibited-items`,
      { items }
    );
  }
}
