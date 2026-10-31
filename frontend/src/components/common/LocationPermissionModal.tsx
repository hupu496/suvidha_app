import React, { useState } from 'react';
import { Modal, View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { MapPin, Navigation, ShieldCheck } from 'lucide-react';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';

/**
 * Industry-style (Rapido / Blinkit / Swiggy) Location Permission Bottom Sheet / Modal.
 * Appears automatically after login when locationPermission === 'prompt'.
 */
export const LocationPermissionModal: React.FC = () => {
  const { colors } = useAppTheme();
  const { locationPermission, setLocationPermission } = useAppState();
  const [manualMode, setManualMode] = useState(false);
  const [customAddress, setCustomAddress] = useState('42 Elm Street, Block C');

  const visible = locationPermission === 'prompt';

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Top Radar Pin Icon */}
          <View style={[styles.pinCircle, { backgroundColor: colors.badgeBg }]}>
            <MapPin size={32} color={colors.primaryAccent} />
          </View>

          <Text style={[styles.title, { color: colors.primaryText }]}>
            Enable Location Services
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            SUBIDHA uses your live location to assign the nearest verified assistant (0.8 km radius), calculate exact pickup ETA, and enable 1-tap Emergency SOS dispatch.
          </Text>

          {/* Feature bullets like Blinkit / Rapido */}
          <View
            style={[
              styles.infoBox,
              { backgroundColor: colors.secondaryBackground, borderColor: colors.border },
            ]}
          >
            <View style={styles.bulletRow}>
              <Navigation size={16} color={colors.primaryAccent} />
              <Text style={[styles.bulletText, { color: colors.primaryText }]}>
                Instant doorstep pickup & live rider radar tracking
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <ShieldCheck size={16} color={colors.primaryAccent} />
              <Text style={[styles.bulletText, { color: colors.primaryText }]}>
                Automatic GPS coordinates shared during SOS alerts
              </Text>
            </View>
          </View>

          {manualMode ? (
            <View style={styles.manualWrapper}>
              <Text style={[styles.manualLabel, { color: colors.primaryText }]}>
                Enter Pickup / Hub Address Manually
              </Text>
              <TextInput
                value={customAddress}
                onChangeText={setCustomAddress}
                placeholder="e.g., 42 Elm Street, Block C"
                placeholderTextColor={colors.secondaryText}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.primaryText,
                  },
                ]}
              />
              <Pressable
                onPress={() =>
                  setLocationPermission(
                    'granted',
                    customAddress.trim() || '42 Elm Street, Block C'
                  )
                }
                style={[styles.allowBtn, { backgroundColor: colors.primaryAccent }]}
              >
                <Text
                  style={[styles.allowBtnText, { color: colors.buttonTextOnAccent }]}
                >
                  Confirm Manual Location
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.buttonStack}>
              <Pressable
                onPress={() => setLocationPermission('granted')}
                style={[styles.allowBtn, { backgroundColor: colors.primaryAccent }]}
              >
                <Navigation size={17} color={colors.buttonTextOnAccent} />
                <Text
                  style={[styles.allowBtnText, { color: colors.buttonTextOnAccent }]}
                >
                  Allow While Using App (Recommended)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setManualMode(true)}
                style={[
                  styles.manualBtn,
                  {
                    backgroundColor: colors.secondaryBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.manualBtnText, { color: colors.primaryText }]}>
                  Select Location Manually
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  pinCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  infoBox: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    marginVertical: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bulletText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  buttonStack: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
  allowBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  allowBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
  manualBtn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  manualWrapper: {
    width: '100%',
    gap: 10,
  },
  manualLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
});