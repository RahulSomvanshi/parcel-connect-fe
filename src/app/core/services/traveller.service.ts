import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcel } from './parcel.service';
import { environment } from '../../../environments/environment'

export interface TravelPlan {
  _id?: string;
  user?: string;
  from: string;
  to: string;
  travelDate: string;
  vehicleType: 'bus' | 'train' | 'car';
  availableWeight: number;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTravelPlanRequest {
  from: string;
  to: string;
  travelDate: string;
  vehicleType: 'bus' | 'train' | 'car';
  availableWeight: number;
}

@Injectable({
  providedIn: 'root',
})
export class TravellerService {

  constructor(private http: HttpClient) {}
   private baseUrl = environment.apiUrl;
  // Create a new travel plan
  createTravelPlan(data: CreateTravelPlanRequest): Observable<TravelPlan> {
    return this.http.post<TravelPlan>(`${this.baseUrl}/traveller`, data);
  }

  // Get all travel plans for the current traveller
  getTravelPlans(): Observable<TravelPlan[]> {
    return this.http.get<TravelPlan[]>(`${this.baseUrl}/traveller`);
  }

  // Get a specific travel plan by ID
  getTravelPlanById(id: string): Observable<TravelPlan> {
    return this.http.get<TravelPlan>(`${this.baseUrl}/traveller/${id}`);
  }

  // Update a travel plan
  updateTravelPlan(id: string, data: Partial<CreateTravelPlanRequest>): Observable<TravelPlan> {
    return this.http.put<TravelPlan>(`${this.baseUrl}/traveller/${id}`, data);
  }

  // Delete a travel plan
  deleteTravelPlan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/traveller/${id}`);
  }

  // Get matching parcels for the traveller
  getMatchingParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.baseUrl}/traveller/matching/parcels`);
  }

  // Respond to a parcel (accept, decline, or deliver)
  respondToParcel(parcelId: string, action: 'accept' | 'decline' | 'deliver'): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/parcels/respond`, { parcelId, action });
  }

  // Get assigned parcels for the traveller
  getAssignedParcels(): Observable<Parcel[]> {
    return this.http.get<Parcel[]>(`${this.baseUrl}/traveller/assigned`);
  }
}
