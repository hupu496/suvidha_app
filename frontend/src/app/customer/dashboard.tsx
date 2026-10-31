import React, { useState } from 'react';
import { ROUTES } from '@/routes';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  UserCheck,
  Package,
  Settings,
  Compass,
  ArrowRight,
  HeartHandshake,
  ShoppingBag,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { ModalDialog } from '@/components/common/ModalDialog';

export default function CustomerDashboardPage() {
  const { colors } = useAppTheme();
  const { user, showToast } = useAppState();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const navigate = useNavigate();
  const [sosModalOpen, setSosModalOpen] = useState(false);

  if (!user || user.role !== 'customer') return null;

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Wide Desktop Promo Banners (like Blinkit image_60580f.jpg)
  const desktopPromoBanners = [
    {
      title: 'Medical Escort at your doorstep!',
      sub: 'Hospital checkups, lab reports & pharmacy runs',
      bg: '#CCFBF1',
      titleColor: '#0F766E',
      btnBg: '#0F766E',
      serviceId: 'srv-medical-escort',
    },
    {
      title: 'Daily Errands & Pick-Drop',
      sub: 'Groceries, forgotten keys, bank passbook & parcels',
      bg: '#FEF3C7',
      titleColor: '#92400E',
      btnBg: '#92400E',
      serviceId: 'srv-local-errands',
    },
    {
      title: 'Need a Local City Companion?',
      sub: 'Railway, airport transit & senior citizen escort',
      bg: '#E0E7FF',
      titleColor: '#1E40AF',
      btnBg: '#1E40AF',
      serviceId: 'srv-tourist-guidance',
    },
  ];

  // Category Grid Tiles (4 per row on Desktop, 2x2 on Mobile)
  const essentialServicesGrid = [
    {
      id: 'srv-medical-escort',
      title: 'Personal Escort',
      subtitle: 'Hospital, Bank, Guide',
      cta: 'Book',
      tileBg: '#EFF6FF',
      icon: <UserCheck size={28} color="#1D63ED" />,
    },
    {
      id: 'srv-local-errands',
      title: 'Pick & Drop',
      subtitle: 'Groceries, Medicine',
      cta: 'Order',
      tileBg: '#ECFDF5',
      icon: <Package size={28} color="#059669" />,
    },
    {
      id: 'srv-personal-assistance',
      title: 'Handyman Assist',
      subtitle: 'Appliance Escort',
      cta: 'Schedule',
      tileBg: '#FEF3C7',
      icon: <Settings size={28} color="#D97706" />,
    },
    {
      id: 'srv-tourist-guidance',
      title: 'Transit Support',
      subtitle: 'Railway & Airport',
      cta: 'Book',
      tileBg: '#F3E8FF',
      icon: <Compass size={28} color="#7C3AED" />,
    },
    {
      id: 'srv-banking-shopping',
      title: 'Banking & Post',
      subtitle: 'Passbook & Life Cert',
      cta: 'Book',
      tileBg: '#FCE7F3',
      icon: <ShoppingBag size={28} color="#DB2777" />,
    },
    {
      id: 'srv-medical-escort-2',
      title: 'Pharmacy Run',
      subtitle: 'Prescription Pickup',
      cta: 'Order',
      tileBg: '#E0F2FE',
      icon: <HeartHandshake size={28} color="#0284C7" />,
    },
    {
      id: 'srv-personal-assistance-2',
      title: 'Elder Check-In',
      subtitle: 'Verified Home Visit',
      cta: 'Schedule',
      tileBg: '#DCFCE7',
      icon: <ShieldCheck size={28} color="#15803D" />,
    },
    {
      id: 'srv-download-app',
      title: 'SUBIDHA Mobile App',
      subtitle: 'Live GPS & SOS Radar',
      cta: 'Download',
      tileBg: '#F1F5F9',
      icon: <Smartphone size={28} color="#0F172A" />,
    },
  ];

  // Show all 8 tiles on wide desktop, or the primary 4 (2x2) on compact mobile
  const visibleCards = isDesktop
    ? essentialServicesGrid
    : essentialServicesGrid.slice(0, 4);

  return (
    <View style={styles.container}>
      {/* 1. TOP GREETING + EMERGENCY SOS ROW (Side-by-side on Desktop, Stacked on Mobile) */}
      <View
        style={[
          styles.topRowGrid,
          { flexDirection: isDesktop ? 'row' : 'column' },
        ]}
      >
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              flex: isDesktop ? 1 : undefined,
            },
          ]}
        >
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={[styles.greetingText, { color: colors.primaryText }]}>
              Hello, {user.fullName}
            </Text>
            <View style={styles.seniorPassPill}>
              <Text style={styles.seniorPassText}>SENIOR PASS ACTIVE • ₹0 FEE</Text>
            </View>
          </View>

          <Pressable
            onPress={() => navigate(ROUTES.customer.profile)}
            style={styles.avatarCircle}
          >
            <Text style={styles.avatarInitials}>{initials}</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setSosModalOpen(true)}
          style={[styles.sosBanner, { flex: isDesktop ? 1.15 : undefined }]}
        >
          <View style={styles.sosLeft}>
            <View style={styles.sirenIconBox}>
              <AlertTriangle size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sosTitle}>EMERGENCY SOS</Text>
              <Text style={styles.sosSubtitle}>
                Medical, Ambulance, Fall Help
              </Text>
            </View>
          </View>
          <View style={styles.dispatchBtn}>
            <Text style={styles.dispatchBtnText}>DISPATCH</Text>
          </View>
        </Pressable>
      </View>

      {/* 2. DESKTOP BLINKIT-STYLE 3 PROMO BANNERS (Visible on Wide Website View) */}
      {isDesktop ? (
        <View style={styles.promoRow}>
          {desktopPromoBanners.map((b) => (
            <View
              key={b.title}
              style={[styles.promoCard, { backgroundColor: b.bg }]}
            >
              <Text style={[styles.promoTitle, { color: b.titleColor }]}>
                {b.title}
              </Text>
              <Text style={[styles.promoSub, { color: b.titleColor }]}>
                {b.sub}
              </Text>
              <Pressable
                onPress={() =>
                  navigate({
                    pathname: '/customer/services',
                    search: `?serviceId=${encodeURIComponent(b.serviceId)}`,
                  })
                }
                style={[styles.promoBtn, { backgroundColor: b.btnBg }]}
              >
                <Text style={styles.promoBtnText}>Book Now</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      {/* 3. ESSENTIAL SERVICES GRID (4-across on Desktop Website, 2x2 on Mobile Inspect) */}
      <Text style={[styles.sectionEyebrow, { color: colors.primaryText }]}>
        Essential Concierge & Errand Services
      </Text>

      <View style={styles.gridContainer}>
        {visibleCards.map((item) => (
          <View
            key={item.id}
            style={[
              styles.gridCard,
              {
                width: isDesktop ? '23.5%' : '48%',
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={[styles.iconTileBox, { backgroundColor: item.tileBg }]}>
              {item.icon}
            </View>
            <Text style={[styles.cardTitle, { color: colors.primaryText }]}>
              {item.title}
            </Text>
            <Text style={[styles.cardSub, { color: colors.secondaryText }]}>
              {item.subtitle}
            </Text>
            <Pressable
              onPress={() => {
                if (item.id === 'srv-download-app') {
                  showToast(
                    'The SUBIDHA mobile app is coming soon. Please use our website for now.'
                  );
                  return;
                }
                navigate({
                  pathname: '/customer/services',
                  search: `?serviceId=${encodeURIComponent(item.id.replace('-2', ''))}`,
                });
              }}
              style={styles.cardActionBtn}
            >
              <Text style={styles.cardActionText}>{item.cta}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {/* 4. ACTIVE TASK EN-ROUTE BAR */}
      <View
        style={[
          styles.activeTaskWidget,
          {
            flexDirection: isDesktop ? 'row' : 'column',
            alignItems: isDesktop ? 'center' : 'stretch',
          },
        ]}
      >
        <View style={{ flex: 1, gap: 4 }}>
          <View style={styles.activeTaskTopRow}>
            <Text style={styles.activeTaskEyebrow}>ACTIVE TASK EN-ROUTE</Text>
            <Text style={styles.distanceBadge}>0.8 km away</Text>
          </View>
          <Text style={styles.activeTaskTitle}>
            Agent Rahul S. — Pharmacy Pickup & Escort
          </Text>
        </View>

        <Pressable
          onPress={() => navigate(ROUTES.customer.bookings)}
          style={[
            styles.trackLiveButton,
            { minWidth: isDesktop ? 220 : undefined },
          ]}
        >
          <Text style={styles.trackLiveText}>Track Agent Live</Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </Pressable>
      </View>

      <ModalDialog
        visible={sosModalOpen}
        variant="danger"
        title="CRITICAL SOS EMERGENCY RADAR"
        description={`Countdown: 3... 2... 1... Triggering Alerts (Simulated)\n\n• [Ambulance Liaison Contacted]\n• [Family Contact ${
          user.emergencyContactName || 'Meera Sen'
        } Notified via SMS]\n• [Nearest Agent Rahul S. (0.8 km) Redirected]`}
        primaryLabel="Acknowledge Demo Dispatch"
        secondaryLabel="Cancel"
        onPrimaryPress={() => setSosModalOpen(false)}
        onSecondaryPress={() => setSosModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 22,
  },
  topRowGrid: {
    gap: 16,
  },
  profileCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
  },
  seniorPassPill: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  seniorPassText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1D63ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  sosBanner: {
    backgroundColor: '#DC2626',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sosLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sirenIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  sosSubtitle: {
    color: '#FEE2E2',
    fontSize: 12,
    marginTop: 2,
  },
  dispatchBtn: {
    backgroundColor: '#991B1B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  dispatchBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  promoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  promoCard: {
    flex: 1,
    borderRadius: 18,
    padding: 22,
    gap: 8,
    justifyContent: 'space-between',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  promoSub: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },
  promoBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 8,
  },
  promoBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionEyebrow: {
    fontSize: 18,
    fontWeight: '800',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  gridCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  iconTileBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardSub: {
    fontSize: 12,
    marginBottom: 6,
  },
  cardActionBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardActionText: {
    color: '#0C831F',
    fontSize: 13,
    fontWeight: '800',
  },
  activeTaskWidget: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  activeTaskTopRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  activeTaskEyebrow: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  distanceBadge: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
  },
  activeTaskTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  trackLiveButton: {
    backgroundColor: '#1D63ED',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trackLiveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});