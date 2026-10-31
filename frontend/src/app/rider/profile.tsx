
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {
  UserRound,
  Phone,
  Mail,
  MapPin,
  Bike,
  ShieldCheck,
  FileText,
  Pencil,
  Save,
  X,
  CheckCircle2,
  Clock3,
  Star,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

type RiderProfileData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  vehicleType: string;
  vehicleNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
};

const INITIAL_PROFILE: RiderProfileData = {
  fullName: 'Rahul Sharma',
  phone: '+91 98765 43210',
  email: 'rahul.rider@example.com',
  address: 'Jamshedpur, Jharkhand',
  vehicleType: 'Motorcycle',
  vehicleNumber: 'JH-05-AB-1234',
  emergencyContact: 'Family Contact',
  emergencyPhone: '+91 98765 00000',
};

export default function RiderProfilePage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  const [profile, setProfile] =
    useState<RiderProfileData>(INITIAL_PROFILE);
  const [draft, setDraft] =
    useState<RiderProfileData>(INITIAL_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [notice, setNotice] = useState('');

  function updateDraft(
    field: keyof RiderProfileData,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEditing() {
    setDraft({ ...profile });
    setNotice('');
    setIsEditing(true);
  }

  function saveProfile() {
    if (!draft.fullName.trim()) {
      setNotice('Please enter your full name.');
      return;
    }

    if (!draft.phone.trim()) {
      setNotice('Please enter your phone number.');
      return;
    }

    setProfile({ ...draft });
    setIsEditing(false);
    setNotice('Your profile changes have been saved in this demo.');
  }

  function cancelEditing() {
    setDraft({ ...profile });
    setIsEditing(false);
    setNotice('');
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
      {/* Heading */}
      <View style={styles.pageHeader}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>RIDER PARTNER</Text>
          <Text style={styles.pageTitle}>My Profile</Text>
          <Text style={styles.pageDescription}>
            Manage your personal information and rider details.
          </Text>
        </View>

        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>DEMO DATA</Text>
        </View>
      </View>

      {/* Profile summary */}
      <View style={styles.profileHero}>
        <View style={styles.avatar}>
          <UserRound size={34} color="#246B50" />
        </View>

        <View style={styles.profileHeroCopy}>
          <Text style={styles.profileName}>{profile.fullName}</Text>
          <Text style={styles.profileRole}>Rider Partner</Text>

          <View style={styles.verifiedBadge}>
            <CheckCircle2 size={14} color="#23784F" />
            <Text style={styles.verifiedText}>Verified rider</Text>
          </View>
        </View>

        <View style={styles.ratingBox}>
          <Star size={17} color="#C18219" />
          <Text style={styles.ratingValue}>4.8</Text>
          <Text style={styles.ratingCaption}>Demo rating</Text>
        </View>
      </View>

      {/* Feedback */}
      {notice ? (
        <View
          style={[
            styles.notice,
            notice.includes('Please') && styles.errorNotice,
          ]}
        >
          {notice.includes('Please') ? (
            <AlertCircle size={18} color="#A34C36" />
          ) : (
            <CheckCircle2 size={18} color="#23784F" />
          )}
          <Text
            style={[
              styles.noticeText,
              notice.includes('Please') && styles.errorNoticeText,
            ]}
          >
            {notice}
          </Text>
        </View>
      ) : null}

      {/* Personal information */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeadingCopy}>
          <Text style={styles.sectionTitle}>
            Personal information
          </Text>
          <Text style={styles.sectionSubtitle}>
            Your basic contact details
          </Text>
        </View>

        {!isEditing ? (
          <Pressable
            onPress={startEditing}
            style={styles.editButton}
            accessibilityRole="button"
          >
            <Pencil size={15} color="#246B50" />
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        ) : (
          <View style={styles.editActions}>
            <Pressable
              onPress={cancelEditing}
              style={styles.cancelButton}
              accessibilityRole="button"
            >
              <X size={16} color="#64756A" />
            </Pressable>

            <Pressable
              onPress={saveProfile}
              style={styles.saveButton}
              accessibilityRole="button"
            >
              <Save size={15} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.detailsCard}>
        <ProfileField
          icon={<UserRound size={19} color="#246B50" />}
          label="Full name"
          value={isEditing ? draft.fullName : profile.fullName}
          editing={isEditing}
          onChangeText={(value) => updateDraft('fullName', value)}
          placeholder="Enter your full name"
        />

        <ProfileField
          icon={<Phone size={19} color="#246B50" />}
          label="Phone number"
          value={isEditing ? draft.phone : profile.phone}
          editing={isEditing}
          onChangeText={(value) => updateDraft('phone', value)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <ProfileField
          icon={<Mail size={19} color="#246B50" />}
          label="Email address"
          value={isEditing ? draft.email : profile.email}
          editing={isEditing}
          onChangeText={(value) => updateDraft('email', value)}
          placeholder="Enter email address"
          keyboardType="email-address"
        />

        <ProfileField
          icon={<MapPin size={19} color="#246B50" />}
          label="City / Address"
          value={isEditing ? draft.address : profile.address}
          editing={isEditing}
          onChangeText={(value) => updateDraft('address', value)}
          placeholder="Enter your city or address"
          last
        />

        {isEditing ? (
          <Text style={styles.editHint}>
            Changes are saved locally for this demo. They will reset
            when the page is refreshed.
          </Text>
        ) : null}
      </View>

      {/* Rider verification */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeadingCopy}>
          <Text style={styles.sectionTitle}>
            Rider verification
          </Text>
          <Text style={styles.sectionSubtitle}>
            Account approval and document status
          </Text>
        </View>
      </View>

      <View style={styles.verificationCard}>
        <View style={styles.verificationIcon}>
          <ShieldCheck size={24} color="#23784F" />
        </View>

        <View style={styles.verificationCopy}>
          <Text style={styles.verificationTitle}>
            Identity verification
          </Text>
          <Text style={styles.verificationDescription}>
            Your demo account is marked as verified.
          </Text>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>Verified</Text>
        </View>
      </View>

      <View style={styles.documentRow}>
        <View style={styles.documentIcon}>
          <FileText size={20} color="#64756A" />
        </View>
        <View style={styles.documentCopy}>
          <Text style={styles.documentTitle}>
            Identity documents
          </Text>
          <Text style={styles.documentDescription}>
            Document uploads and review are not connected yet.
          </Text>
        </View>
        <Clock3 size={17} color="#8A682A" />
      </View>

      {/* Vehicle information */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeadingCopy}>
          <Text style={styles.sectionTitle}>
            Vehicle information
          </Text>
          <Text style={styles.sectionSubtitle}>
            Vehicle used for deliveries
          </Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <ProfileField
          icon={<Bike size={19} color="#246B50" />}
          label="Vehicle type"
          value={isEditing ? draft.vehicleType : profile.vehicleType}
          editing={isEditing}
          onChangeText={(value) => updateDraft('vehicleType', value)}
          placeholder="e.g. Motorcycle, bicycle"
        />

        <ProfileField
          icon={<FileText size={19} color="#246B50" />}
          label="Registration number"
          value={
            isEditing ? draft.vehicleNumber : profile.vehicleNumber
          }
          editing={isEditing}
          onChangeText={(value) =>
            updateDraft('vehicleNumber', value)
          }
          placeholder="Enter registration number"
          last
        />
      </View>

      {/* Emergency contact */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeadingCopy}>
          <Text style={styles.sectionTitle}>
            Emergency contact
          </Text>
          <Text style={styles.sectionSubtitle}>
            Contact to use in an emergency
          </Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <ProfileField
          icon={<UserRound size={19} color="#246B50" />}
          label="Contact name"
          value={
            isEditing
              ? draft.emergencyContact
              : profile.emergencyContact
          }
          editing={isEditing}
          onChangeText={(value) =>
            updateDraft('emergencyContact', value)
          }
          placeholder="Enter contact name"
        />

        <ProfileField
          icon={<Phone size={19} color="#246B50" />}
          label="Contact phone"
          value={
            isEditing ? draft.emergencyPhone : profile.emergencyPhone
          }
          editing={isEditing}
          onChangeText={(value) =>
            updateDraft('emergencyPhone', value)
          }
          placeholder="Enter emergency phone"
          keyboardType="phone-pad"
          last
        />
      </View>

      {/* Account and support */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeadingCopy}>
          <Text style={styles.sectionTitle}>
            Account & support
          </Text>
          <Text style={styles.sectionSubtitle}>
            Help with your rider account
          </Text>
        </View>
      </View>

      <View style={styles.supportCard}>
        <View style={styles.supportIcon}>
          <AlertCircle size={20} color="#246B50" />
        </View>
        <View style={styles.supportCopy}>
          <Text style={styles.supportTitle}>
            Rider support
          </Text>
          <Text style={styles.supportDescription}>
            Need help with your profile or deliveries?
          </Text>
        </View>
        <ChevronRight size={19} color="#819087" />
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          This profile uses sample information for demonstration.
          Verification badges and ratings are not proof of real
          identity verification or actual customer reviews.
        </Text>
      </View>
    </ScrollView>
  );
}

function ProfileField({
  icon,
  label,
  value,
  editing,
  onChangeText,
  placeholder,
  keyboardType,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
  last?: boolean;
}) {
  return (
    <View style={[styles.fieldRow, last && styles.lastFieldRow]}>
      <View style={styles.fieldIcon}>{icon}</View>

      <View style={styles.fieldCopy}>
        <Text style={styles.fieldLabel}>{label}</Text>

        {editing ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#98A39B"
            keyboardType={keyboardType || 'default'}
            autoCapitalize={
              keyboardType === 'email-address' ? 'none' : 'sentences'
            }
            style={styles.fieldInput}
          />
        ) : (
          <Text style={styles.fieldValue}>{value || 'Not provided'}</Text>
        )}
      </View>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
    fontSize: 27,
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
  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: '#EAF4ED',
    borderWidth: 1,
    borderColor: '#D8E9DD',
    borderRadius: 18,
    padding: 17,
    marginBottom: 26,
  },
  avatar: {
    width: 61,
    height: 61,
    flexShrink: 0,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeroCopy: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    color: '#20382B',
    fontSize: 17,
    fontWeight: '800',
  },
  profileRole: {
    color: '#64756A',
    fontSize: 12,
    marginTop: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 9,
  },
  verifiedText: {
    color: '#23784F',
    fontSize: 10,
    fontWeight: '800',
  },
  ratingBox: {
    alignItems: 'center',
    gap: 3,
  },
  ratingValue: {
    color: '#20382B',
    fontSize: 16,
    fontWeight: '800',
  },
  ratingCaption: {
    color: '#819087',
    fontSize: 9,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    backgroundColor: '#EAF4ED',
    borderRadius: 11,
    padding: 12,
    marginBottom: 18,
  },
  errorNotice: {
    backgroundColor: '#FCEDE8',
  },
  noticeText: {
    flex: 1,
    minWidth: 0,
    color: '#246B50',
    fontSize: 12,
    lineHeight: 18,
  },
  errorNoticeText: {
    color: '#A34C36',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 13,
    marginTop: 3,
  },
  sectionHeadingCopy: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    color: '#20382B',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#819087',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF4ED',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  editButtonText: {
    color: '#246B50',
    fontSize: 12,
    fontWeight: '800',
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cancelButton: {
    width: 35,
    height: 35,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#DDE6DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#246B50',
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 2,
    marginBottom: 25,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0ED',
  },
  lastFieldRow: {
    borderBottomWidth: 0,
  },
  fieldIcon: {
    width: 39,
    height: 39,
    flexShrink: 0,
    borderRadius: 11,
    backgroundColor: '#F0F6F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldCopy: {
    flex: 1,
    minWidth: 0,
  },
  fieldLabel: {
    color: '#819087',
    fontSize: 11,
    marginBottom: 5,
  },
  fieldValue: {
    color: '#263C2E',
    fontSize: 13,
    fontWeight: '600',
  },
  fieldInput: {
    color: '#263C2E',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#DDE6DE',
    backgroundColor: '#FAFCFA',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 8,
    outlineStyle: 'none',
  } as any,
  editHint: {
    color: '#819087',
    fontSize: 11,
    lineHeight: 17,
    paddingVertical: 10,
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 15,
    padding: 14,
    marginBottom: 10,
  },
  verificationIcon: {
    width: 43,
    height: 43,
    flexShrink: 0,
    borderRadius: 12,
    backgroundColor: '#EAF4ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationCopy: {
    flex: 1,
    minWidth: 0,
  },
  verificationTitle: {
    color: '#263C2E',
    fontSize: 13,
    fontWeight: '800',
  },
  verificationDescription: {
    color: '#819087',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  statusPill: {
    backgroundColor: '#E6F4EA',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  statusPillText: {
    color: '#23784F',
    fontSize: 10,
    fontWeight: '800',
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 15,
    padding: 14,
    marginBottom: 25,
  },
  documentIcon: {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 11,
    backgroundColor: '#F0F3F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentCopy: {
    flex: 1,
    minWidth: 0,
  },
  documentTitle: {
    color: '#263C2E',
    fontSize: 12,
    fontWeight: '800',
  },
  documentDescription: {
    color: '#819087',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE8',
    borderRadius: 15,
    padding: 14,
  },
  supportIcon: {
    width: 41,
    height: 41,
    flexShrink: 0,
    borderRadius: 12,
    backgroundColor: '#EAF4ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportCopy: {
    flex: 1,
    minWidth: 0,
  },
  supportTitle: {
    color: '#263C2E',
    fontSize: 13,
    fontWeight: '800',
  },
  supportDescription: {
    color: '#819087',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  disclaimer: {
    backgroundColor: '#F0F2F0',
    borderRadius: 11,
    padding: 12,
    marginTop: 17,
  },
  disclaimerText: {
    color: '#738078',
    fontSize: 11,
    lineHeight: 17,
  },
});
