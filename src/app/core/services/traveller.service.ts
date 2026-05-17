import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Parcel } from './parcel.service';
import { environment } from '../../../environments/environment';
import { EarningsPreview, TravellerStats } from './stats.service';
import { PaginationInfo } from './admin.service';

export interface TravelPlan {
  _id?: string;
  user?: string;
  from: string;
  to: string;
  travelDate: string;
  vehicleType: 'bus' | 'train' | 'car';
  availableWeight: number;
  isAvailable?: boolean;
  status?:
    | 'PLANNED'
    | 'ACTIVE'
    | 'IN_TRANSIT'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'scheduled'
    | 'in_transit'
    | 'completed'
    | 'cancelled';
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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface TravellerDashboardBundle {
  trips: PaginatedResponse<TravelPlan>;
  recentDeliveries: Parcel[];
  topMatching: Parcel[];
  stats: TravellerStats;
}

@Injectable({
  providedIn: 'root',
})
export class TravellerService {

  constructor(private http: HttpClient) {}
   private baseUrl = environment.apiUrl;
  // Create a new travel plan
  createTravelPlan(data: CreateTravelPlanRequest): Observable<TravelPlan> {
    return this.http
      .post<TravelPlan | { trip: TravelPlan }>(`${this.baseUrl}/traveller`, data)
      .pipe(map((res) => ('trip' in (res as any) ? (res as any).trip : (res as TravelPlan))));
  }

  // Get all travel plans for the current traveller
  getTravelPlansPage(page = 1, limit = 5): Observable<PaginatedResponse<TravelPlan>> {
    return this.http
      .get<PaginatedResponse<TravelPlan> | TravelPlan[]>(`${this.baseUrl}/traveller`, {
        params: { page: String(page), limit: String(limit) },
      })
      .pipe(map((res) => this.normalizePaginated(res, page, limit)));
  }

  getTravelPlans(page = 1, limit = 5): Observable<TravelPlan[]> {
    return this.getTravelPlansPage(page, limit).pipe(map((res) => res.data));
  }

  getDashboard(page = 1, limit = 5): Observable<TravellerDashboardBundle> {
    return this.http.get<TravellerDashboardBundle>(`${this.baseUrl}/traveller/dashboard`, {
      params: { page: String(page), limit: String(limit) },
    });
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
  getMatchingParcelsPage(
    tripId?: string,
    page = 1,
    limit = 5
  ): Observable<PaginatedResponse<Parcel>> {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (tripId) params['tripId'] = tripId;

    return this.http
      .get<PaginatedResponse<Parcel> | Parcel[]>(
        `${this.baseUrl}/traveller/matching/parcels`,
        { params }
      )
      .pipe(map((res) => this.normalizePaginated(res, page, limit)));
  }

  getMatchingParcels(tripId?: string, page = 1, limit = 5): Observable<Parcel[]> {
    return this.getMatchingParcelsPage(tripId, page, limit).pipe(map((res) => res.data));
  }

  // Respond to a parcel (accept, decline, or deliver)
  respondToParcel(
    parcelId: string,
    action: 'accept' | 'reject' | 'pick_up' | 'in_transit' | 'deliver' | 'cancel'
  ): Observable<{ message: string; parcel?: Parcel; warning?: string }> {
    return this.http.post<{ message: string; parcel?: Parcel; warning?: string }>(
      `${this.baseUrl}/parcels/respond`,
      { parcelId, action }
    );
  }

  acceptParcelForTrip(
    tripId: string,
    parcelId: string
  ): Observable<{ message: string; parcel: Parcel; trip: TravelPlan }> {
    return this.http.post<{ message: string; parcel: Parcel; trip: TravelPlan }>(
      `${this.baseUrl}/traveller/trips/${tripId}/accept/${parcelId}`,
      {}
    );
  }

  updateAssignedParcelStatus(
    parcelId: string,
    status: 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
  ): Observable<{ message: string; parcel: Parcel }> {
    return this.http.patch<{ message: string; parcel: Parcel }>(
      `${this.baseUrl}/parcels/${parcelId}/status`,
      { status }
    );
  }

  // Get assigned parcels for the traveller
  getAssignedParcelsPage(page = 1, limit = 5): Observable<PaginatedResponse<Parcel>> {
    return this.http
      .get<PaginatedResponse<Parcel> | Parcel[]>(
        `${this.baseUrl}/traveller/assigned`,
        { params: { page: String(page), limit: String(limit) } }
      )
      .pipe(map((res) => this.normalizePaginated(res, page, limit)));
  }

  getAssignedParcels(page = 1, limit = 5): Observable<Parcel[]> {
    return this.getAssignedParcelsPage(page, limit).pipe(map((res) => res.data));
  }

  // Update trip status
  updateTripStatus(
    tripId: string,
    status:
      | 'ACTIVE'
      | 'PLANNED'
      | 'IN_TRANSIT'
      | 'COMPLETED'
      | 'CANCELLED'
      | 'scheduled'
      | 'in_transit'
      | 'completed'
      | 'cancelled'
  ): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/traveller/${tripId}/status`, { status });
  }

  getTravellerStats(): Observable<TravellerStats> {
    return this.http.get<TravellerStats>(`${this.baseUrl}/traveller/stats`);
  }

  getEarningsPreview(from: string, to: string, availableWeight?: number): Observable<EarningsPreview> {
    const params: Record<string, string> = { from, to };
    if (availableWeight) {
      params['availableWeight'] = String(availableWeight);
    }
    return this.http.get<EarningsPreview>(`${this.baseUrl}/traveller/earnings-preview`, { params });
  }

  private normalizePaginated<T>(
    res: PaginatedResponse<T> | T[],
    page: number,
    limit: number
  ): PaginatedResponse<T> {
    if (Array.isArray(res)) {
      return {
        data: res,
        pagination: {
          total: res.length,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(res.length / limit)),
        },
      };
    }

    return res;
  }
}
