import * as fs from 'fs-extra';
import * as admin from 'firebase-admin';
import { Post } from './generate';
import { Config } from './main';

type Firestore = firebase.firestore.Firestore | FirebaseFirestore.Firestore;

export async function migrate(db: Firestore, config: Config): Promise<void> {
  try {
    const data: Post[] = await fs.readJson('./mocks/posts.json');

    const colRef = db.collection('rootPosts/mercury/posts');
    const batch = db.batch();
    data.forEach(({ title, content }) => {
      const id = colRef.doc().id;
      const docRef = colRef.doc(id);

      const item = {
        title,
        content,
        isDeleted: false,
        userId: 'sample',
        createdAt: getServerTimestamp(),
        updatedAt: getServerTimestamp(),
      };

      (batch as any).set(docRef, item);
    });

    await batch.commit();
    console.log('Firestore updated. Migration was a success!');
  } catch (err) {
    console.error(err);
  }

  function getServerTimestamp() {
    return admin.firestore.FieldValue.serverTimestamp();
  }
}
