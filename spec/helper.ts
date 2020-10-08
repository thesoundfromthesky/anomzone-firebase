import * as firebase from '@firebase/testing';
import * as fs from 'fs';

export type Firestore = firebase.firestore.Firestore;
export type DocumentData = firebase.firestore.DocumentData;
export type CollectionReference = firebase.firestore.CollectionReference<
  DocumentData
>;
export type QuerySnapshot = firebase.firestore.QuerySnapshot<DocumentData>;

// How to test Firestore
// https://fireship.io/lessons/testing-firestore-security-rules-with-the-emulator/
// How to create custom matcher for Angular Jasmine
// https://medium.com/bb-tutorials-and-thoughts/angular-how-to-add-jasmine-custom-matchers-in-unit-testing-3edd40f567ec

export async function setup(
  auth?: { uid: string; email: string },
  data?: { [key: string]: DocumentData }
): Promise<Firestore> {
  const projectId = 'bulletin-board-398ae';
  const app = await firebase.initializeTestApp({ projectId, auth });
  const db = app.firestore();

  if (data) {
    for (const key in data) {
      const ref = db.doc(key);
      await ref.set(data[key]);
    }
  }

  await firebase.loadFirestoreRules({
    projectId,
    rules: fs.readFileSync('firestore.rules', 'utf8'),
  });

  return db;
}

export async function teardown() {
  Promise.all(firebase.apps().map((app) => app.delete()));
}

export function serverTimestamp() {
  return firebase.firestore.FieldValue.serverTimestamp();
}

expect.extend({
  async toAllow(snapshot: Promise<QuerySnapshot>) {
    let pass = false;
    try {
      await firebase.assertSucceeds(snapshot);
      pass = true;
    } catch (err) {
      console.error(err);
    }

    return {
      pass,
      message: () =>
        'Expected Firebase operation to be allowed, but it failed.',
    };
  },
});

expect.extend({
  async toDeny(snapshot: Promise<QuerySnapshot>) {
    let pass = false;
    try {
      await firebase.assertFails(snapshot);
      pass = true;
    } catch (err) {
      console.error(err);
    }

    return {
      pass,
      message: () =>
        'Expected Firebase operation to be denied, but it was allowed.',
    };
  },
});
