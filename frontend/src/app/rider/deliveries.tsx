
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import {
  Search,
  Package,
  MapPin,
  Clock3,
  IndianRupee,
  CheckCircle2,
  Bike,
  PackageCheck,
  XCircle,
  ClipboardList,
} from 'lucide-react';

type DeliveryStatus =
  | 'Available'
  | 'Upcoming'
  | 'Accepted'
  | 'Picked up'
  | 'Completed';

type DeliveryTask = {
  id: string;
  store: string;
  destination: string;
  distance: string;
  payout: number;
  estimatedTime: string;
  status: DeliveryStatus;
};

type FilterType = 'All' | 'Available' | 'Active' | 'Completed';

const INITIAL_TASKS: DeliveryTask[] = [
  {
    id: 'SUB-1042',
    store: 'Green Basket Store',
    destination: 'Adityapur, Jamshedpur',
    distance: '3.2 km',
    payout: 85,
    estimatedTime: '20 min',
    status: 'Available',
  },
  {
    id: 'SUB-1043',
    store: 'Daily Needs Market',
    destination: 'Sakchi, Jamshedpur',
    distance: '4.8 km',
    payout: 110,
    estimatedTime: '30 min',
    status: 'Upcoming',
  },
  {
    id: 'SUB-1044',
    store: 'Fresh Mart',
    destination: 'Bistupur, Jamshedpur',
    distance: '2.5 km',
    payout: 70,
    estimatedTime: '15 min',
    status: 'Available',
  },
  {
    id: 'SUB-1045',
    store: 'Daily Fresh',
    destination: 'Kadma, Jamshedpur',
    distance: '3.7 km',
    payout: 95,
    estimatedTime: '25 min',
    status: 'Completed',
  },
];

const FILTERS: FilterType[] = [
  'All',
  'Available',
  'Active',
  'Completed',
];

