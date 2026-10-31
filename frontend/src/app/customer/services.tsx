import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, Hospital } from 'lucide-react';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { DEMO_SERVICES } from '@/mocks/services';

export default function CustomerServiceBookingPage() {
  const { colors } = useAppTheme();
  const { addCustomerBooking } = useAppState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const serviceId = searchParams.get('serviceId');

  const [selectedServiceId, setSelectedServiceId] = useState(
    serviceId || 'srv-medical-escort'
  );

  const [pickupLocation, setPickupLocation] = useState(
    'Apollo Pharmacy, Sector 14'
  );
  const [dropLocation, setDropLocation] = useState('42 Elm Street, Block C');
  const [instructions, setInstructions] = useState(
    'Wheelchair assistance required at hospital entry.'
  );
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { id: 'srv-medical-escort', label: 'Medical & Hospital Escort' },
    { id: 'srv-banking-shopping', label: 'Banking & Grocery Escort' },
    { id: 'srv-local-errands', label: 'Pick & Drop Errand' },
    { id: 'srv-tourist-guidance', label: 'City & Transit Guide' },
  ];

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const matched =
        DEMO_SERVICES.find((s) => s.id === selectedServiceId) || DEMO_SERVICES[0];
      await addCustomerBooking({
        serviceId: matched.id,
        preferredDate: '2026-10-16',
        preferredTime: 'Immediate Dispatch',
        pickupLocation,
        dropOrVenueLocation: dropLocation,
        instructions,
      });
      navigate('/customer/bookings');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Row matching 02_B2C_Personal_Booking.png */}
      <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.primaryText} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.primaryText }]}>
          Request Personal Escort
        </Text>
      </View>

      {/* CATEGORY */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>
          CATEGORY
        </Text>
        <View style={styles.categoryWrap}>
          {categories.map((cat) => {
            const active = selectedServiceId === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedServiceId(cat.id)}
                style={[
                  styles.categoryBox,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: active ? '#1D63ED' : colors.border,
                  },
                ]}
              >
                <Hospital
                  size={16}
                  color={active ? '#1D63ED' : colors.secondaryText}
                />
                <Text
                  style={{
                    color: active ? colors.primaryText : colors.secondaryText,
                    fontWeight: active ? '800' : '600',
                    fontSize: 13,
                  }}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* PICKUP LOCATION */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>
          PICKUP LOCATION
        </Text>
        <View
          style={[
            styles.iconInputRow,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <MapPin size={18} color="#EF4444" />
          <TextInput
            value={pickupLocation}
            onChangeText={setPickupLocation}
            style={[styles.textInput, { color: colors.primaryText }]}
            placeholder="Enter Pickup Location"
            placeholderTextColor={colors.secondaryText}
          />
        </View>
      </View>

      {/* DROP LOCATION */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>
          DROP LOCATION
        </Text>
        <View
          style={[
            styles.iconInputRow,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Home size={18} color="#2563EB" />
          <TextInput
            value={dropLocation}
            onChangeText={setDropLocation}
            style={[styles.textInput, { color: colors.primaryText }]}
            placeholder="Enter Drop Location"
            placeholderTextColor={colors.secondaryText}
          />
        </View>
      </View>

      {/* INSTRUCTIONS FOR ASSISTANT */}
      <View style={styles.fieldGroup}>
        <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>
          INSTRUCTIONS FOR ASSISTANT
        </Text>
        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          multiline
          style={[
            styles.instructionsBox,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              color: colors.primaryText,
            },
          ]}
          placeholder="Add voice note transcript or special instructions..."
          placeholderTextColor={colors.secondaryText}
        />
      </View>

      {/* ZERO-FEE SUBSCRIBER INDICATOR BOX */}
      <View style={styles.subscriberFeeCard}>
        <View style={styles.feeTopRow}>
          <Text style={styles.feeTitle}>Platform Service Fee</Text>
          <Text style={styles.feeAmount}>₹0.00 / $0.00 (Subscriber)</Text>
        </View>
        <Text style={styles.feeSubtext}>
          You pay only the exact store item costs uploaded via receipt.
        </Text>
      </View>

      {/* CONFIRM CTA */}
      <Pressable
        onPress={handleConfirm}
        disabled={submitting}
        style={styles.confirmBtn}
      >
        <Text style={styles.confirmBtnText}>
          {submitting ? 'Requesting Assistant...' : 'Confirm & Request Assistant'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  categoryWrap: {
    gap: 8,
  },
  categoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  iconInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  instructionsBox: {
    minHeight: 88,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  subscriberFeeCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  feeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeTitle: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '800',
  },
  feeAmount: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '800',
  },
  feeSubtext: {
    color: '#2563EB',
    fontSize: 12,
  },
  confirmBtn: {
    backgroundColor: '#1D63ED',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});