import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import HeaderGreeting from '../components/HeaderGreeting';
import SegmentTabs, { TabKey } from '../components/SegmentTabs';
import Button from '../components/Button';
import TippingCard, { TippingItem } from '../components/TippingCard';
import RequestTipModal from '../components/RequestTipModal';

const TABS = [
  { key: 'approved' as const, label: 'Approved' },
  { key: 'pending' as const, label: 'Pending' },
  { key: 'rejected' as const, label: 'Rejected' },
  { key: 'all' as const, label: 'All' },
];

const MOCK: TippingItem[] = [
  {
    id: '1',
    status: 'approved',
    requestLabel: 'Request : August 19, 2025 – 19:20 PM',
    approvedOn: 'Approved on July 19, 2025',
    subline: 'Shipped',
    proofUploaded: true,
  },
  {
    id: '2',
    status: 'approved',
    requestLabel: 'Request : August 19, 2025 – 19:20 PM',
    approvedOn: 'Approved on July 19, 2025',
    subline: 'Shipped',
    proofUploaded: true,
  },
  {
    id: '3',
    status: 'pending',
    requestLabel: 'Request : August 20, 2025 – 10:05 AM',
    subline: 'Awaiting confirmation',
    proofUploaded: false,
  },
];

const TippingScreen: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('approved');
  const data = useMemo(() => {
    if (tab === 'all') return MOCK;
    return MOCK.filter(it => it.status === tab);
  }, [tab]);
  const [showModal, setShowModal] = useState(false);
  return (
    <ScrollView className="flex-1 bg-backgroundScreen" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="p-5">
        {/* Header */}
        <HeaderGreeting
          name="John Doe"
          subtitle="Hello, Welcome 👋"
          onBellPress={() => { }}
        />

        {/* Title */}
        <Text className="text-xl font-poppins-semibold mt-6">Tipping Request</Text>

        {/* Tabs */}
        <SegmentTabs value={tab} onChange={setTab} items={TABS} />

        {/* CTA */}
        <Button
          title="Add New Request"
          onPress={() => setShowModal(true)}
          variant="black"
          className="rounded-[10px] px-4  py-[10px] mt-5 self-end"   // 16 / 10 / radius 10
          textClassName="text-white font-poppins-semibold text-base"                            // ✅ white text
        />


        {/* List */}
        <View className="mt-5">
          {data.map(item => (
            <TippingCard
              key={item.id}
              item={{
                ...item,
                onPressProof: () => {
                  // handle open proof
                },
              }}
            />
          ))}
        </View>
      </View>
      <RequestTipModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={(note) => {
          // handle submission here
          // e.g. call API with { note }
          setShowModal(false);
        }}
      />
    </ScrollView>
  );
};

export default TippingScreen;