export default function RiderDeliveriesPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  const [tasks, setTasks] = useState<DeliveryTask[]>(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [searchText, setSearchText] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [notice, setNotice] = useState('');

  const filteredTasks = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.id.toLowerCase().includes(query) ||
        task.store.toLowerCase().includes(query) ||
        task.destination.toLowerCase().includes(query);

      let matchesFilter = true;

      if (activeFilter === 'Available') {
        matchesFilter =
          task.status === 'Available' ||
          task.status === 'Upcoming';
      } else if (activeFilter === 'Active') {
        matchesFilter =
          task.status === 'Accepted' ||
          task.status === 'Picked up';
      } else if (activeFilter === 'Completed') {
        matchesFilter = task.status === 'Completed';
      }

      return matchesSearch && matchesFilter;
    });
  }, [tasks, activeFilter, searchText]);

  const counts = useMemo(
    () => ({
      available: tasks.filter(
        (task) =>
          task.status === 'Available' ||
          task.status === 'Upcoming',
      ).length,
      active: tasks.filter(
        (task) =>
          task.status === 'Accepted' ||
          task.status === 'Picked up',
      ).length,
      completed: tasks.filter(
        (task) => task.status === 'Completed',
      ).length,
    }),
    [tasks],
  );

  function updateTaskStatus(
    taskId: string,
    nextStatus: DeliveryStatus,
  ) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: nextStatus }
          : task,
      ),
    );

    const messages: Record<DeliveryStatus, string> = {
      Available: 'Task is available.',
      Upcoming: 'Task is upcoming.',
      Accepted: 'Delivery accepted successfully.',
      'Picked up': 'Order marked as picked up.',
      Completed: 'Delivery marked as completed.',
    };

    setNotice(`${taskId}: ${messages[nextStatus]}`);
  }

  function handlePrimaryAction(task: DeliveryTask) {
    if (
      task.status === 'Available' ||
      task.status === 'Upcoming'
    ) {
      if (!isOnline) {
        setNotice('Go online before accepting a delivery.');
        return;
      }

      updateTaskStatus(task.id, 'Accepted');
      return;
    }

    if (task.status === 'Accepted') {
      updateTaskStatus(task.id, 'Picked up');
      return;
    }

    if (task.status === 'Picked up') {
      updateTaskStatus(task.id, 'Completed');
    }
  }

  function getActionLabel(status: DeliveryStatus) {
    switch (status) {
      case 'Available':
      case 'Upcoming':
        return 'Accept delivery';
      case 'Accepted':
        return 'Mark picked up';
      case 'Picked up':
        return 'Complete delivery';
      case 'Completed':
        return 'Completed';
    }
  }

  function getStatusColors(status: DeliveryStatus) {
    switch (status) {
      case 'Available':
        return {
          backgroundColor: '#E9F1FB',
          color: '#406CA9',
        };
      case 'Upcoming':
        return {
          backgroundColor: '#FBF0D9',
          color: '#8A682A',
        };
      case 'Accepted':
        return {
          backgroundColor: '#EAF4ED',
          color: '#246B50',
        };
      case 'Picked up':
        return {
          backgroundColor: '#F0EAFB',
          color: '#7352A4',
        };
      case 'Completed':
        return {
          backgroundColor: '#E6F4EA',
          color: '#23784F',
        };
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        isMobile && styles.mobileContent,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Page heading */}
      <View style={styles.pageHeader}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>RIDER PARTNER</Text>
          <Text style={styles.pageTitle}>My Deliveries</Text>
          <Text style={styles.pageDescription}>
            Manage your delivery tasks and track their progress.
          </Text>
        </View>

        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>DEMO DATA</Text>
        </View>
      </View>

      {/* Online availability */}
      <View style={styles.onlineCard}>
        <View style={styles.onlineInfo}>
          <View
            style={[
              styles.onlineIcon,
              isOnline && styles.onlineIconActive,
            ]}
          >
            <Bike
              size={22}
              color={isOnline ? '#23784F' : '#64756A'}
            />
          </View>

          <View style={styles.onlineCopy}>
            <Text style={styles.onlineTitle}>
              {isOnline ? 'You are online' : 'You are offline'}
            </Text>
            <Text style={styles.onlineDescription}>
              {isOnline
                ? 'You can accept available delivery tasks.'
                : 'Go online to accept new deliveries.'}
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.onlineButton,
            isOnline && styles.goOfflineButton,
          ]}
          onPress={() => {
            setIsOnline((current) => !current);
            setNotice(
              isOnline
                ? 'You are now offline.'
                : 'You are now online and can accept tasks.',
            );
          }}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.onlineButtonText,
              isOnline && styles.goOfflineButtonText,
            ]}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Text>
        </Pressable>
      </View>

      {/* Summary cards */}
      <View
        style={[
          styles.summaryGrid,
          isMobile && styles.mobileSummaryGrid,
        ]}
      >
        <SummaryCard
          icon={<Package size={20} color="#406CA9" />}
          label="Available"
          value={String(counts.available)}
        />
        <SummaryCard
          icon={<Bike size={20} color="#246B50" />}
          label="Active"
          value={String(counts.active)}
        />
        <SummaryCard
          icon={<PackageCheck size={20} color="#23784F" />}
          label="Completed"
          value={String(counts.completed)}
        />
      </View>

      {/* Filters and search */}
      <View style={styles.listHeader}>
        <View>
          <Text style={styles.sectionTitle}>Delivery tasks</Text>
          <Text style={styles.sectionSubtitle}>
            {filteredTasks.length} task
            {filteredTasks.length === 1 ? '' : 's'} found
          </Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Search size={19} color="#819087" />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search order, store or location"
          placeholderTextColor="#98A39B"
          style={styles.searchInput}
          accessibilityLabel="Search delivery tasks"
        />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => {
          const selected = activeFilter === filter;

          return (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterButton,
                selected && styles.filterButtonActive,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text
                style={[
                  styles.filterText,
                  selected && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Action feedback */}
      {notice ? (
        <View style={styles.notice}>
          <CheckCircle2 size={17} color="#23784F" />
          <Text style={styles.noticeText}>{notice}</Text>
          <Pressable
            onPress={() => setNotice('')}
            accessibilityRole="button"
            accessibilityLabel="Dismiss message"
          >
            <XCircle size={18} color="#64756A" />
          </Pressable>
        </View>
      ) : null}

      {/* Delivery list */}
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => {
          const statusColors = getStatusColors(task.status);
          const isCompleted = task.status === 'Completed';

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
                    styles.statusBadge,
                    {
                      backgroundColor: statusColors.backgroundColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: statusColors.color },
                    ]}
                  >
                    {task.status}
                  </Text>
                </View>
              </View>

              <View style={styles.destinationRow}>
                <MapPin size={17} color="#64756A" />
                <View style={styles.destinationCopy}>
                  <Text style={styles.destinationLabel}>
                    Deliver to
                  </Text>
                  <Text style={styles.destinationText}>
                    {task.destination}
                  </Text>
                </View>
              </View>

              <View style={styles.taskMetaRow}>
                <View style={styles.metaItem}>
                  <Bike size={16} color="#64756A" />
                  <Text style={styles.metaText}>
                    {task.distance}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Clock3 size={16} color="#64756A" />
                  <Text style={styles.metaText}>
                    {task.estimatedTime}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <IndianRupee size={16} color="#246B50" />
                  <Text style={styles.payoutText}>
                    {task.payout}
                  </Text>
                </View>
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
                  disabled={isCompleted}
                  onPress={() => handlePrimaryAction(task)}
                  style={[
                    styles.actionButton,
                    isCompleted && styles.completedButton,
                  ]}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      isCompleted && styles.completedButtonText,
                    ]}
                  >
                    {getActionLabel(task.status)}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <ClipboardList size={27} color="#64756A" />
          </View>
          <Text style={styles.emptyTitle}>No deliveries found</Text>
          <Text style={styles.emptyDescription}>
            Try another filter or search for a different task.
          </Text>
          <Pressable
            onPress={() => {
              setActiveFilter('All');
              setSearchText('');
            }}
            style={styles.resetButton}
            accessibilityRole="button"
          >
            <Text style={styles.resetButtonText}>
              Show all deliveries
            </Text>
          </Pressable>
        </View>
      )}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Demo only: delivery tasks, status changes and payouts are
          stored in this page's temporary state. They are not
          connected to a live order system or backend yet.
        </Text>
      </View>
    </ScrollView>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryIcon}>{icon}</View>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    backgroundColor: '#F6F8F6',
  },
  content: {
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 26,
    paddingBottom: 40,
  },
  mobileContent: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 100,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 22,
  },
  headingCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    color: '#438363',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  pageTitle: {
    color: '#20382B',
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
  },
  pageDescription: {
    color: '#718076',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  demoBadge: {
    backgroundColor: '#FBF0D9',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  demoBadgeText: {
    color: '#8A682A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  onlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#EAF4ED',
    borderWidth: 1,
    borderColor: '#D8E9DD',
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
  },
  onlineInfo: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  onlineIcon: {
    width: 42,
    height: 42,
    flexShrink: 0,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIconActive: {
    backgroundColor: '#D6EEDF',
  },
  onlineCopy: {
    flex: 1,
    minWidth: 0,
  },
  onlineTitle: {
    color: '#244B35',
    fontSize: 14,
    fontWeight: '800',
  },
  onlineDescription: {
    color: '#63796B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  onlineButton: {
    backgroundColor: '#246B50',
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  goOfflineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E1DA',
  },
  onlineButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  goOfflineButtonText: {
    color: '#246B50',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  mobileSummaryGrid: {
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 16,
    padding: 15,
  },
  summaryIcon: {
    width: 37,
    height: 37,
    borderRadius: 11,
    backgroundColor: '#F0F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#748178',
    fontSize: 11,
  },
  summaryValue: {
    color: '#20382B',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 5,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },
  sectionTitle: {
    color: '#20382B',
    fontSize: 19,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#819087',
    fontSize: 12,
    marginTop: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E9E4',
    borderRadius: 12,
    paddingHorizontal: 13,
    height: 46,
    marginBottom: 13,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: '#263C2E',
    fontSize: 13,
    outlineStyle: 'none',
  } as any,
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E9E4',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  filterButtonActive: {
    backgroundColor: '#246B50',
    borderColor: '#246B50',
  },
  filterText: {
    color: '#64756A',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 12,
    backgroundColor: '#EAF4ED',
    borderRadius: 11,
    marginBottom: 14,
  },
  noticeText: {
    flex: 1,
    minWidth: 0,
    color: '#246B50',
    fontSize: 12,
    lineHeight: 18,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 17,
    padding: 16,
    marginBottom: 13,
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storeIcon: {
    width: 42,
    height: 42,
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
    letterSpacing: 0.5,
  },
  storeName: {
    color: '#263C2E',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 5,
  },
  statusBadge: {
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginTop: 17,
  },
  destinationCopy: {
    flex: 1,
    minWidth: 0,
  },
  destinationLabel: {
    color: '#829087',
    fontSize: 10,
  },
  destinationText: {
    color: '#526157',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  taskMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
    marginTop: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: '#64756A',
    fontSize: 11,
  },
  payoutText: {
    color: '#246B50',
    fontSize: 12,
    fontWeight: '800',
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
  actionButton: {
    backgroundColor: '#246B50',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  completedButton: {
    backgroundColor: '#E6F4EA',
  },
  completedButtonText: {
    color: '#23784F',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 17,
    padding: 28,
    marginTop: 2,
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F0F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    color: '#20382B',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyDescription: {
    color: '#819087',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
  },
  resetButton: {
    backgroundColor: '#EAF4ED',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
  },
  resetButtonText: {
    color: '#246B50',
    fontSize: 12,
    fontWeight: '800',
  },
  disclaimer: {
    backgroundColor: '#F0F2F0',
    borderRadius: 11,
    padding: 12,
    marginTop: 8,
  },
  disclaimerText: {
    color: '#738078',
    fontSize: 11,
    lineHeight: 17,
  },
});
