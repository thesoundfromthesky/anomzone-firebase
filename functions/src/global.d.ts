import * as admin from 'firebase-admin';

declare global {
  type Timestamp = admin.firestore.Timestamp;
  type FieldValue = admin.firestore.FieldValue
  type DecodedIdToken = admin.auth.DecodedIdToken;
  type Dictionary = { [key: string]: any };
  type CollectionReference = FirebaseFirestore.CollectionReference<
    FirebaseFirestore.DocumentData
  >;
  type DocumentReference = FirebaseFirestore.DocumentReference<
    FirebaseFirestore.DocumentData
  >;
  type Firestore = FirebaseFirestore.Firestore;
  type WriteBatch = FirebaseFirestore.WriteBatch;
  type UserRecord = admin.auth.UserRecord;
  type UserInfo = admin.auth.UserInfo;
}
