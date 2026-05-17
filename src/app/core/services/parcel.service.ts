import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ParcelStatus } from '../utils/parcel-status.util';

export interface ParcelSender {
  _id?: string;
  fullName?: string;
  phone?: string;
}

export interface Parcel {
  _id?: string;
  sender?: ParcelSender | string;
  traveller?: ParcelSender | string | null;
  pickup: {
    city: string;
    address: string;
  };
  drop: {
    city: string;
    address: string;
  };
  weight: number;
  parcelDate?: string;
  preferredTravelDate?: string;
  description?: string;
  price?: number;
  status: ParcelStatus;
  isFlagged?: boolean;
  flaggedKeywords?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedParcels {
  parcels: Parcel[];
  data?: Parcel[];
  total: number;
  page: number;
  limit: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProhibitedItemsResponse {
  items: string[];
}

export interface CreateParcelRequest {
  pickup: {
    city: string;
  };
  drop: {
    city: string;
  };
  weight: number;
  parcelDate: string;
  preferredTravelDate?: string;
  description?: string;
  price?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ParcelService {

  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;
  // Create a new parcel
  createParcel(parcelData: CreateParcelRequest): Observable<Parcel> {
    return this.http.post<Parcel>(`${this.baseUrl}/parcels`, parcelData);
  }

  // Get all parcels for the current user (sender)
  getParcelsPage(page = 1, limit = 5): Observable<PaginatedParcels> {
    return this.http
      .get<PaginatedParcels | Parcel[]>(`${this.baseUrl}/parcels`, {
        params: { page: String(page), limit: String(limit) },
      })
      .pipe(map((res) => this.normalizePaginatedParcels(res, page, limit)));
  }

  getParcels(page = 1, limit = 5): Observable<Parcel[]> {
    return this.getParcelsPage(page, limit).pipe(map((res) => res.parcels));
  }

  getMyParcelsPage(page = 1, limit = 5): Observable<PaginatedParcels> {
    return this.http
      .get<PaginatedParcels | Parcel[]>(`${this.baseUrl}/parcels/my`, {
        params: { page: String(page), limit: String(limit) },
      })
      .pipe(map((res) => this.normalizePaginatedParcels(res, page, limit)));
  }

  getMyParcels(page = 1, limit = 5): Observable<Parcel[]> {
    return this.getMyParcelsPage(page, limit).pipe(map((res) => res.parcels));
  }

  // Get a specific parcel by ID
  getParcelById(id: string): Observable<Parcel> {
    return this.http.get<Parcel>(`${this.baseUrl}/parcels/${id}`);
  }

  // Update parcel status
  updateParcelStatus(id: string, status: Parcel['status']): Observable<Parcel> {
    return this.http.patch<Parcel>(`${this.baseUrl}/parcels/${id}/status`, { status });
  }

  // Delete parcel
  deleteParcel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/parcels/${id}`);
  }

  getProhibitedItems(): Observable<string[]> {
    return this.http
      .get<ProhibitedItemsResponse>(`${this.baseUrl}/parcels/prohibited-items`)
      .pipe(map((res) => res.items || []));
  }

  private normalizePaginatedParcels(
    res: PaginatedParcels | Parcel[],
    page: number,
    limit: number
  ): PaginatedParcels {
    if (Array.isArray(res)) {
      return {
        parcels: res,
        total: res.length,
        page,
        limit,
        pagination: {
          total: res.length,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(res.length / limit)),
        },
      };
    }

    const pagination = res.pagination ?? {
      total: res.total,
      page: res.page,
      limit: res.limit,
      totalPages: Math.max(1, Math.ceil(res.total / res.limit)),
    };

    return {
      ...res,
      parcels: res.parcels ?? res.data ?? [],
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      pagination,
    };
  }
}