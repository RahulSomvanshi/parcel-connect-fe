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
  role: 'user' | 'admin';
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
  status: 'searching' | 'matched' | 'in_transit' | 'delivered';
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

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  constructor(private http: HttpClient) {}
   private baseUrl = environment.apiUrl;

  // Get all users with pagination
  getAllUsers(page: number = 1, limit: number = 10): Observable<PaginatedResponse<AdminUser>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<AdminUser>>(
      `${this.baseUrl}/admin/users`,
      { params }
    );
  }

  // Get all parcels with pagination
  getAllParcels(page: number = 1, limit: number = 10): Observable<PaginatedResponse<AdminParcel>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<AdminParcel>>(
      `${this.baseUrl}/admin/parcels`,
      { params }
    );
  }
}
