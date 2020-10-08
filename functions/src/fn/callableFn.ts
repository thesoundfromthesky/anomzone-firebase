/*
 * Copyright 2020, Doug Stevenson
 *
 * Copying and distribution of this file, with or without modification, are
 * permitted in any medium without royalty, provided the copyright notice and
 * this notice are preserved. This file is offered as-is, without any warranty.
 */

import * as functions from 'firebase-functions';
import { Config, App } from '../app';

export default async (
  data: any,
  context: functions.https.CallableContext,
  config: Config
) => {
  const callableFn = new CallableFn(data, context, config);
  await callableFn.init();
  return callableFn.run();
};

class CallableFn extends App {
  private db!: Firestore;
  private user: any;
  private token?: DecodedIdToken;
  private providerId?: string;
  private providerData!: UserInfo;
  private aggregateUsers!: CollectionReference;
  private aggregateUsersId!: string;
  private aggregateUsersRef!: DocumentReference;
  private aggregateUsersStatsRef!: DocumentReference;
  private users!: CollectionReference;
  private usersRef!: DocumentReference;
  private batch!: WriteBatch;
  private userRecord!: UserRecord;
  constructor(
    private readonly data: any,
    private readonly context: functions.https.CallableContext,
    protected readonly config: Config
  ) {
    super(config);
  }

  async init() {
    super.init();
    this.db = this.app.firestore();
    this.token = this.context?.auth?.token;
    this.userRecord = await this.getUser(this.token?.uid!);
    this.providerData = this.userRecord.providerData[0];
    this.providerId = this.providerData.providerId;

    this.isAnonymous();
    await this.initUser();
    await this.initAggregateUsers();
    this.initUsers();
  }

  private isAnonymous() {
    if (this.token?.provider_id === 'anonymous') {
      throw Error('Anonymous signin not allowed');
    }
  }

  private async initUser() {
    const { email, displayName, photoURL } = this.userRecord;

    this.user = {
      email,
      displayName,
      ...this.getTimestamps(true),
      photoURL,
      roles: { member: true },
      providers: {},
    };

    this.initProviders();
  }

  private initProviders() {
    if (this.providerId) {
      let providerName = this.providerId;
      if (this.providerId.includes('.')) {
        providerName = this.providerId.split('.')[0];
      }

      const { uid, email, displayName, photoURL } = this.providerData;
      this.user.providers = {
        [providerName]: {
          uid,
          email,
          displayName,
          photoURL,
          createdAt: this.getServerTimestamp(),
        },
      };
    }
  }

  private async initAggregateUsers() {
    this.aggregateUsers = this.db.collection('aggregateUsers');
    this.aggregateUsersStatsRef = this.aggregateUsers.doc('--stats--');
  }

  private initUsers() {
    this.users = this.db.collection('users');
    this.usersRef = this.users.doc(this.userRecord.uid);
  }

  private async getTransaction(transaction: FirebaseFirestore.Transaction) {
    const aggregateUsersStatsDoc = await transaction.get(
      this.aggregateUsersStatsRef
    );

    if (aggregateUsersStatsDoc.exists) {
      const data = aggregateUsersStatsDoc.data();
      if (data) {
        if (data.currentAggregateUsersId) {
          this.aggregateUsersId = data.currentAggregateUsersId;
        } else {
          throw Error('currentAggregateUsersId undefined');
        }
      }
    } else {
      this.isAggregateNew = true;
      this.aggregateUsersId = this.aggregateUsers.doc().id;
      transaction.set(this.aggregateUsersStatsRef, {
        currentAggregateUsersId: this.aggregateUsersId,
        ...this.getTimestamps(true),
      });
    }
    this.aggregateUsersRef = this.aggregateUsers.doc(this.aggregateUsersId);
  }

  private setTransaction(transaction: FirebaseFirestore.Transaction) {
    transaction.set(this.usersRef, {
      ...this.user,
      aggregates: [`aggregateUsers/${this.aggregateUsersId}`],
    });

    transaction.set(
      this.aggregateUsersRef,
      {
        users: { [this.userRecord.uid]: this.user },
        ...this.getTimestamps(),
      },
      { merge: true }
    );
  }

  private async runTransaction() {
    try {
      await this.db.runTransaction(async (transaction) => {
        await this.getTransaction(transaction);
        Array.from({ length: 120 }, (v, i) => {
          transaction.set(
            this.aggregateUsersRef,
            {
              [i]: {
                ...this.user,
                content:
                  'adfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsaf',
              },
            },
            { merge: true }
          );
        });
        this.setTransaction(transaction);
      });
    } catch (err) {
      if (err.message.includes('maximum')) {
        this.db.runTransaction(async (transaction) => {
          const aggregateUsersStatsDoc = await transaction.get(
            this.aggregateUsersStatsRef
          );
          if (aggregateUsersStatsDoc.exists) {
            const data = aggregateUsersStatsDoc.data();
            if (data) {
              this.aggregateUsersId = this.aggregateUsers.doc().id;

              transaction.set(
                this.aggregateUsersStatsRef,
                {
                  currentAggregateUsersId: this.aggregateUsersId,
                  ...this.getTimestamps(),
                },
                { merge: true }
              );
              this.aggregateUsersId = data.currentAggregateUsersId;

              this.aggregateUsersRef = this.aggregateUsers.doc(
                this.aggregateUsersId
              );
            }
          } else {
            throw Error('AggregateUsersStatesDoc Not Found');
          }

          this.setTransaction(transaction);
        });
      } else {
        throw err;
      }
    }
  }
  run() {
    if (!this.app) {
      throw Error('Invoke init() first before invoking run()');
    }
    return this.runTransaction().then(() => {
      return this.setCustomClaims(this.userRecord.uid, { member: true });
    });
  }
}
