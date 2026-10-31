
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  IndianRupee,
  MapPin,
  Package,
  PackageCheck,
  Star,
  Wallet,
  UserRound,
  Power,
  Clock3,
  TrendingUp,
} from 'lucide-react';

import { ROUTES } from '@/routes';
import { DashboardShell } from '@/components/layout/DashboardShell';

type DeliveryTask = {
  id: string;
  store: string;
  destination: string;
  distance: string;
  payout: number;
  status: 'Available' | 'Upcoming';
};

const DEMO_TASKS: DeliveryTask[] = [
  {
    id: 'SUB-1042',
    store: 'Green Basket Store',
    destination: 'Adityapur, Jamshedpur',
    distance: '3.2 km',
    payout: 85,
    status: 'Available',
  },
  {
    id: 'SUB-1043',
    store: 'Daily Needs Market',
    destination: 'Sakchi, Jamshedpur',
    distance: '4.8 km',
    payout: 110,
    status: 'Upcoming',
  },
  {
    id: 'SUB-1044',
    store: 'Fresh Mart',
    destination: 'Bistupur, Jamshedpur',
    distance: '2.5 km',
    payout: 70,
    status: 'Available',
  },
];

const RIDER_NAV_ITEMS = [
  {
    label: 'Home',
    href: ROUTES.rider.dashboard,
    icon: 'home' as const,
  },
  {
    label: 'Deliveries',
    href: ROUTES.rider.deliveries,
    icon: 'tasks' as const,
  },
  {
    label: 'Earnings',
    href: ROUTES.rider.earnings,
    icon: 'bills' as const,
  },
  {
    label: 'Profile',
    href: ROUTES.rider.profile,
    icon: 'profile' as const,
  },
];

