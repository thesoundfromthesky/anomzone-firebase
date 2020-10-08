import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
  QueryFn,
  DocumentData,
  DocumentSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import 'firebase/firestore';
import { HttpErrorResponse } from '@angular/common/http';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;
type Doc = DocumentSnapshot<DocumentData>;
export type DocMap = {
  id: string;
  path: string;
  doc: () =>
    Doc;
};

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  getTimestamp() {
    return firestore.FieldValue.serverTimestamp() as Timestamp;
  }

  increment(step: number = 1) {
    return firestore.FieldValue.increment(step);
  }

  getIdField(idField?: string) {
    return idField ? { idField } : {};
  }

  constructor(private readonly afs: AngularFirestore) { }

  col<T>(
    ref: CollectionPredicate<T>,
    queryFn?: QueryFn
  ): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  docSet<T>(ref: DocPredicate<T>, data: T): Promise<void> {
    return this.doc(ref).set(data, { merge: true });
  }

  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          return doc.payload.data() as T;
        })
      );
  }
  docGet$<T extends DocMap>(ref: DocPredicate<T>): Observable<T> | never {
    return this.doc(ref)
      .get()
      .pipe(
        map((doc) => {
          if (doc.exists) {
            return {
              ...doc.data(),
              id: doc.id,
              path: doc.ref.path,
              doc: () => doc,
            } as T;
          }
          throw new HttpErrorResponse({
            error: Error(),
            status: 404,
            statusText: 'Not Found',
          });
        })
      );
  }

  docValueChanges$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref).valueChanges() as Observable<T>;
  }

  colAdd<T>(ref: CollectionPredicate<T>, data: T) {
    return this.col(ref).add(data);
  }

  colGet$<T extends DocMap>(ref: CollectionPredicate<T>, queryFn?: QueryFn): Observable<T[]> {
    return this.col(ref, queryFn)
      .get()
      .pipe(
        map((docData) => {
          return docData.docs.map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
                path: doc.ref.path,
                doc: () => doc,
              } as T)
          );
        })
      );
  }

  colValueChanges$<T>(
    ref: CollectionPredicate<T>,
    queryFn?: QueryFn,
    idField?: string
  ): Observable<T[]> {
    return this.col(ref, queryFn).valueChanges(this.getIdField(idField));
  }

  colSnapshotChanges$<T>(
    ref: CollectionPredicate<T>,
    queryFn?: QueryFn
  ): Observable<T[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((docs) => {
          return docs.map((doc) => ({
            ...doc.payload.doc.data(),
            id: doc.payload.doc.id,
            path: doc.payload.doc.ref.path,
            doc: doc.payload.doc,
          })) as T[];
        })
      );
  }
}
