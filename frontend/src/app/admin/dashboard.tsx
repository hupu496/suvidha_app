
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  MapPin,
  Phone,
  Bike,
  FileText,
  CreditCard,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type {
  RiderProfile,
  RiderApplicationStatus,
} from '@/types';

import {
  getAllRiderApplications,
  updateRiderApplicationStatus,
} from '@/services/auth.service';

import { logoutAdmin } from '@/services/admin.service';
import { ROUTES } from '@/routes';

type FilterStatus = 'all' | RiderApplicationStatus;

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [riders, setRiders] = useState<RiderProfile[]>(() =>
    getAllRiderApplications(),
  );
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    logoutAdmin();
    navigate(ROUTES.admin.login, { replace: true });
  };

  const refreshApplications = useCallback(() => {
    setRiders(getAllRiderApplications());
    setMessage('Applications refreshed.');
  }, []);

  const changeStatus = (
    riderId: string,
    status: RiderApplicationStatus,
  ) => {
    try {
      const updated = updateRiderApplicationStatus(riderId, status);
      setRiders(getAllRiderApplications());
      setMessage(
        `${updated.fullName}'s application has been ${status}.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update this application.',
      );
    }
  };

  const pendingCount = riders.filter(
    (rider) => rider.applicationStatus === 'pending',
  ).length;

  const approvedCount = riders.filter(
    (rider) => rider.applicationStatus === 'approved',
  ).length;

  const rejectedCount = riders.filter(
    (rider) => rider.applicationStatus === 'rejected',
  ).length;

  const suspendedCount = riders.filter(
    (rider) => rider.applicationStatus === 'suspended',
  ).length;

  const filteredRiders = riders.filter(
    (rider) =>
      filter === 'all' || rider.applicationStatus === filter,
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.page}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            SUBIDHA ADMINISTRATION
          </Text>
          <Text style={styles.title}>Rider applications</Text>
          <Text style={styles.subtitle}>
            Review rider details and manage application decisions.
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            onPress={refreshApplications}
            style={styles.refreshButton}
          >
            <RefreshCw size={17} color="#334155" />
            <Text style={styles.refreshText}>Refresh</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <LogOut size={17} color="#B91C1C" />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </View>

      {message ? (
        <Text
          accessibilityLiveRegion="polite"
          style={styles.message}
        >
          {message}
        </Text>
      ) : null}

      <View style={styles.statsGrid}>
        <StatCard
          label="Total applications"
          value={riders.length}
          icon={<Users size={21} color="#475569" />}
          tone="neutral"
        />
        <StatCard
          label="Pending review"
          value={pendingCount}
          icon={<Clock size={21} color="#A16207" />}
          tone="pending"
        />
        <StatCard
          label="Approved"
          value={approvedCount}
          icon={<CheckCircle2 size={21} color="#15803D" />}
          tone="approved"
        />
        <StatCard
          label="Rejected"
          value={rejectedCount}
          icon={<XCircle size={21} color="#B91C1C" />}
          tone="rejected"
        />
        <StatCard
          label="Suspended"
          value={suspendedCount}
          icon={<XCircle size={21} color="#475569" />}
          tone="neutral"
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Applications</Text>
        <Text style={styles.sectionSubtitle}>
          Review each applicant before making a decision.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {(
          [
            ['all', 'All applications'],
            ['pending', 'Pending'],
            ['approved', 'Approved'],
            ['rejected', 'Rejected'],
            ['suspended', 'Suspended'],
          ] as [FilterStatus, string][]
        ).map(([value, label]) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === value }}
            onPress={() => setFilter(value)}
            style={[
              styles.filterButton,
              filter === value && styles.activeFilter,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === value && styles.activeFilterText,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {filteredRiders.length === 0 ? (
        <View style={styles.emptyState}>
          <Users size={34} color="#94A3B8" />
          <Text style={styles.emptyTitle}>
            No applications found
          </Text>
          <Text style={styles.emptyText}>
            {riders.length === 0
              ? 'New rider registrations will appear here.'
              : 'There are no applications in this category.'}
          </Text>
        </View>
      ) : (
        filteredRiders.map((rider) => (
          <RiderApplicationCard
            key={rider.id}
            rider={rider}
            onStatusChange={changeStatus}
          />
        ))
      )}
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: 'neutral' | 'pending' | 'approved' | 'rejected';
}) {
  return (
    <View style={[styles.statCard, styles[`stat_${tone}`]]}>
      <View style={styles.statTop}>
        <Text style={styles.statLabel}>{label}</Text>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function RiderApplicationCard({
  rider,
  onStatusChange,
}: {
  rider: RiderProfile;
  onStatusChange: (
    riderId: string,
    status: RiderApplicationStatus,
  ) => void;
}) {
  const status = rider.applicationStatus;

  const submittedDate = rider.submittedAt
    ? new Date(rider.submittedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Not provided';

  const statusBadgeStyle =
    status === 'pending'
      ? styles.status_pending
      : status === 'approved'
        ? styles.status_approved
        : status === 'rejected'
          ? styles.status_rejected
          : styles.status_suspended;

  const statusTextStyle =
    status === 'pending'
      ? styles.statusText_pending
      : status === 'approved'
        ? styles.statusText_approved
        : status === 'rejected'
          ? styles.statusText_rejected
          : styles.statusText_suspended;

  return (
    <View style={styles.applicationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {rider.fullName.trim().charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.applicantInfo}>
          <Text style={styles.applicantName}>
            {rider.fullName}
          </Text>
          <Text style={styles.applicationId}>{rider.id}</Text>
        </View>

        <View style={[styles.statusBadge, statusBadgeStyle]}>
          <Text style={[styles.statusText, statusTextStyle]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <Detail
          icon={<Phone size={16} color="#64748B" />}
          label="Phone"
          value={rider.phone}
        />
        <Detail
          icon={<MapPin size={16} color="#64748B" />}
          label="City"
          value={rider.city}
        />
        <Detail
          icon={<Bike size={16} color="#64748B" />}
          label="Vehicle"
          value={String(rider.vehicleType).replace(/_/g, ' ')}
        />
        <Detail
          icon={<Clock size={16} color="#64748B" />}
          label="Submitted"
          value={submittedDate}
        />
      </View>

      {rider.vehicleRegistrationNumber ? (
        <View style={styles.extraRow}>
          <Text style={styles.extraLabel}>
            Vehicle registration
          </Text>
          <Text style={styles.extraValue}>
            {rider.vehicleRegistrationNumber}
          </Text>
        </View>
      ) : null}

      <View style={styles.verificationSection}>
        <View style={styles.verificationHeading}>
          <FileText size={17} color="#475569" />
          <Text style={styles.verificationTitle}>
            Document verification
          </Text>
        </View>

        {rider.documents.map((document) => (
          <View
            key={document.id}
            style={styles.verificationRow}
          >
            <Text style={styles.documentName}>
              {String(document.type).replace(/_/g, ' ')}
            </Text>
            <Text style={styles.documentStatus}>
              {document.verificationStatus}
            </Text>
          </View>
        ))}

        <View style={styles.verificationRow}>
          <View style={styles.bankLabel}>
            <CreditCard size={15} color="#64748B" />
            <Text style={styles.documentName}>
              Bank verification
            </Text>
          </View>
          <Text style={styles.documentStatus}>
            {rider.bankAccount.verificationStatus}
          </Text>
        </View>
      </View>

      {status === 'pending' ? (
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => onStatusChange(rider.id, 'approved')}
            style={[styles.actionButton, styles.approveButton]}
          >
            <CheckCircle2 size={17} color="#FFFFFF" />
            <Text style={styles.approveText}>Approve</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => onStatusChange(rider.id, 'rejected')}
            style={[styles.actionButton, styles.rejectButton]}
          >
            <XCircle size={17} color="#B91C1C" />
            <Text style={styles.rejectText}>Reject</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.completedNotice}>
          {status === 'approved' ? (
            <CheckCircle2 size={16} color="#15803D" />
          ) : (
            <XCircle size={16} color="#B91C1C" />
          )}

          <Text style={styles.completedText}>
            This application has been {status}.
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => onStatusChange(rider.id, 'pending')}
          >
            <Text style={styles.resetText}>Reopen</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detail}>
      <View style={styles.detailIcon}>{icon}</View>
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>
          {value || 'Not provided'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  page: {
    padding: 24,
    paddingBottom: 48,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
    minWidth: 220,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  eyebrow: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 21,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  refreshText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  logoutText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  message: {
    color: '#334155',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 32,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: 180,
    minWidth: 145,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 18,
    backgroundColor: '#FFFFFF',
  },
  stat_neutral: {
    backgroundColor: '#FFFFFF',
  },
  stat_pending: {
    backgroundColor: '#FFFBEB',
  },
  stat_approved: {
    backgroundColor: '#F0FDF4',
  },
  stat_rejected: {
    backgroundColor: '#FEF2F2',
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  statValue: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 6,
  },
  filters: {
    gap: 8,
    paddingBottom: 18,
  },
  filterButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 15,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  activeFilter: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 14,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 22,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  avatarText: {
    color: '#334155',
    fontSize: 18,
    fontWeight: '800',
  },
  applicantInfo: {
    flex: 1,
    minWidth: 130,
  },
  applicantName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  applicationId: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 5,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  status_pending: {
    backgroundColor: '#FEF3C7',
  },
  status_approved: {
    backgroundColor: '#DCFCE7',
  },
  status_rejected: {
    backgroundColor: '#FEE2E2',
  },
  status_suspended: {
    backgroundColor: '#E2E8F0',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusText_pending: {
    color: '#92400E',
  },
  statusText_approved: {
    color: '#166534',
  },
  statusText_rejected: {
    color: '#991B1B',
  },
  statusText_suspended: {
    color: '#475569',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    flexBasis: 190,
    flexGrow: 1,
  },
  detailIcon: {
    paddingTop: 2,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 5,
  },
  detailValue: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  extraRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 15,
  },
  extraLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  extraValue: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  verificationSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 15,
    marginTop: 18,
  },
  verificationHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  verificationTitle: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  documentName: {
    color: '#475569',
    fontSize: 12,
    textTransform: 'capitalize',
    flexShrink: 1,
  },
  documentStatus: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  bankLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 9,
    paddingHorizontal: 17,
    paddingVertical: 12,
  },
  approveButton: {
    backgroundColor: '#15803D',
  },
  approveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rejectButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  rejectText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
  },
  completedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  completedText: {
    color: '#475569',
    fontSize: 12,
    flex: 1,
  },
  resetText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
});
