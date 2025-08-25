import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { db } from '@/services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

type Ticket = {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  locationCode?: string | null;
  reporter?: string;
  createdAt?: any;
};

export default function TicketDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'tickets', String(id)), (snap) => {
      setTicket((snap.exists() ? (snap.data() as Ticket) : null));
      setLoading(false);
    }, (err) => {
      console.log('[ticket] error:', err);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
      <Text style={{ marginTop: 8 }}>Loading ticket…</Text>
    </View>;
  }

  if (!ticket) {
    return <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Ticket</Text>
      <Text style={{ marginTop: 12 }}>Not found.</Text>
    </View>;
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 6 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>{ticket.title}</Text>
      <Text>{ticket.description}</Text>
      <Text>Priority: {ticket.priority}</Text>
      <Text>Status: {ticket.status}</Text>
      <Text>Location: {ticket.locationCode || '—'}</Text>
      <Text>Reporter: {ticket.reporter || '—'}</Text>
    </View>
  );
}
