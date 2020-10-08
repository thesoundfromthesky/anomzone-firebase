export {};

declare global {
  type Dictionary<T> = { [key: string]: T; [key: number]: T };
  type Timestamp = firebase.firestore.Timestamp;
}
