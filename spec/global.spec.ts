import { setup, teardown, Firestore, CollectionReference } from './helper';

describe('Database global rules', () => {
  let db: Firestore;
  let ref: CollectionReference;

  beforeAll(async () => {
    db = await setup();
    ref = db.collection('testing-collection');
  });

  afterAll(async () => {
    await teardown();
  });

  it('fail when read/writing an unauthorized collection', async () => {
    await expect(ref.get()).toDeny();
    await expect(ref.add({})).toDeny();
  });
});