export default function RiderDashboardPage() {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

  const isMobile = width < 700;

  const [isOnline, setIsOnline] = useState(false);
  const [acceptedTasks, setAcceptedTasks] = useState<string[]>([]);

  const goTo = (path: string) => {
    navigate(path);
  };

  const acceptTask = (taskId: string) => {
    setAcceptedTasks((current) =>
      current.includes(taskId) ? current : [...current, taskId],
    );
  };

  return (
    <DashboardShell
      roleLabel="Rider Partner"
      navItems={RIDER_NAV_ITEMS}
      bottomGridItems={RIDER_NAV_ITEMS}
      showLocationPromptOnHome
    >
      <View style={styles.page}>
        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeCopy}>
            <Text style={styles.eyebrow}>RIDER OVERVIEW</Text>

            <Text style={styles.welcomeTitle}>
              Good morning, Rahul 👋
            </Text>

            <Text style={styles.welcomeDescription}>
              You're verified and ready to start delivering.
            </Text>
          </View>

          {!isMobile && (
            <View style={styles.datePill}>
              <Clock3 size={15} color="#64756A" />
              <Text style={styles.dateText}>Today's activity</Text>
            </View>
          )}
        </View>

        {/* Online / offline status */}
        <View
          style={[
            styles.availabilityCard,
            isMobile && styles.mobileAvailabilityCard,
          ]}
        >
          <View style={styles.availabilityInfo}>
            <View
              style={[
                styles.availabilityIcon,
                isOnline && styles.onlineIcon,
              ]}
            >
              <Power
                size={22}
                color={isOnline ? '#23784F' : '#64756A'}
              />
            </View>

            <View style={styles.availabilityCopy}>
              <Text style={styles.availabilityTitle}>
                {isOnline
                  ? "You're currently online"
                  : "You're currently offline"}
              </Text>

              <Text style={styles.availabilityDescription}>
                {isOnline
                  ? 'You can accept available delivery tasks.'
                  : 'Go online when you are ready to receive tasks.'}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setIsOnline((current) => !current)}
            style={[
              styles.onlineButton,
              isMobile && styles.mobileOnlineButton,
              isOnline && styles.offlineButton,
            ]}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.onlineButtonText,
                isOnline && styles.offlineButtonText,
              ]}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Text>
          </Pressable>
        </View>

        {/* Performance */}
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>
            Today's performance
          </Text>
          <Text style={styles.demoLabel}>DEMO DATA</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon={<IndianRupee size={21} color="#23784F" />}
            label="Today's earnings"
            value="₹850"
            detail="+12% from yesterday"
            detailColor="#23784F"
          />

          <StatCard
            icon={<PackageCheck size={21} color="#4774B8" />}
            label="Deliveries completed"
            value="12"
            detail="Daily target: 15"
            detailColor="#64756A"
          />

          <StatCard
            icon={<Star size={21} color="#B7791F" />}
            label="Customer rating"
            value="4.8 / 5"
            detail="Based on demo ratings"
            detailColor="#64756A"
          />

          <Pressable
            style={styles.statCard}
            onPress={() => goTo(ROUTES.rider.earnings)}
            accessibilityRole="button"
          >
            <View style={styles.statCardTop}>
              <View style={styles.statIcon}>
                <Wallet size={21} color="#7962B5" />
              </View>
              <Text style={styles.statLabel}>Wallet balance</Text>
            </View>

            <Text style={styles.statValue}>₹2,450</Text>
            <Text style={[styles.statDetail, { color: '#64756A' }]}>
              View earnings and withdrawals
            </Text>
          </Pressable>
        </View>

        {/* Delivery opportunities and quick links */}
        <View
          style={[
            styles.mainGrid,
            isMobile && styles.mobileMainGrid,
          ]}
        >
          <View style={styles.tasksColumn}>
            <View style={styles.sectionHeading}>
              <View style={styles.taskHeadingCopy}>
                <Text style={styles.sectionTitle}>
                  Delivery opportunities
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Demo tasks near your area
                </Text>
              </View>

              <Pressable
                style={styles.viewAllButton}
                onPress={() => goTo(ROUTES.rider.deliveries)}
                accessibilityRole="button"
              >
                <Text style={styles.viewAllText}>View all</Text>
                <ChevronRight size={16} color="#246B50" />
              </Pressable>
            </View>

            {!isOnline && (
              <View style={styles.offlineNotice}>
                <Power size={17} color="#8A682A" />
                <Text style={styles.offlineNoticeText}>
                  Go online to start accepting delivery tasks.
                </Text>
              </View>
            )}

            {DEMO_TASKS.map((task) => {
              const accepted = acceptedTasks.includes(task.id);

              return (
                <View key={task.id} style={styles.taskCard}>
                  <View style={styles.taskTopRow}>
                    <View style={styles.storeIcon}>
                      <Package size={22} color="#246B50" />
                    </View>

                    <View style={styles.taskTitleGroup}>
                      <Text style={styles.taskId}>
                        ORDER #{task.id}
                      </Text>
                      <Text style={styles.storeName}>
                        {task.store}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.taskStatus,
                        accepted && styles.acceptedStatus,
                      ]}
                    >
                      <Text
                        style={[
                          styles.taskStatusText,
                          accepted && styles.acceptedStatusText,
                        ]}
                      >
                        {accepted ? 'Accepted' : task.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.routeInfo}>
                    <MapPin size={16} color="#64756A" />
                    <Text style={styles.routeText}>
                      {task.destination}
                    </Text>
                    <Text style={styles.distanceText}>
                      {task.distance}
                    </Text>
                  </View>

                  <View style={styles.taskFooter}>
                    <View>
                      <Text style={styles.payoutLabel}>
                        Delivery payout
                      </Text>
                      <Text style={styles.payoutValue}>
                        ₹{task.payout}
                      </Text>
                    </View>

                    <Pressable
                      disabled={!isOnline || accepted}
                      onPress={() => acceptTask(task.id)}
                      style={[
                        styles.acceptButton,
                        (!isOnline || accepted) &&
                          styles.disabledButton,
                      ]}
                      accessibilityRole="button"
                    >
                      <Text style={styles.acceptButtonText}>
                        {accepted
                          ? 'Accepted'
                          : isOnline
                            ? 'Accept task'
                            : 'Go online first'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}

            <View style={styles.demoDisclaimer}>
              <Text style={styles.demoDisclaimerText}>
                These are sample orders for the frontend demo. They are
                not connected to a live order system.
              </Text>
            </View>
          </View>

          {/* Dashboard quick access */}
          <View
            style={[
              styles.sidebar,
              isMobile && styles.mobileSidebar,
            ]}
          >
            <View style={styles.goalCard}>
              <View style={styles.goalHeading}>
                <View style={styles.goalIcon}>
                  <TrendingUp size={21} color="#246B50" />
                </View>
                <Text style={styles.goalTitle}>
                  Daily delivery goal
                </Text>
              </View>

              <Text style={styles.goalProgress}>
                12 of 15 deliveries
              </Text>

              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>

              <Text style={styles.goalHint}>
                3 more deliveries to reach your demo target.
              </Text>
            </View>

            <View style={styles.quickLinksCard}>
              <Text style={styles.quickLinksTitle}>Quick access</Text>

              <QuickLink
                icon={<ClipboardList size={19} color="#246B50" />}
                title="My deliveries"
                subtitle="View your tasks"
                onPress={() => goTo(ROUTES.rider.deliveries)}
              />

              <QuickLink
                icon={<IndianRupee size={19} color="#246B50" />}
                title="Earnings & wallet"
                subtitle="Income, balance and withdrawals"
                onPress={() => goTo(ROUTES.rider.earnings)}
              />

              <QuickLink
                icon={<UserRound size={19} color="#246B50" />}
                title="My profile"
                subtitle="Personal information"
                onPress={() => goTo(ROUTES.rider.profile)}
              />
            </View>

            <View style={styles.supportCard}>
              <Text style={styles.supportTitle}>Need help?</Text>
              <Text style={styles.supportDescription}>
                Contact the SUBIDHA support team if you need assistance.
              </Text>

              <Pressable
                onPress={() => goTo(ROUTES.rider.profile)}
                style={styles.supportButton}
                accessibilityRole="button"
              >
                <Text style={styles.supportButtonText}>Get support</Text>
                <ChevronRight size={16} color="#246B50" />
              </Pressable>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>
          SUBIDHA Rider Portal · Frontend demonstration
        </Text>
      </View>
    </DashboardShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
  detailColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  detailColor: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardTop}>
        <View style={styles.statIcon}>{icon}</View>
        <Text style={styles.statLabel}>{label}</Text>
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statDetail, { color: detailColor }]}>
        {detail}
      </Text>
    </View>
  );
}

