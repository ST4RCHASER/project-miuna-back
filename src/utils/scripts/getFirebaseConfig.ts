import firebase from 'firebase-admin';
export const getFirebaseConfig = (): object => {
    let account = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '');
    return {
        credential: firebase.credential.cert(account),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    }
}