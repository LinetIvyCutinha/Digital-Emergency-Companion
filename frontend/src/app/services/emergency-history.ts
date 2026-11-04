import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmergencyHistory {
  _id?: string;
  title: string;
  description: string;
  date: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmergencyHistoryService {

  private apiUrl = 'http://localhost:5000/api/emergency-history';

  constructor(private http: HttpClient) {}

  getHistory(): Observable<EmergencyHistory[]> {
    return this.http.get<EmergencyHistory[]>(this.apiUrl);
  }

  addHistory(event: EmergencyHistory): Observable<any> {
    return this.http.post(this.apiUrl, event);
  }

  deleteHistory(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}


}