// services/firebase.ts
import Constants from 'expo-constants';
import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

type Extra = {
  firebase?: FirebaseOptions;
};

// Expo (new) uses expoConfig; older uses manifest — support both:
const extra = (Constants.expoConfig?.extra as Extra) ?? (Constants.manifest?.extra as Extra);
const cfg = extra?.firebase;

if (!cfg?.projectId) {
  console.warn('[firebase] Missing config. Check app.config.ts and your .env values.');
}

const app = initializeApp(cfg as FirebaseOptions);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
