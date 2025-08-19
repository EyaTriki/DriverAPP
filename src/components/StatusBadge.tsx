import React from 'react';
import { View, Text } from 'react-native';
import { TickCircle, Clock, CloseCircle } from 'iconsax-react-native';

type Props = { status: 'approved' | 'pending' | 'rejected' };

const map = {
    approved: { bg: 'bg-green-500/10', color: '#16a34a', label: 'Approved' },
    pending: { bg: 'bg-yellow-500/10', color: '#CA8A04', label: 'Pending' },
    rejected: { bg: 'bg-red-500/10', color: '#DC2626', label: 'Rejected' },
};

const StatusBadge: React.FC<Props> = ({ status }) => {
    const cfg = map[status];
    const Icon =
        status === 'approved' ? TickCircle : status === 'pending' ? Clock : CloseCircle;

    return (
        <View className={`flex-row items-center gap-2 px-3 py-1.5 rounded-full ${cfg.bg}`}>
            <Icon size={18} color={cfg.color} variant="Bold" />
            <Text style={{ color: cfg.color }} className="font-medium">{cfg.label}</Text>
        </View>
    );
};

export default StatusBadge;
