
import React, { useState } from 'react';
import { ROUTES } from '@/routes';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  UserCheck,
  Truck,
  Bike,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
} from 'lucide-react';

import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { DEMO_PLANS, DEMO_SERVICES } from '@/mocks/services';

import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { AppFooter } from '@/components/layout/AppFooter';
import { AnimatedHeroGraphic } from '@/components/landing/AnimatedHeroGraphic';

import {
  PrimaryButton,
  SecondaryButton,
} from '@/components/common/Buttons';

import { StatusBadge } from '@/components/common/StatusBadge';
import { ModalDialog } from '@/components/common/ModalDialog';

// Add the official SUBIDHA app download URL when it becomes available.
const FUTURE_APP_DOWNLOAD_URL: string | null = null;

export default function LandingPage() {
  const { mode, colors } = useAppTheme();
  const { setSelectedRole, showToast } = useAppState();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const isWide = width >= 960;

  const [downloadModalVisible, setDownloadModalVisible] =
    useState(false);

  // Soft pastel card tints for Light Mode.
  const pastelTints = [
    '#EFF6FF',
    '#ECFDF5',
    '#FEF3C7',
    '#F3E8FF',
    '#FCE7F3',
    '#E0F2FE',
  ];

  const handleTriggerAppDownload = () => {
    setDownloadModalVisible(true);
  };

  const handleConfirmDownloadRedirect = () => {
    if (!FUTURE_APP_DOWNLOAD_URL) {
      setDownloadModalVisible(false);

      showToast(
        'The SUBIDHA mobile app is coming soon. Please use our website for now.',
      );

      return;
    }

    Linking.openURL(FUTURE_APP_DOWNLOAD_URL).catch(() => {
      showToast(
        'Unable to open the app download link. Please try again.',
      );
    });

    setDownloadModalVisible(false);
  };

  const handleRoleLogin = (
    role: 'customer' | 'business' | 'rider',
  ) => {
    setSelectedRole(role);

    switch (role) {
      case 'customer':
        navigate(ROUTES.auth.login.customer);
        break;

      case 'business':
        navigate(ROUTES.auth.login.business);
        break;

      case 'rider':
        navigate(ROUTES.auth.login.rider);
        break;
    }
  };

  const handleRiderSignup = () => {
    setSelectedRole('rider');
    navigate(ROUTES.auth.signup.rider);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <PublicNavbar />

      {/* HERO SECTION */}
      <View
        style={[
          styles.section,
          { paddingTop: isWide ? 56 : 32 },
        ]}
      >
        <View
          style={[
            styles.heroGrid,
            {
              flexDirection: isWide ? 'row' : 'column',
            },
          ]}
        >
          <View
            style={[
              styles.heroLeft,
              { flex: isWide ? 1.1 : undefined },
            ]}
          >
            <StatusBadge label="SUBIDHA • PERSONAL CONCIERGE & LOGISTICS" />

            <Text
              style={[
                styles.heroHeadline,
                {
                  color: colors.primaryText,
                  fontSize: isWide ? 48 : 34,
                  lineHeight: isWide ? 56 : 42,
                },
              ]}
            >
              Essential Support. Wherever Life Takes You.
            </Text>

            <Text
              style={[
                styles.heroSubtitle,
                { color: colors.secondaryText },
              ]}
            >
              Reliable personal assistance, trusted field support,
              and dedicated business logistics — all in one place.
            </Text>

            <View style={styles.ctaRow}>
              <PrimaryButton
                label="Download Mobile App"
                onPress={handleTriggerAppDownload}
              />

              <SecondaryButton
                label="Explore Services"
                onPress={() => navigate(ROUTES.services)}
              />
            </View>
          </View>

          <View
            style={{
              flex: isWide ? 0.95 : undefined,
              width: '100%',
            }}
          >
            <AnimatedHeroGraphic />
          </View>
        </View>
      </View>

      {/* 1. OUR MISSION */}
      <View
        style={[
          styles.bandSection,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.sectionInner}>
          <Text
            style={[
              styles.eyebrow,
              { color: colors.primaryAccent },
            ]}
          >
            01 • OUR MISSION
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: colors.primaryText },
            ]}
          >
            Making essential everyday assistance structured,
            dignified, and dependable.
          </Text>

          <Text
            style={[
              styles.sectionLead,
              { color: colors.secondaryText },
            ]}
          >
            Whether an elder family member needs an escort for a
            routine checkup, a traveler needs local guidance, or a
            neighborhood pharmacy needs predictable daily dispatches,
            SUBIDHA bridges personal care and field logistics through
            subscription simplicity.
          </Text>
        </View>
      </View>

      {/* 2. CUSTOMER, BUSINESS AND RIDER EXPERIENCES */}
      <View style={styles.section}>
        <Text
          style={[
            styles.eyebrow,
            { color: colors.primaryAccent },
          ]}
        >
          02 • CHOOSE YOUR SUBIDHA EXPERIENCE
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText },
          ]}
        >
          Three dedicated experiences for Individuals, Businesses,
          and Riders
        </Text>

        <Text
          style={[
            styles.sectionLead,
            { color: colors.secondaryText },
          ]}
        >
          Whether you need assistance, manage business operations,
          or want to join our rider network, choose the experience
          that fits you.
        </Text>

        <View style={styles.twoColGrid}>
          {/* CUSTOMER CARD */}
          <View
            style={[
              styles.featureCard,
              {
                backgroundColor:
                  mode === 'light'
                    ? '#ECFDF5'
                    : colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <UserCheck
              size={28}
              color={colors.primaryAccent}
            />

            <Text
              style={[
                styles.cardTitle,
                { color: colors.primaryText },
              ]}
            >
              For Customers & Families
            </Text>

            <Text
              style={[
                styles.cardBody,
                { color: colors.secondaryText },
              ]}
            >
              Book personal assistance, non-clinical medical escorts,
              banking help, tourist guidance, and household errands
              with clear status visibility.
            </Text>

            <PrimaryButton
              label="Continue as Customer"
              fullWidth
              onPress={() => handleRoleLogin('customer')}
            />
          </View>

          {/* BUSINESS CARD */}
          <View
            style={[
              styles.featureCard,
              {
                backgroundColor:
                  mode === 'light'
                    ? '#EFF6FF'
                    : colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <Truck
              size={28}
              color={colors.primaryAccent}
            />

            <Text
              style={[
                styles.cardTitle,
                { color: colors.primaryText },
              ]}
            >
              For Businesses & Partners
            </Text>

            <Text
              style={[
                styles.cardBody,
                { color: colors.secondaryText },
              ]}
            >
              Coordinate daily retail deliveries, pharmacy runs,
              inter-branch transfers, and field agent queues from
              a centralized operations console.
            </Text>

            <SecondaryButton
              label="Continue as Business Partner"
              fullWidth
              onPress={() => handleRoleLogin('business')}
            />
          </View>

          {/* RIDER CARD */}
          <View
            style={[
              styles.featureCard,
              {
                backgroundColor:
                  mode === 'light'
                    ? '#F0FDF4'
                    : colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <Bike
              size={28}
              color={colors.primaryAccent}
            />

            <StatusBadge label="RIDER NETWORK" />

            <Text
              style={[
                styles.cardTitle,
                { color: colors.primaryText },
              ]}
            >
              For Delivery Riders
            </Text>

            <Text
              style={[
                styles.cardBody,
                { color: colors.secondaryText },
              ]}
            >
              Apply to join SUBIDHA as a rider, submit your
              application details, and access delivery tasks and
              earnings after approval.
            </Text>

            <PrimaryButton
              label="Continue as Rider"
              fullWidth
              onPress={() => handleRoleLogin('rider')}
            />

            <SecondaryButton
              label="Register as Rider"
              fullWidth
              onPress={handleRiderSignup}
            />
          </View>
        </View>
      </View>

      {/* 3. OUR SERVICES */}
      <View style={styles.section}>
        <Text
          style={[
            styles.eyebrow,
            { color: colors.primaryAccent },
          ]}
        >
          03 • OUR SERVICES
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText },
          ]}
        >
          Illustrative Service Categories
        </Text>

        <View style={styles.threeColGrid}>
          {DEMO_SERVICES.map((srv, idx) => (
            <View
              key={srv.id}
              style={[
                styles.serviceCard,
                {
                  backgroundColor:
                    mode === 'light'
                      ? pastelTints[idx % pastelTints.length]
                      : colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <StatusBadge label={srv.category} />

              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.primaryText },
                ]}
              >
                {srv.title}
              </Text>

              <Text
                style={[
                  styles.cardBody,
                  { color: colors.secondaryText },
                ]}
              >
                {srv.shortDescription}
              </Text>

              <Text
                style={[
                  styles.metaNote,
                  { color: colors.primaryAccent },
                ]}
              >
                Est. Window: {srv.estimatedDuration}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 4. HOW IT WORKS */}
      <View
        style={[
          styles.bandSection,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.sectionInner}>
          <Text
            style={[
              styles.eyebrow,
              { color: colors.primaryAccent },
            ]}
          >
            04 • HOW IT WORKS
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: colors.primaryText },
            ]}
          >
            Four predictable steps from request to completion
          </Text>

          <View style={styles.fourColGrid}>
            {[
              {
                step: 'Step 01',
                title: 'Choose a Service',
                desc: 'Select personal assistance, escort support, an errand, or a business dispatch slot.',
              },
              {
                step: 'Step 02',
                title: 'Request Assistance',
                desc: 'Specify preferred date, time window, pickup address, and clear instructions.',
              },
              {
                step: 'Step 03',
                title: 'Track Progress',
                desc: 'Monitor simulated request states from Scheduled to In Progress in your dashboard.',
              },
              {
                step: 'Step 04',
                title: 'Review Completion',
                desc: 'Verify task completion and any itemized third-party store receipts.',
              },
            ].map((item) => (
              <View
                key={item.step}
                style={[
                  styles.stepBox,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.eyebrow,
                    { color: colors.primaryAccent },
                  ]}
                >
                  {item.step}
                </Text>

                <Text
                  style={[
                    styles.cardTitle,
                    { color: colors.primaryText },
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.cardBody,
                    { color: colors.secondaryText },
                  ]}
                >
                  {item.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 5 & 6. SUBSCRIPTION PLANS AND PRICING */}
      <View style={styles.section}>
        <Text
          style={[
            styles.eyebrow,
            { color: colors.primaryAccent },
          ]}
        >
          05 & 06 • SUBSCRIPTION PLANS & TRANSPARENT PRICING
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText },
          ]}
        >
          Illustrative Membership Tiers & Itemized Expense Policy
        </Text>

        <Text
          style={[
            styles.sectionLead,
            { color: colors.secondaryText },
          ]}
        >
          All plans below are illustrative demo tiers. Subscriptions
          cover SUBIDHA coordination and agent allocation, while
          external third-party expenses (store goods, tickets,
          diagnostic fees, or tolls) are always itemized separately
          at actual cost.
        </Text>

        <View style={styles.twoColGrid}>
          {DEMO_PLANS.map((plan) => (
            <View
              key={plan.id}
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <StatusBadge
                label={plan.badge || plan.audience}
              />

              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.primaryText },
                ]}
              >
                {plan.name}
              </Text>

              <Text
                style={[
                  styles.priceText,
                  { color: colors.primaryAccent },
                ]}
              >
                {plan.priceDisplay}{' '}
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.secondaryText,
                  }}
                >
                  {plan.billingPeriod}
                </Text>
              </Text>

              <Text
                style={[
                  styles.cardBody,
                  { color: colors.secondaryText },
                ]}
              >
                {plan.description}
              </Text>

              {plan.features.map((feature) => (
                <View
                  key={feature}
                  style={styles.bulletRow}
                >
                  <CheckCircle2
                    size={15}
                    color={colors.primaryAccent}
                  />

                  <Text
                    style={[
                      styles.bulletText,
                      { color: colors.primaryText },
                    ]}
                  >
                    {feature}
                  </Text>
                </View>
              ))}

              <View
                style={[
                  styles.policyBox,
                  {
                    backgroundColor: colors.secondaryBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <FileText
                  size={14}
                  color={colors.secondaryAccent}
                />

                <Text
                  style={[
                    styles.policyText,
                    { color: colors.secondaryText },
                  ]}
                >
                  {plan.externalExpensePolicy}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 7. SAFETY AND TRUST */}
      <View
        style={[
          styles.bandSection,
          {
            backgroundColor: colors.secondaryBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.sectionInner}>
          <Text
            style={[
              styles.eyebrow,
              { color: colors.primaryAccent },
            ]}
          >
            07 • SAFETY & TRUST ARCHITECTURE
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: colors.primaryText },
            ]}
          >
            Designed around accountability, identity verification,
            and family visibility
          </Text>

          <View style={styles.threeColGrid}>
            <View
              style={[
                styles.serviceCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <ShieldCheck
                size={24}
                color={colors.primaryAccent}
              />

              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.primaryText },
                ]}
              >
                Agent Assignment Codes
              </Text>

              <Text
                style={[
                  styles.cardBody,
                  { color: colors.secondaryText },
                ]}
              >
                Every scheduled visit displays an assigned agent
                identifier before arrival so members know who is
                assisting them.
              </Text>
            </View>

            <View
              style={[
                styles.serviceCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Clock
                size={24}
                color={colors.primaryAccent}
              />

              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.primaryText },
                ]}
              >
                Milestone Check-Ins
              </Text>

              <Text
                style={[
                  styles.cardBody,
                  { color: colors.secondaryText },
                ]}
              >
                Clear status transitions from Requested to
                Scheduled, In Progress, and Completed keep family
                members and managers informed.
              </Text>
            </View>

            <View
              style={[
                styles.serviceCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <HelpCircle
                size={24}
                color={colors.sos}
              />

              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.primaryText },
                ]}
              >
                Emergency Contact & SOS Protocol
              </Text>

              <Text
                style={[
                  styles.cardBody,
                  { color: colors.secondaryText },
                ]}
              >
                Dedicated SOS confirmation workflow in the Customer
                Dashboard. This is simulated in the frontend
                prototype and does not contact real emergency
                dispatch.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 8. INTERACTIVE DEMO PREVIEW */}
      <View style={styles.section}>
        <Text
          style={[
            styles.eyebrow,
            { color: colors.primaryAccent },
          ]}
        >
          08 • INTERACTIVE DEMO PREVIEW
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText },
          ]}
        >
          Explore the Customer, Business Experiences
        </Text>

        <View style={styles.twoColGrid}>
          {/* CUSTOMER DEMO */}
          <View
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <StatusBadge label="DEMO CUSTOMER PORTAL" />

            <Text
              style={[
                styles.cardTitle,
                { color: colors.primaryText },
              ]}
            >
              Customer Concierge Dashboard
            </Text>

            <Text
              style={[
                styles.cardBody,
                { color: colors.secondaryText },
              ]}
            >
              Sign in with demo phone +91 9876543210 (OTP: 123456)
              to test booking creation, active request tracking, and
              the simulated SOS modal.
            </Text>

            <PrimaryButton
              label="Launch Customer Login"
              fullWidth
              onPress={() => handleRoleLogin('customer')}
            />
          </View>

          {/* BUSINESS DEMO */}
          <View
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <StatusBadge label="DEMO BUSINESS CONSOLE" />

            <Text
              style={[
                styles.cardTitle,
                { color: colors.primaryText },
              ]}
            >
              Business Operations & Dispatch Dashboard
            </Text>

            <Text
              style={[
                styles.cardBody,
                { color: colors.secondaryText },
              ]}
            >
              Sign in with demo phone +91 9876501234 (OTP: 123456)
              to dispatch new tasks, filter queues, assign field
              agents, and monitor capacity.
            </Text>

            <SecondaryButton
              label="Launch Business Login"
              fullWidth
              onPress={() => handleRoleLogin('business')}
            />
          </View>

          {/* RIDER DEMO */}
          <View
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <StatusBadge label="RIDER APPLICATION PORTAL" />

            <Text
              style={[
                styles.cardTitle,
                { color: colors.primaryText },
              ]}
            >
              Rider Application & Login
            </Text>

            <Text
              style={[
                styles.cardBody,
                { color: colors.secondaryText },
              ]}
            >
              Already submitted a Rider application? Sign in with
              the same phone number used during registration.
              New riders can submit an application for review.
              Rider account data is currently stored in memory
              for this prototype.
            </Text>

            <SecondaryButton
              label="Launch Rider Login"
              fullWidth
              onPress={() => handleRoleLogin('rider')}
            />

            <PrimaryButton
              label="Register as Rider"
              fullWidth
              onPress={handleRiderSignup}
            />
          </View>
        </View>
      </View>

      {/* 9. FAQ */}
      <View style={styles.section}>
        <Text
          style={[
            styles.eyebrow,
            { color: colors.primaryAccent },
          ]}
        >
          09 • FREQUENTLY ASKED QUESTIONS
        </Text>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText },
          ]}
        >
          Common Questions About SUBIDHA
        </Text>

        <View style={styles.twoColGrid}>
          {[
            {
              q: 'Can I use the same login for Customer and Business dashboards?',
              a: 'No. Customer and Business accounts are separated by role. A mobile number must be registered specifically for that role to access its portal.',
            },
            {
              q: 'How are third-party purchases or tickets handled during an errand?',
              a: 'Your subscription covers SUBIDHA coordination and field assistance. External store purchases, medicines, and transit fares are billed transparently at actual cost.',
            },
            {
              q: 'Is real SMS or emergency dispatch active in this prototype?',
              a: 'No. This frontend uses demo data and a demo OTP (123456). It must be connected to a secure backend and an OTP provider before production use.',
            },
            {
              q: 'What happens if I enter an unregistered mobile number?',
              a: 'SUBIDHA displays a confirmation dialog and lets you proceed to the matching registration form with your phone number prefilled.',
            },
            {
              q: 'Can I register as a Rider?',
              a: 'Yes. Open Rider Login or choose Register as Rider. Your application remains pending until the approval workflow is implemented and your application is approved.',
            },
            {
              q: 'Is Rider registration data saved permanently?',
              a: 'Not yet. The current prototype stores Rider application data in browser memory. Persistent backend storage is required before real-world use.',
            },
          ].map((faq) => (
            <View
              key={faq.q}
              style={[
                styles.serviceCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.primaryText },
                ]}
              >
                {faq.q}
              </Text>

              <Text
                style={[
                  styles.cardBody,
                  { color: colors.secondaryText },
                ]}
              >
                {faq.a}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 10. FOOTER */}
      <AppFooter />

      {/* FUTURE MOBILE APP DOWNLOAD MODAL */}
      <ModalDialog
        visible={downloadModalVisible}
        variant="success"
        title="Download the SUBIDHA Mobile App"
        description="The mobile app is planned for a future release. You can continue using the SUBIDHA website for now."
        primaryLabel="Check Download"
        secondaryLabel="Continue on Web"
        onPrimaryPress={handleConfirmDownloadRedirect}
        onSecondaryPress={() => setDownloadModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    maxWidth: 1320,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  bandSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 48,
    paddingHorizontal: 20,
  },

  sectionInner: {
    maxWidth: 1320,
    width: '100%',
    alignSelf: 'center',
  },

  heroGrid: {
    gap: 36,
    alignItems: 'center',
  },

  heroLeft: {
    gap: 18,
  },

  heroHeadline: {
    fontWeight: '800',
    letterSpacing: -0.6,
  },

  heroSubtitle: {
    fontSize: 18,
    lineHeight: 28,
    maxWidth: 600,
  },

  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
  },

  sectionLead: {
    fontSize: 16,
    lineHeight: 26,
    maxWidth: 820,
    marginBottom: 24,
  },

  twoColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 16,
  },

  threeColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 16,
  },

  fourColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 20,
  },

  featureCard: {
    flex: 1,
    minWidth: 280,
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    gap: 12,
  },

  serviceCard: {
    flex: 1,
    minWidth: 280,
    borderRadius: 16,
    borderWidth: 1,
    padding: 22,
    gap: 10,
  },

  stepBox: {
    flex: 1,
    minWidth: 230,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
  },

  cardBody: {
    fontSize: 14,
    lineHeight: 22,
  },

  metaNote: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },

  priceText: {
    fontSize: 26,
    fontWeight: '800',
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  bulletText: {
    fontSize: 13,
    flex: 1,
  },

  policyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
  },

  policyText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
});
