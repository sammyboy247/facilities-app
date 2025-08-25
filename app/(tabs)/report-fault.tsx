// app/report-fault.tsx
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { db } from '@/services/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
type Priority = typeof PRIORITIES[number];

export default function ReportFault() {
  const params = useLocalSearchParams<{ assetId?: string; locationCode?: string; raw?: string }>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Low');
  const [locationCode, setLocationCode] = useState('');
  const [assetId, setAssetId] = useState<string | null>(null);

  useEffect(() => {
    if (params.assetId && typeof params.assetId === 'string') {
      setAssetId(params.assetId);
      setTitle(prev => prev || `Issue with asset ${params.assetId}`);
    }
    if (params.locationCode && typeof params.locationCode === 'string') {
      setLocationCode(params.locationCode);
      setTitle(prev => prev || `Issue at ${params.locationCode}`);
    }
    if (params.raw && typeof params.raw === 'string') {
      setDescription(prev => prev || `Scanned code: ${params.raw}`);
    }
  }, [params.assetId, params.locationCode, params.raw]);

  const submit = async () => {
    try {
      if (!title.trim()) {
        Alert.alert('Missing title', 'Please enter a short title for the fault.');
        return;
      }
      const docRef = await addDoc(collection(db, 'tickets'), {
        title: title.trim(),
        description: description.trim(),
        priority,
        locationCode: locationCode.trim() || null,
        assetId: assetId || null,
        status: 'First Report',
        reporter: 'Placeholder',
        createdAt: serverTimestamp()
      });
      router.replace(`/ticket/${docRef.id}`);
    } catch (e: any) {
      console.log('[report-fault] error:', e);
      Alert.alert('Error', e?.message ?? 'Failed to create ticket');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Report a Fault</Text>

      {assetId && (
        <View style={{ padding: 8, borderWidth: 1, borderRadius: 8 }}>
          <Text style={{ fontWeight: '600' }}>Asset:</Text>
          <Text>{assetId}</Text>
        </View>
      )}

      <Text>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Illuminated exit sign fallen"
        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
      />

      <Text>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Add details that help triage"
        multiline
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, minHeight: 90 }}
      />

      <Text>Priority</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {PRIORITIES.map(p => (
          <Text
            key={p}
            onPress={() => setPriority(p)}
            style={{
              paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1,
              backgroundColor: priority === p ? '#e5f0ff' : 'transparent'
            }}>
            {p}
          </Text>
        ))}
      </View>

      <Text>Location code (optional)</Text>
      <TextInput
        value={locationCode}
        onChangeText={setLocationCode}
        placeholder="e.g. TVCR-Plym-GF-Main"
        style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
      />

      <Button title="Submit" onPress={submit} />
    </View>
  );
}
