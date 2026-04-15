import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  description?: string;
  price?: number;
  status: 'searching' | 'matched' | 'in_transit' | 'delivered';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateParcelRequest {
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
}

@Injectable({
  providedIn: 'root',
})
export class ParcelService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Create a new parcel
  createParcel(parcelData: CreateParcelRequest): Observable<Parcel> {
    return this.http.post<Parcel>(`${this.baseUrl}/parcels`, parcelData);
  }

  // Get all parcels for the current user (sender)
  getParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.baseUrl}/parcels`);
  }

  // Get parcels created by the current sender with traveller details populated
  getMyParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.baseUrl}/parcels/my`);
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
}