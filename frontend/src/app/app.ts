
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { DatePipe } from '@angular/common';
import { CommonModule, DatePipe } from '@angular/common';
import {
  EmergencyContactService,
  EmergencyContact
} from './services/emergency-contact';

import {
  MedicalInfoService,
  MedicalInfo
} from './services/medical-info';

import {
  EmergencyHistoryService,
  EmergencyHistory
} from './services/emergency-history';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FormsModule,DatePipe,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'Digital Emergency Companion';
  currentSection = 'home';

  contacts: EmergencyContact[] = [];

  emergencyHistory: EmergencyHistory[] = [];

  nearbyHospitals: {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  distance: number | null;
  mapUrl: string;
}[] = [];

  medicalInfo: MedicalInfo = {
  bloodGroup: '',
  allergies: '',
  conditions: '',
  medications: '',
  notes: ''
};

medicalLoading = false;

  
constructor(
  private contactService: EmergencyContactService,
  private medicalInfoService: MedicalInfoService,
  private emergencyHistoryService: EmergencyHistoryService
) {}


  ngOnInit(): void {
  this.loadContacts();
  this.loadMedicalInfo();
  this.loadEmergencyHistory();

  const savedHospitals = sessionStorage.getItem('nearbyHospitals');

if (savedHospitals) {
  this.nearbyHospitals = JSON.parse(savedHospitals);
}
}

  loadContacts(): void {
    this.contactService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        alert('Unable to load contacts. Check whether your backend is running.');
      }
    });
  }

  deleteContact(id: string | undefined): void {
  if (!id) {
    alert('Unable to delete this contact: contact ID is missing.');
    return;
  }

  const confirmed = confirm('Are you sure you want to delete this contact?');

  if (!confirmed) return;

  this.contactService.deleteContact(id).subscribe({
    next: () => {
      alert('Contact deleted successfully!');
      this.loadContacts();
    },
    error: (error) => {
      console.error('Delete contact error:', error);
      alert('Failed to delete contact. Please try again.');
    }
  });
}

  addContact(): void {
  const name = prompt('Enter contact name:')?.trim();
  if (!name) return;

  const phone = prompt('Enter phone number:')?.trim();
  if (!phone) return;

  const relationship = prompt('Enter relationship:')?.trim();
  if (!relationship) return;

  const newContact: EmergencyContact = {
    name,
    phone,
    relationship
  };

  this.contactService.addContact(newContact).subscribe({
    next: () => {
      alert(`${name} added successfully!`);
      this.loadContacts();
    },
    error: (error) => {
      console.error('Add contact error:', error);
      alert('Failed to add contact. Please try again.');
    }
  });
}

  
openSOS(): void {
  const confirmed = confirm('Are you sure you want to activate SOS?');

  if (!confirmed) {
    return;
  }

  this.emergencyHistoryService.addHistory({
    title: 'SOS Activated',
    description: 'Emergency SOS was activated.',
    date: new Date().toISOString(),
    status: 'Completed'
  }).subscribe({
    next: () => {
  this.loadEmergencyHistory();
  alert('SOS activation recorded in Emergency History.');
},
    error: (error) => {
      console.error('Error saving SOS history:', error);
      alert('Could not save SOS history. Please try again.');
    }
  });
}



// showSection(section: string, button?: EventTarget | null): void {
//   this.currentSection = section;

//   document.querySelectorAll('.section, .page-section').forEach((element) => {
//     (element as HTMLElement).style.display = 'none';
//   });

//   const selectedSection = document.getElementById(section);

//   if (selectedSection) {
//     selectedSection.style.display = 'block';
//   } else {
//     console.error(`Section not found: ${section}`);
//   }

//   document.querySelectorAll('.nav-item').forEach((element) => {
//     element.classList.remove('active');
//   });

//   if (button instanceof HTMLElement) {
//     button.classList.add('active');
//   }
// }


