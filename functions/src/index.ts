import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
// https://medium.com/firebase-developers/organize-cloud-functions-for-max-cold-start-performance-and-readability-with-typescript-and-9261ee8450f0

export const authUserOnCreateFn = functions.auth
  .user()
  .onCreate(async (user, context) => {
    const config = functions.config().config.value;
    await (await import('./fn/authUserOnCreateFn')).default(
      user,
      context,
      config
    );
  });

export const callableFn = functions.https.onCall(async (data, context) => {
  const config = functions.config().config.value;
  return (await import('./fn/callableFn')).default(data, context, config);
});
