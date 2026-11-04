
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmergencyContact {
  _id?: string;
  name: string;
  phone: string;
  relationship: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmergencyContactService {

  private apiUrl = 'http://localhost:5000/api/contacts';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<EmergencyContact[]> {
    return this.http.get<EmergencyContact[]>(this.apiUrl);
  }

  addContact(contact: EmergencyContact): Observable<any> {
    return this.http.post(this.apiUrl, contact);
  }

  deleteContact(id: string) {
  return this.http.delete(
    `http://localhost:5000/api/contacts/${id}`
  );
}
}
