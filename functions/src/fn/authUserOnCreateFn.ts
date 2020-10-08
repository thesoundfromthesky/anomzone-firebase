/*
 * Copyright 2020, Doug Stevenson
 *
 * Copying and distribution of this file, with or without modification, are
 * permitted in any medium without royalty, provided the copyright notice and
 * this notice are preserved. This file is offered as-is, without any warranty.
 */

import * as functions from 'firebase-functions';
import { Config, App } from '../app';

interface User {
  email?: string;
  displayName?: string;
  createdAt?: FieldValue;
  updatedAt: FieldValue;
  photoURL?: string;
  roles: { member: boolean };
  providers?: Provider;
}

interface Provider {
  [key: string]: {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    createdAt: FieldValue;
  };
}

interface AggregateUsersStats {
  currentAggregateUsersId: string;
  total: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export default async (
  userRecord: functions.auth.UserRecord,
  context: functions.EventContext,
  config: Config
) => {
  const callableFn = new CallableFn(userRecord, context, config);
  await callableFn.init();
  return callableFn.run();
};

class CallableFn extends App {
  private db!: Firestore;
  private user!: User;
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

  constructor(
    private readonly userRecord: UserRecord,
    private readonly context: functions.EventContext,
    protected readonly config: Config
  ) {
    super(config);
  }

  async init() {
    super.init();
    this.db = this.app.firestore();
    this.providerData = this.userRecord.providerData[0];
    this.providerId = this.providerData.providerId;

    this.isAnonymous();
    await this.initUser();
    await this.initAggregateUsers();
    this.initUsers();
    this.initBatch();
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
    const aggregateUsersStatsDoc = await this.aggregateUsersStatsRef.get();

    if (aggregateUsersStatsDoc.exists) {
      const data = aggregateUsersStatsDoc.data() as AggregateUsersStats;
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
      await this.aggregateUsersStatsRef.set({
        currentAggregateUsersId: this.aggregateUsersId,
        total: 0,
        ...this.getTimestamps(true),
      });
    }
    this.aggregateUsersRef = this.aggregateUsers.doc(this.aggregateUsersId);
  }

  private initUsers() {
    this.users = this.db.collection('users');
    this.usersRef = this.users.doc(this.userRecord.uid);
  }

  private initBatch() {
    this.batch = this.db.batch();
  }

  private setBatch() {
    this.batch.set(this.usersRef, {
      ...this.user,
      aggregates: [`aggregateUsers/${this.aggregateUsersId}`],
    });

    this.batch.set(
      this.aggregateUsersRef,
      {
        users: { [this.userRecord.uid]: this.user },
        ...this.getTimestamps(),
        total: this.getIncrement(),
      },
      { merge: true }
    );
  }

  private async commitBatch() {
    try {
      return await this.batch.commit();
    } catch (err) {
      if (err.message.includes('maximum')) {
        this.aggregateUsersId = this.aggregateUsers.doc().id;
        this.aggregateUsersRef = this.aggregateUsers.doc(this.aggregateUsersId);
        this.initBatch();
        this.setBatch();
        const batchResult = await this.batch.commit();
        await this.aggregateUsersStatsRef.set(
          { currentAggregateUsersId: this.aggregateUsersId },
          { merge: true }
        );
        return batchResult;
      } else {
        throw err;
      }
    }
  }

  private async runBatch() {
    this.setBatch();
    // Array.from({ length: 50 }, (v, i) => {
    //   this.batch.set(
    //     this.aggregateUsersRef,
    //     {
    //       [i]: {
    //         ...this.user,
    //         content:
    //           'adfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsafadfsafsdsaf',
    //       },
    //     },
    //     { merge: true }
    //   );
    // });
    const batchResult = await this.commitBatch();
    await this.setCustomClaims(this.userRecord.uid, { member: true });
    return batchResult;
  }

  run() {
    if (!this.app) {
      throw Error('Invoke init() first before invoking run()');
    }
    return this.runBatch();
  }
}
