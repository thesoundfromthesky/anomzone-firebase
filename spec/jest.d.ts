declare namespace jest {
  interface Matchers<R> {
    toAllow(snapshot?: R): CustomMatcherResult;
    toDeny(snapshot?: R): CustomMatcherResult;
  }
}