function QuickLink({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.quickLink}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={styles.quickLinkIcon}>{icon}</View>

      <View style={styles.quickLinkCopy}>
        <Text style={styles.quickLinkTitle}>{title}</Text>
        <Text style={styles.quickLinkSubtitle}>{subtitle}</Text>
      </View>

      <ChevronRight size={17} color="#98A59D" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
    paddingBottom: 28,
    gap: 0,
  },

  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingTop: 28,
    paddingBottom: 22,
  },

  welcomeCopy: {
    flex: 1,
    minWidth: 0,
  },

  eyebrow: {
    color: '#438363',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 9,
  },

  welcomeTitle: {
    color: '#20382B',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
  },

  welcomeDescription: {
    color: '#718076',
    fontSize: 14,
    marginTop: 7,
    lineHeight: 21,
  },

  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EAE6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },

  dateText: {
    color: '#64756A',
    fontSize: 12,
    fontWeight: '600',
  },

  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    backgroundColor: '#EAF4ED',
    borderColor: '#D8E9DD',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },

  mobileAvailabilityCard: {
    padding: 13,
    gap: 9,
  },

  availabilityInfo: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  availabilityIcon: {
    width: 42,
    height: 42,
    flexShrink: 0,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  onlineIcon: {
    backgroundColor: '#D6EEDF',
  },

  availabilityCopy: {
    flex: 1,
    minWidth: 0,
  },

  availabilityTitle: {
    color: '#244B35',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },

  availabilityDescription: {
    color: '#63796B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  onlineButton: {
    backgroundColor: '#246B50',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mobileOnlineButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  offlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E1DA',
  },

  onlineButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },

  offlineButtonText: {
    color: '#246B50',
  },

  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#20382B',
    fontSize: 18,
    fontWeight: '800',
    flexShrink: 1,
  },

  sectionSubtitle: {
    color: '#819087',
    fontSize: 12,
    marginTop: 5,
  },

  taskHeadingCopy: {
    flex: 1,
    minWidth: 0,
  },

  demoLabel: {
    color: '#8A682A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    backgroundColor: '#FBF0D9',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 32,
  },

  statCard: {
    flexGrow: 1,
    flexBasis: 200,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDE9',
    borderRadius: 18,
    padding: 18,
  },

  statCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F4F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statLabel: {
    flex: 1,
    color: '#748178',
    fontSize: 12,
    lineHeight: 17,
  },

  statValue: {
    color: '#20382B',
    fontSize: 27,
    fontWeight: '800',
    marginTop: 17,
  },

  statDetail: {
    fontSize: 11,
    marginTop: 7,
    lineHeight: 16,
  },

  mainGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },

  mobileMainGrid: {
    flexDirection: 'column',
    gap: 20,
  },

  tasksColumn: {
    flex: 1,
    minWidth: 0,
  },

  sidebar: {
    width: 310,
    gap: 18,
  },

  mobileSidebar: {
    width: '100%',
  },

  taskCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 17,
    padding: 15,
    marginBottom: 12,
  },

  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  storeIcon: {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 12,
    backgroundColor: '#EAF4ED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  taskTitleGroup: {
    flex: 1,
    minWidth: 0,
  },

  taskId: {
    color: '#829087',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  storeName: {
    color: '#263C2E',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 5,
  },

  taskStatus: {
    backgroundColor: '#E9F1FB',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  taskStatusText: {
    color: '#406CA9',
    fontSize: 10,
    fontWeight: '800',
  },

  acceptedStatus: {
    backgroundColor: '#E6F4EA',
  },

  acceptedStatusText: {
    color: '#23784F',
  },

  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 16,
  },

  routeText: {
    color: '#64756A',
    fontSize: 12,
    flex: 1,
    minWidth: 0,
  },

  distanceText: {
    color: '#64756A',
    fontSize: 11,
    fontWeight: '700',
  },

  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDF0ED',
    marginTop: 16,
    paddingTop: 14,
  },

  payoutLabel: {
    color: '#829087',
    fontSize: 11,
  },

  payoutValue: {
    color: '#246B50',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },

  acceptButton: {
    backgroundColor: '#246B50',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#AAB8AE',
  },

  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 13,
    borderRadius: 12,
    backgroundColor: '#FFF6E5',
    marginBottom: 13,
  },

  offlineNoticeText: {
    color: '#816329',
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },

  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  viewAllText: {
    color: '#246B50',
    fontSize: 12,
    fontWeight: '800',
  },

  demoDisclaimer: {
    backgroundColor: '#F0F2F0',
    borderRadius: 11,
    padding: 12,
    marginTop: 2,
    marginBottom: 16,
  },

  demoDisclaimerText: {
    color: '#738078',
    fontSize: 11,
    lineHeight: 17,
  },

  goalCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 17,
    padding: 18,
  },

  goalHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  goalIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#EAF4ED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  goalTitle: {
    color: '#263C2E',
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },

  goalProgress: {
    color: '#20382B',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 20,
  },

  progressTrack: {
    height: 8,
    borderRadius: 10,
    backgroundColor: '#E8EEE9',
    marginTop: 12,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    width: '80%',
    backgroundColor: '#438363',
    borderRadius: 10,
  },

  goalHint: {
    color: '#748178',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 12,
  },

  quickLinksCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 17,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  quickLinksTitle: {
    color: '#263C2E',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },

  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F0',
  },

  quickLinkIcon: {
    width: 37,
    height: 37,
    borderRadius: 11,
    backgroundColor: '#F0F6F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickLinkCopy: {
    flex: 1,
    minWidth: 0,
  },

  quickLinkTitle: {
    color: '#263C2E',
    fontSize: 12,
    fontWeight: '800',
  },

  quickLinkSubtitle: {
    color: '#849087',
    fontSize: 10,
    marginTop: 4,
  },

  supportCard: {
    backgroundColor: '#EAF4ED',
    borderRadius: 17,
    padding: 18,
  },

  supportTitle: {
    color: '#244B35',
    fontSize: 15,
    fontWeight: '800',
  },

  supportDescription: {
    color: '#63796B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },

  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 14,
  },

  supportButtonText: {
    color: '#246B50',
    fontSize: 12,
    fontWeight: '800',
  },

  footerText: {
    color: '#98A39B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 12,
  },
});
