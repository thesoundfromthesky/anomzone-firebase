import * as firebase from 'firebase/app';
import * as emu from '@firebase/rules-unit-testing';
import * as admin from 'firebase-admin';
import * as credentialsStaging from '../../credentials/credentials-staging.json';
import * as credentialsProd from '../../credentials/credentials-prod.json';
import { program } from 'commander';
import { migrate } from './migrate';

program
  .version('0.0.1')
  .requiredOption('-c, --config <type>', 'Set environment mode')
  .parse(process.argv);

export const enum Config {
  Emu = 'emu',
  Staging = 'staging',
  Prod = 'prod',
}

type LookupTableReturnType = firebase.app.App | admin.app.App;

function getLookupTable(select: Config): LookupTableReturnType {
  const lookupTable = {
    [Config.Emu]: () => {
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      return emu.initializeAdminApp({ projectId: 'anomzone-staging' });
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

const config = program.config as Config;

if (!config) {
  throw Error('Set config environment variable');
}

const app = getLookupTable(config);

const db = app.firestore();
migrate(db, config);
