import { TestBed } from '@angular/core/testing';
import { EmergencyContact } from './emergency-contact';

describe('EmergencyContact', () => {
  let service: EmergencyContact;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyContact);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
