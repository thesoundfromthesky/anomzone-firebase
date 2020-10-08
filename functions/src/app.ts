import * as admin from 'firebase-admin';

import * as credentialsStaging from '../../credentials/credentials-staging.json';
import * as credentialsProd from '../../credentials/credentials-prod.json';

export const enum Config {
  Emu = 'emu',
  Staging = 'staging',
  Prod = 'prod',
}

export function getServerTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}

export function getAppLookupTable(select: Config): admin.app.App {
  const lookupTable = {
    [Config.Emu]: () => {
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      return admin.initializeApp({
        credential: admin.credential.cert(
          credentialsStaging as admin.ServiceAccount
        ),
        databaseURL: 'https://anomzone-staging.firebaseio.com',
      });
    },
    [Config.Staging]: () => {
      return admin.initializeApp({
        credential: admin.credential.cert(
          credentialsStaging as admin.ServiceAccount
        ),
        databaseURL: 'https://anomzone-staging.firebaseio.com',
      });
    },
    [Config.Prod]: () => {
      return admin.initializeApp({
        credential: admin.credential.cert(
          credentialsProd as admin.ServiceAccount
        ),
        databaseURL: 'https://anomzone-dev.firebaseio.com',
      });
    },
    default: () => {
      throw Error('Config not found');
    },
  };

  return (lookupTable[select] || lookupTable['default'])();
}

export class App {
  protected app!: admin.app.App;
  protected isAggregateNew!: boolean;
  constructor(protected readonly config: Config) {}

  protected init() {
    this.app = this.getAppLookupTable(this.config);
  }

  protected getServerTimestamp() {
    return admin.firestore.FieldValue.serverTimestamp();
  }

  protected getIncrement(n: number = 1) {
    return admin.firestore.FieldValue.increment(n);
  }

  protected getTimestamps(both?: boolean) {
    if (both || this.isAggregateNew) {
      return {
        createdAt: this.getServerTimestamp(),
        updatedAt: this.getServerTimestamp(),
      };
    } else {
      return { updatedAt: this.getServerTimestamp() };
    }
  }
  protected getAppLookupTable(select: Config): admin.app.App {
    if (!admin.apps.length) {
      const lookupTable = {
        [Config.Emu]: () => {
          process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
          return admin.initializeApp({
            credential: admin.credential.cert(
              credentialsStaging as admin.ServiceAccount
            ),
            databaseURL: 'https://anomzone-staging.firebaseio.com',
          });
        },
        [Config.Staging]: () => {
          return admin.initializeApp({
            credential: admin.credential.cert(
              credentialsStaging as admin.ServiceAccount
            ),
            databaseURL: 'https://anomzone-staging.firebaseio.com',
          });
        },
        [Config.Prod]: () => {
          return admin.initializeApp({
            credential: admin.credential.cert(
              credentialsProd as admin.ServiceAccount
            ),
            databaseURL: 'https://anomzone-dev.firebaseio.com',
          });
        },
        default: () => {
          throw Error('Config not found');
        },
      };

      return (lookupTable[select] || lookupTable['default'])();
    } else {
      return admin.app();
    }
  }

  protected async setCustomClaims(uid: string, claims: any) {
    await admin.auth().setCustomUserClaims(uid, claims);
  }

  protected async getUser(uid: string) {
    return await admin.auth().getUser(uid);
  }

  protected async verifyIdToken(idToken: string) {
    return await admin.auth().verifyIdToken(idToken);
  }
}
