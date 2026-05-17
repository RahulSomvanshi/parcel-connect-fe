import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PublicStats {
  totalParcels: number;
  totalUsers: number;
  activeRoutes: number;
}

export interface TravellerStats {
  totalDeliveries: number;
  completedDeliveries: number;
  activeDeliveries: number;
  totalTrips: number;
  activeTrips: number;
  totalParcelValue: number;
  companyShare: number;
  travellerEarnings: number;
  pendingEarnings: number;
  companyFeePercent: number;
  travellerSharePercent: number;
}

export interface EarningsPreview {
  matchingCount: number;
  totalParcelValue: number;
  companyShare: number;
  tripEarning: number;
  companyFeePercent: number;
  travellerSharePercent: number;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPublicStats(): Observable<PublicStats> {
    return this.http.get<PublicStats>(`${this.baseUrl}/stats/public`);
  }
}