showSection(section: string, button?: EventTarget | null): void {
  this.currentSection = section;

  document.querySelectorAll('.section, .page-section').forEach((element) => {
    (element as HTMLElement).style.display = 'none';
  });

  const selectedSection = document.getElementById(section);

  if (selectedSection) {
    selectedSection.style.display = 'block';
  } else {
    console.error(`Section not found: ${section}`);
  }

  document.querySelectorAll('.nav-item').forEach((element) => {
    element.classList.remove('active');
  });

  if (button instanceof HTMLElement) {
    button.classList.add('active');
  }
}

toggleDarkMode(): void {
  document.body.classList.toggle('dark-mode');
}




loadMedicalInfo(): void {
  this.medicalLoading = true;

  this.medicalInfoService.getMedicalInfo().subscribe({
    next: (info) => {
      console.log('Medical information received:', info);

      this.medicalInfo = {
        bloodGroup: info?.bloodGroup || '',
        allergies: info?.allergies || '',
        conditions: info?.conditions || '',
        medications: info?.medications || '',
        notes: info?.notes || ''
      };

      this.medicalLoading = false;
    },
    error: (error) => {
      console.error('Error loading medical information:', error);
      this.medicalLoading = false;
    }
  });
}


saveMedicalInfo(): void {
  this.medicalInfoService.saveMedicalInfo(this.medicalInfo).subscribe({
    next: (response) => {
  this.medicalInfo = {
    bloodGroup: response.medicalInfo.bloodGroup || '',
    allergies: response.medicalInfo.allergies || '',
    conditions: response.medicalInfo.conditions || '',
    medications: response.medicalInfo.medications || '',
    notes: response.medicalInfo.notes || ''
  };

  alert('Medical information saved successfully!');
},
    error: (error) => {
      console.error('Error saving medical information:', error);
      alert('Unable to save medical information. Check the backend.');
    }
  });
}



viewMedicalCard(): void {
  this.loadMedicalInfo();

  setTimeout(() => {
    const card = document.getElementById('medical-card-modal');

    if (card) {
      card.style.display = 'flex';
    }
  }, 300);
}


closeMedicalCard(): void {
  const card = document.getElementById('medical-card-modal');

  if (card) {
    card.style.display = 'none';
  }
}



selectedFirstAid = '';
firstAidGuidance: { [key: string]: string[] } = {
  'Bleeding': [
    'Apply firm, continuous pressure directly to the wound with clean cloth or gauze.',
    'If blood soaks through, add more material without removing the first layer.',
    'For severe bleeding, call your local emergency number (112 in India). Keep pressure on the wound while waiting for help.'
  ],
  'Burns': [
    'Cool the burn under cool running water for 20 minutes.',
    'Remove jewellery or clothing near the burn if it is not stuck to the skin.',
    'Do not apply ice, butter, toothpaste, or creams. Cover loosely with a clean, non-fluffy dressing and seek medical help for serious burns.'
  ],
  'CPR': [
    'Check whether the person responds and is breathing normally.',
    'Call 112 in India or ask someone nearby to call and get an AED.',
    'If the person is unresponsive and not breathing normally, start hard, fast chest compressions in the centre of the chest at 100–120 per minute. Follow the emergency dispatcher’s instructions.'
  ],
  'Fracture': [
    'Keep the injured area still and supported in the position found.',
    'Do not attempt to straighten the bone or push a protruding bone back in.',
    'For a suspected serious fracture, call emergency services. Control severe bleeding without putting pressure directly on an exposed bone.'
  ],
  'Fainting': [
    'Help the person lie flat and check that they are breathing normally.',
    'If there is no suspected injury, raise their legs slightly.',
    'If they do not recover quickly, are injured, have chest pain, or are not breathing normally, call 112. If unconscious but breathing, place them in the recovery position unless an injury prevents it.'
  ],
  'Snake Bite': [
    'Move away from the snake and keep the person calm and still.',
    'Immobilize the bitten limb and remove rings or tight items. Get emergency medical help immediately.',
    'Do not cut or suck the wound, apply ice, or tie a tight tourniquet. Do not try to catch the snake.'
  ]
};

showFirstAid(title: string): void {
  this.selectedFirstAid = title;
}



closeFirstAid(): void {
  this.selectedFirstAid = '';
}


