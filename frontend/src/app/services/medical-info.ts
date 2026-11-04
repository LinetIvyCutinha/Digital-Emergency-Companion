
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MedicalInfo {
  _id?: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  medications: string;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalInfoService {
  private apiUrl = 'http://localhost:5000/api/medical-info';

  constructor(private http: HttpClient) {}

  getMedicalInfo(): Observable<MedicalInfo> {
    return this.http.get<MedicalInfo>(this.apiUrl);
  }

  saveMedicalInfo(info: MedicalInfo): Observable<any> {
    return this.http.post(this.apiUrl, info);
  }
}
