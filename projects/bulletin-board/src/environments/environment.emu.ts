import { Environment } from './environment.models';
import { menus } from './menus';

export const environment: Environment = {
  production: true,
  configPath: 'config/config.emu.json',
  firebase: {
    apiKey: 'AIzaSyBmDXSzTRQs-OmSzuvsmQXO3cEPBTDWkIs',
    authDomain: 'anomzone-staging.firebaseapp.com',
    projectId: 'anomzone-staging',
  },
  firestore: { host: 'localhost:8080', ssl: false },
  functions: 'http://localhost:5001',
  menus,
};