// emergencyHistory: {
//   _id?: string;
//   title: string;
//   description: string;
//   date: string | Date;
//   status: string;
// }[] = [];


loadEmergencyHistory(): void {
  this.emergencyHistoryService.getHistory().subscribe({
    next: (history) => {
      this.emergencyHistory = history;
      console.log('Emergency history loaded:', history);
    },
    error: (error) => {
      console.error('Error loading emergency history:', error);
    }
  });
}




getLocation(): void {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by this browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      alert('Location found! Searching for nearby hospitals...');

      const query = `
        [out:json][timeout:25];
        nwr["amenity"="hospital"]
          (around:5000,${latitude},${longitude});
        out center tags;
      `;

      try {
        const servers = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter'
];

let data: any = null;

for (const server of servers) {
  try {
    const response = await fetch(server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ data: query }).toString()
    });

    if (!response.ok) {
      continue;
    }

    data = await response.json();
    break;
  } catch (error) {
    console.log('Hospital server unavailable:', server);
  }
}

if (!data) {
  throw new Error('All hospital search servers failed.');
}

console.log('Hospital search results:', data.elements);
        

        const hospitals = data.elements.map((item: any) => {
          const lat = item.lat ?? item.center?.lat;
          const lon = item.lon ?? item.center?.lon;

          return {
            name: item.tags?.name || 'Hospital name unavailable',
            latitude: lat,
            longitude: lon,
            address: [
              item.tags?.['addr:street'],
              item.tags?.['addr:city']
            ].filter(Boolean).join(', '),
            distance: lat != null && lon != null
              ? this.calculateDistance(
                  latitude, longitude, lat, lon
                )
              : null,
            mapUrl: lat != null && lon != null
              ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`
              : ''
          };
        });

        this.nearbyHospitals = hospitals
          .filter((hospital: any) => hospital.latitude != null &&
                                     hospital.longitude != null)
          .sort((a: any, b: any) =>
            (a.distance ?? Infinity) - (b.distance ?? Infinity)
          );

          sessionStorage.setItem(
  'nearbyHospitals',
  JSON.stringify(this.nearbyHospitals)
);

          console.log('Hospitals assigned to Angular:', this.nearbyHospitals);

        if (this.nearbyHospitals.length === 0) {
          alert('No hospitals found within 5 km. Try again later or search a wider area.');
          return;
        }

        this.emergencyHistoryService.addHistory({
          title: 'Hospital Search',
          description: `Found ${this.nearbyHospitals.length} nearby hospitals within 5 km.`,
          date: new Date().toISOString(),
          status: 'Completed'
        }).subscribe({
          next: () => this.loadEmergencyHistory(),
          error: (error) =>
            console.error('Could not save hospital search history:', error)
        });

      } catch (error) {
  console.error('Hospital search failed:', error);

  const savedHospitals = sessionStorage.getItem('nearbyHospitals');

  if (savedHospitals) {
    this.nearbyHospitals = JSON.parse(savedHospitals);
    alert('Hospital search failed. Showing your previously saved hospitals.');
  } else {
    alert('Could not search for hospitals. Please check your internet connection and try again.');
  }
}
    },
    (error) => {
      console.error('Location error:', error);
      alert('Unable to get your location. Please allow location access.');
    },
    { enableHighAccuracy: true, timeout: 15000 }
  );
}

calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


deleteEmergencyHistory(event: EmergencyHistory): void {
  if (!event._id) {
    alert('Cannot delete this record because its ID is missing.');
    return;
  }

  const confirmed = confirm(
    `Are you sure you want to delete "${event.title}" from Emergency History?`
  );

  if (!confirmed) {
    return;
  }

  this.emergencyHistoryService.deleteHistory(event._id).subscribe({
    next: () => {
      this.emergencyHistory = this.emergencyHistory.filter(
        (item) => item._id !== event._id
      );
      alert('Emergency history deleted successfully.');
    },
    error: (error) => {
      console.error('Error deleting emergency history:', error);
      alert('Could not delete this record. Please try again.');
    }
  });
}




}
