// app/(tabs)/two.tsx
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { db } from '@/services/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export default function TwoScreen() {
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'assets'), limit(1)));
        console.log('[firebase] connected, assets sample size:', snap.size);
      } catch (e) {
        console.log('[firebase] error:', e);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Two</Text>
      <Text>Check Metro logs for the Firestore sanity message.</Text>
    </View>
  );
}
