import {
  setup,
  teardown,
  Firestore,
  CollectionReference,
  serverTimestamp,
} from './helper';

interface Post {
  title: string;
  content: string;
  author: string;
  views: number;
  isDeleted: boolean;
  timestamp: Date;
}

describe('Database rules for posts collection', () => {
  let db: Firestore;
  let dbWithAuth: Firestore;
  let dbWithOtherAuth: Firestore;
  let ref: CollectionReference;
  let refWithAuth: CollectionReference;
  let refWithOtherAuth: CollectionReference;
  let docId: string;
  let uid: string;
  let email: string;
  beforeAll(async () => {
    uid = 'tester';
    email = `'auth@email.com'`;

    // Instance without auth.
    db = await setup();
    ref = db.collection('posts');

    // Instance with auth
    dbWithAuth = await setup({ uid, email });
    refWithAuth = dbWithAuth.collection('posts');

    // Instance with other auth
    dbWithOtherAuth = await setup({
      uid: 'other_test',
      email: 'other_auth@mail.com',
    });
    refWithOtherAuth = dbWithOtherAuth.collection('posts');

    docId = refWithAuth.doc().id;
  });

  afterAll(async () => {
    await teardown();
  });

  it('fail when creating without signIn', async () => {
    await expect(ref.add({})).toDeny();
  });

  it('success when creating with signIn', async () => {
    await expect(
      refWithAuth.doc(docId).set({
        title: 'helloaaaa',
        content: 'helalaal',
        userId: uid,
        isDeleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    ).toAllow();
  });

  it('fail when updating without signIn', async () => {
    await expect(
      ref.doc(docId).set({ test: 'changed', createdAt: serverTimestamp() })
    ).toDeny();
  });

  it('fail when updating with other auth', async () => {
    await expect(
      refWithOtherAuth
        .doc(docId)
        .set({ test: 'changed', createdAt: serverTimestamp() })
    ).toDeny();
  });

  it('success when updating with signIn', async () => {
    await expect(
      refWithAuth.doc(docId).set(
        {
          content: 'xzvzxvc',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    ).toAllow();
  });

  it('fail when reading without signIn', async () => {
    await expect(
      ref.get()
    ).toDeny();
  });

  it('fail when reading with signIn and no query', async () => {
    await expect(
      refWithAuth.get()
    ).toDeny();
  });

  it('fail when reading with signIn and isDeleted == true', async () => {
    await expect(
      refWithAuth.where("isDeleted", "==", true).get()
    ).toDeny();
  });
  
  it('fail when reading with sign and limit exceeds', async () => {
    await expect(
      refWithAuth.where("isDeleted", "==", false).limit(21).get()
    ).toDeny();
  });

  it('fail when reading with sign and without limit', async () => {
    await expect(
      refWithAuth.where("isDeleted", "==", false).get()
    ).toDeny();
  });

  it('success when reading with signIn and isDeleted == false', async () => {
    await expect(
      refWithAuth.where("isDeleted", "==", false).limit(20).get()
    ).toAllow();
  });

  it('fail when reading --stats-- without signIn', async () => {
    await expect(
      ref.doc("--stats--").get()
    ).toDeny();
  });

  it('success when reading --stats-- with signIn', async () => {
    await expect(
      refWithAuth.doc("--stats--").get()
    ).toAllow();
  });

  it('fail when deleting', async () => {
    await expect(
      refWithAuth.doc(docId).delete()
    ).toDeny();
  });
});
