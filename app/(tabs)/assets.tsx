import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { db } from '@/services/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

type Asset = { id: string; name?: string; category?: string; location?: string };

export default function AssetsScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'assets'), orderBy('name'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setAssets(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
        setLoading(false);
      },
      (err) => {
        console.log('[assets] error:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading assets…</Text>
      </View>
    );
  }

  if (assets.length === 0) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Assets</Text>
        <Text>No assets yet.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Assets</Text>
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, backgroundColor: '#f4f6f8', borderRadius: 12, marginBottom: 8 }}>
            <Text style={{ fontWeight: '600' }}>{item.name || '(no name)'}</Text>
            <Text>{item.category || '—'} • {item.location || '—'}</Text>
            <Text style={{ opacity: 0.6 }}>ID: {item.id}</Text>
          </View>
        )}
      />
    </View>
  );
}
