import { FirebaseOptions } from '@angular/fire';

export interface Environment {
  production: boolean;
  configPath: string;
  firebase: FirebaseOptions;
  firestore: Partial<{ host: string; ssl: boolean }>;
  functions?: string;
  menus: {
    planets: string[];
    foods: string[];
    sports: string[];
    countries: string[];
    names: string[];
  };
}

// https://nineplanets.org/
