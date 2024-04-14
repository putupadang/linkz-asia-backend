/* eslint-disable @typescript-eslint/no-var-requires */
import * as admin from 'firebase-admin';
import { config } from './firebase-initial.config';

const serviceAccount = require(config.firebase.serviceAccountKeyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebase.databaseURL,
});

export default admin;
