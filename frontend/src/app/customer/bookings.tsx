import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Bike, Phone, Star, CheckCircle2 } from 'lucide-react';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';

export default function CustomerBookingsPage() {
  const { colors } = useAppTheme();
  const { bookings, showToast } = useAppState();
  const [billApproved, setBillApproved] = useState(false);

  return (
    <View style={styles.container}>
      {/* 1. LIVE MAP RADAR PREVIEW CARD (Matches 03_B2C_Map_Receipt.png) */}
      <View style={styles.mapContainer}>
        <View style={styles.agentMapPill}>
          <Bike size={18} color="#1D63ED" />
          <Text style={styles.agentMapPillText}>Agent Rahul (0.8 km)</Text>
        </View>
      </View>

      {/* 2. AGENT PROFILE CARD */}
      <View
        style={[
          styles.agentCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <View style={styles.agentAvatar}>
          <Text style={styles.agentAvatarText}>RS</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[styles.agentName, { color: colors.primaryText }]}>
            Agent Rahul S.
          </Text>
          <View style={styles.ratingRow}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>4.9 Verified Assistant</Text>
          </View>
        </View>
        <Pressable
          onPress={() => showToast('Simulated call connected to Agent Rahul S.')}
          style={styles.callCircle}
        >
          <Phone size={18} color="#1D63ED" />
        </Pressable>
      </View>

      {/* 3. STORE RECEIPT UPLOADED CARD */}
      <View style={styles.receiptCard}>
        <View style={styles.receiptHeader}>
          <Text style={styles.receiptHeading}>STORE RECEIPT UPLOADED</Text>
          <View style={styles.verifiedPill}>
            <Text style={styles.verifiedPillText}>Verified</Text>
          </View>
        </View>

        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Apollo Pharmacy Bill:</Text>
          <Text style={styles.billValue}>$34.50 (₹2,890)</Text>
        </View>

        <View style={[styles.billRow, styles.billDivider]}>
          <Text style={styles.billLabel}>Suvidha Service Fee:</Text>
          <Text style={styles.billZeroFee}>$0.00</Text>
        </View>

        <View style={styles.billRow}>
          <Text style={styles.totalLabel}>Total Charge:</Text>
          <Text style={styles.totalValue}>$34.50 (₹2,890)</Text>
        </View>

        <Pressable
          onPress={() => {
            setBillApproved(true);
            showToast('Store receipt approved & simulated settlement complete!');
          }}
          style={[
            styles.approveBtn,
            { backgroundColor: billApproved ? '#047857' : '#059669' },
          ]}
        >
          {billApproved ? <CheckCircle2 size={18} color="#FFFFFF" /> : null}
          <Text style={styles.approveBtnText}>
            {billApproved
              ? 'Receipt Approved & Paid ($34.50)'
              : 'Approve Bill & Pay $34.50'}
          </Text>
        </Pressable>
      </View>

      {/* 4. RECENT TASK HISTORY LIST */}
      <Text style={[styles.historyHeading, { color: colors.primaryText }]}>
        Task & Receipt Ledger ({bookings.length})
      </Text>
      {bookings.map((b) => (
        <View
          key={b.id}
          style={[
            styles.historyItem,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.primaryText, fontWeight: '700' }}>
            {b.serviceTitle} ({b.id})
          </Text>
          <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
            {b.pickupLocation} → {b.dropOrVenueLocation || 'Residence'}
          </Text>
          <Text style={{ color: colors.primaryAccent, fontSize: 12, fontWeight: '700' }}>
            Status: {b.status} • {b.preferredDate}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  mapContainer: {
    height: 190,
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  agentMapPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  agentMapPillText: {
    color: '#1D63ED',
    fontSize: 14,
    fontWeight: '800',
  },
  agentCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '800',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },
  callCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    gap: 10,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptHeading: {
    color: '#064E3B',
    fontSize: 14,
    fontWeight: '900',
  },
  verifiedPill: {
    backgroundColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  verifiedPillText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '800',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#A7F3D0',
    paddingBottom: 8,
  },
  billLabel: {
    color: '#374151',
    fontSize: 13,
  },
  billValue: {
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '700',
  },
  billZeroFee: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '800',
  },
  totalLabel: {
    color: '#064E3B',
    fontSize: 14,
    fontWeight: '800',
  },
  totalValue: {
    color: '#064E3B',
    fontSize: 15,
    fontWeight: '900',
  },
  approveBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  historyHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
  },
  historyItem: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
});