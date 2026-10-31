import React, { useState } from 'react';
import { ROUTES } from '@/routes';

import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import { useNavigate, useLocation } from 'react-router-dom';

import {
  Menu,
  X,
  Home,
  FileText,
  CreditCard,
  User,
  MapPin,
  Navigation,
  ShieldCheck,
  LogOut,
  ShieldAlert,
  Truck,
  Smartphone,
  Search,
} from 'lucide-react';

import { useAppTheme } from '@/context/ThemeContext';
import {
  useAppState,
  type LocationPermissionStatus,
} from '@/context/AppStateContext';

import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { StatusBadge } from '@/components/common/StatusBadge';

export interface NavItemConfig {
  label: string;
  href: string;
  icon?: 'home' | 'tasks' | 'bills' | 'profile' | 'fleet';
}

export interface DashboardShellProps {
  roleLabel: string;
  navItems: NavItemConfig[];
  bottomGridItems?: NavItemConfig[];
  maxFrameWidth?: number;
  children: React.ReactNode;
  onTriggerSos?: () => void;
  showLocationPromptOnHome?: boolean;
  locationPromptPath?: string;
}

const DEFAULT_LOCATION = '42 Elm Street, Block C';

export const DashboardShell: React.FC<DashboardShellProps> = ({
  roleLabel,
  navItems,
  bottomGridItems,
  maxFrameWidth = 1320,
  children,
  onTriggerSos,
  showLocationPromptOnHome = true,
  locationPromptPath = ROUTES.rider.dashboard,
}) => {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const {
    user,
    logoutUser,
    showToast,
    locationPermission,
    userLocationLabel,
    setLocationPermission,
  } = useAppState();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [customAddress, setCustomAddress] =
    useState(DEFAULT_LOCATION);

  const footerItems = bottomGridItems ?? navItems.slice(0, 4);

  const updateLocationPermission = (
    status: LocationPermissionStatus,
    address?: string
  ) => {
    setLocationPermission(status, address);
    setManualMode(false);
  };

  const openLocationPrompt = () => {
    if (locationPermission !== 'prompt') {
      setManualMode(false);
      updateLocationPermission('prompt');
    }
  };

  const handleLogout = async () => {
    setDrawerOpen(false);

    try {
      await logoutUser();
      navigate(ROUTES.home, { replace: true });
    } catch {
      showToast('Unable to sign out. Please try again.');
    }
  };

  const handleDownloadApp = () => {
    showToast(
      'The SUBIDHA mobile app is coming soon. Please use our website for now.'
    );
  };

  const renderNavIcon = (
    iconName: NavItemConfig['icon'],
    color: string
  ) => {
    switch (iconName) {
      case 'home':
        return <Home size={21} color={color} />;
      case 'tasks':
        return <FileText size={21} color={color} />;
      case 'bills':
        return <CreditCard size={21} color={color} />;
      case 'fleet':
        return <Truck size={21} color={color} />;
      case 'profile':
      default:
        return <User size={21} color={color} />;
    }
  };

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Shared application header */}
      <View
        style={[
          styles.topHeader,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.topHeaderInner}>
          <View style={styles.headerLeft}>
            <Pressable
              onPress={() => setDrawerOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Open navigation menu"
              style={[
                styles.menuButton,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Menu size={22} color={colors.primaryText} />
            </Pressable>

            <AppLogo size={isDesktop ? 'md' : 'sm'} />

            {isDesktop && (
              <Pressable
                onPress={openLocationPrompt}
                style={[
                  styles.desktopLocationBox,
                  { borderLeftColor: colors.border },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Change location"
              >
                <Text
                  style={[
                    styles.deliveryEtaText,
                    { color: colors.primaryText },
                  ]}
                >
                  Assistant ETA: 11 mins
                </Text>

                <View style={styles.locRowInline}>
                  <MapPin
                    size={14}
                    color={colors.primaryAccent}
                  />

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.locAddressText,
                      { color: colors.secondaryText },
                    ]}
                  >
                    {userLocationLabel} ▾
                  </Text>
                </View>
              </Pressable>
            )}
          </View>

          {isDesktop && (
            <View
              style={[
                styles.desktopSearchBar,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Search
                size={17}
                color={colors.secondaryText}
              />

              <Text
                numberOfLines={1}
                style={{
                  color: colors.secondaryText,
                  fontSize: 13,
                }}
              >
                Search services, deliveries, or tasks...
              </Text>
            </View>
          )}

          <View style={styles.headerRight}>
            {isDesktop && (
              <Pressable
                onPress={handleDownloadApp}
                style={[
                  styles.downloadAppHeaderBtn,
                  {
                    backgroundColor: colors.badgeBg,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Smartphone
                  size={16}
                  color={colors.primaryAccent}
                />

                <Text
                  style={{
                    color: colors.primaryAccent,
                    fontSize: 12,
                    fontWeight: '800',
                  }}
                >
                  Download App
                </Text>
              </Pressable>
            )}

            <ThemeToggle />
          </View>
        </View>
      </View>

      {/* Mobile location strip */}
      {!isDesktop && (
        <Pressable
          onPress={openLocationPrompt}
          accessibilityRole="button"
          accessibilityLabel="Change delivery location"
          style={[
            styles.mobileLocationBar,
            {
              backgroundColor: colors.secondaryBackground,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.mobileLocationCopy}>
            <Text
              style={[
                styles.mobileEtaTitle,
                { color: colors.primaryText },
              ]}
            >
              Assistance in 11 minutes
            </Text>

            <View style={styles.mobileAddressRow}>
              <MapPin
                size={13}
                color={colors.primaryAccent}
              />

              <Text
                numberOfLines={1}
                style={[
                  styles.mobileLocSub,
                  { color: colors.secondaryText },
                ]}
              >
                {userLocationLabel} ▾
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.mobileUserBadge,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <User size={19} color={colors.primaryText} />
          </View>
        </Pressable>
      )}

      {/* Main content and desktop sidebar */}
      <View style={styles.bodyWrapper}>
        {isDesktop && (
          <View
            style={[
              styles.desktopSidebar,
              {
                backgroundColor: colors.secondaryBackground,
                borderRightColor: colors.border,
              },
            ]}
          >
            <View>
              <View
                style={[
                  styles.sidebarProfileBox,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <StatusBadge label={roleLabel} />

                <Text
                  style={[
                    styles.sidebarUserName,
                    { color: colors.primaryText },
                  ]}
                  numberOfLines={1}
                >
                  {user
                    ? user.role === 'business'
                      ? user.businessName
                      : user.fullName
                    : 'Member'}
                </Text>

                {user && (
                  <Text
                    style={{
                      color: colors.secondaryText,
                      fontSize: 12,
                    }}
                  >
                    +91 {user.phone} • {user.city}
                  </Text>
                )}
              </View>

              <View style={styles.desktopNavList}>
                {navItems.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Pressable
                      key={item.href}
                      onPress={() => navigate(item.href)}
                      accessibilityRole="button"
                      accessibilityState={{
                        selected: active,
                      }}
                      style={[
                        styles.desktopNavItem,
                        {
                          backgroundColor: active
                            ? colors.cardBackground
                            : 'transparent',
                          borderColor: active
                            ? colors.primaryAccent
                            : 'transparent',
                        },
                      ]}
                    >
                      {renderNavIcon(
                        item.icon,
                        active
                          ? colors.primaryAccent
                          : colors.secondaryText
                      )}

                      <Text
                        style={{
                          color: active
                            ? colors.primaryAccent
                            : colors.primaryText,
                          fontWeight: active ? '800' : '600',
                          fontSize: 14,
                        }}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Desktop sidebar footer */}
            <View
              style={[
                styles.sidebarFooter,
                { borderTopColor: colors.border },
              ]}
            >
              {onTriggerSos && (
                <Pressable
                  onPress={onTriggerSos}
                  style={[
                    styles.sosSidebarBtn,
                    { backgroundColor: colors.sos },
                  ]}
                >
                  <ShieldAlert
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text style={styles.sosSidebarText}>
                    Emergency SOS
                  </Text>
                </Pressable>
              )}

              <Pressable
                onPress={handleDownloadApp}
                style={[
                  styles.sosSidebarBtn,
                  { backgroundColor: colors.primaryAccent },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Download Mobile App"
              >
                <Smartphone size={17} color="#FFFFFF" />
                <Text style={styles.sosSidebarText}>
                  Download Mobile App
                </Text>
              </Pressable>

              <Pressable
                onPress={handleLogout}
                style={styles.logoutSidebarBtn}
              >
                <LogOut size={17} color={colors.sos} />

                <Text
                  style={{
                    color: colors.sos,
                    fontWeight: '700',
                    fontSize: 13,
                  }}
                >
                  Sign Out
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={[
            styles.mainScrollContent,
            {
              paddingHorizontal: isDesktop ? 32 : 18,
              paddingTop: isDesktop ? 28 : 18,
              paddingBottom: isDesktop ? 28 : 28,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.wideContainer,
              { maxWidth: maxFrameWidth },
            ]}
          >
            {children}
          </View>
        </ScrollView>
      </View>

      {/* Fixed mobile navigation */}
      {!isDesktop && (
        <View
          style={[
            styles.bottomFooterGrid,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          {footerItems.map((item) => {
            const active =
              pathname === item.href ||
              (pathname.startsWith(item.href + '/') &&
                item.href !== ROUTES.home);

            const tint = active
              ? colors.primaryAccent
              : colors.secondaryText;

            return (
              <Pressable
                key={item.href}
                onPress={() => navigate(item.href)}
                style={styles.footerGridCell}
                accessibilityRole="tab"
                accessibilityState={{
                  selected: active,
                }}
              >
                <View
                  style={[
                    styles.footerIconBox,
                    active && {
                      backgroundColor: colors.badgeBg,
                    },
                  ]}
                >
                  {renderNavIcon(item.icon, tint)}
                </View>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.footerGridLabel,
                    {
                      color: tint,
                      fontWeight: active ? '800' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Navigation drawer */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View
          style={[
            styles.drawerBackdrop,
            { backgroundColor: colors.overlay },
          ]}
        >
          <View
            style={[
              styles.drawerPanel,
              {
                backgroundColor: colors.background,
                borderRightColor: colors.border,
              },
            ]}
          >
            <View>
              <View style={styles.drawerHeader}>
                <AppLogo size="md" disableLink />

                <Pressable
                  onPress={() => setDrawerOpen(false)}
                  style={[
                    styles.closeBtn,
                    { borderColor: colors.border },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Close navigation"
                >
                  <X
                    size={20}
                    color={colors.primaryText}
                  />
                </Pressable>
              </View>

              <View
                style={[
                  styles.sidebarProfileBox,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <StatusBadge label={roleLabel} />

                <Text
                  style={[
                    styles.sidebarUserName,
                    { color: colors.primaryText },
                  ]}
                >
                  {user
                    ? user.role === 'business'
                      ? user.businessName
                      : user.fullName
                    : 'Guest'}
                </Text>

                {user && (
                  <Text
                    style={{
                      color: colors.secondaryText,
                      fontSize: 12,
                    }}
                  >
                    {user.phone}
                  </Text>
                )}
              </View>

              <Text
                style={[
                  styles.drawerSectionLabel,
                  { color: colors.secondaryText },
                ]}
              >
                MENU
              </Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.desktopNavList}>
                  {navItems.map((item) => {
                    const active = pathname === item.href;

                    return (
                      <Pressable
                        key={item.href}
                        onPress={() => {
                          setDrawerOpen(false);
                          navigate(item.href);
                        }}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: active,
                        }}
                        style={[
                          styles.desktopNavItem,
                          {
                            backgroundColor: active
                              ? colors.cardBackground
                              : 'transparent',
                            borderColor: active
                              ? colors.primaryAccent
                              : 'transparent',
                          },
                        ]}
                      >
                        {renderNavIcon(
                          item.icon,
                          active
                            ? colors.primaryAccent
                            : colors.secondaryText
                        )}

                        <Text
                          style={{
                            color: active
                              ? colors.primaryAccent
                              : colors.primaryText,
                            fontWeight: active ? '800' : '600',
                            fontSize: 14,
                          }}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Mobile drawer footer */}
            <View
              style={[
                styles.sidebarFooter,
                { borderTopColor: colors.border },
              ]}
            >
              <Pressable
                onPress={() => {
                  setDrawerOpen(false);
                  handleDownloadApp();
                }}
                style={[
                  styles.sosSidebarBtn,
                  { backgroundColor: colors.primaryAccent },
                ]}
              >
                <Smartphone
                  size={17}
                  color="#FFFFFF"
                />

                <Text style={styles.sosSidebarText}>
                  Download Mobile App
                </Text>
              </Pressable>

              <Pressable
                onPress={handleLogout}
                style={styles.logoutSidebarBtn}
              >
                <LogOut
                  size={17}
                  color={colors.sos}
                />

                <Text
                  style={{
                    color: colors.sos,
                    fontWeight: '700',
                    fontSize: 14,
                  }}
                >
                  Sign Out
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Outside tap only closes the drawer */}
          <Pressable
            style={styles.drawerOutside}
            onPress={() => setDrawerOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Close menu"
          />
        </View>
      </Modal>

      {/* Location permission modal */}
      <Modal
        visible={
          showLocationPromptOnHome &&
          locationPermission === 'prompt' &&
          pathname.replace(/\/+$/, '') ===
            locationPromptPath.replace(/\/+$/, '')
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          updateLocationPermission('denied')
        }
      >
        <View
          style={[
            styles.locBackdrop,
            { backgroundColor: colors.overlay },
          ]}
        >
          <View
            style={[
              styles.locSheet,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.pinCircle,
                { backgroundColor: colors.badgeBg },
              ]}
            >
              <MapPin
                size={32}
                color={colors.primaryAccent}
              />
            </View>

            <Text
              style={[
                styles.locTitle,
                { color: colors.primaryText },
              ]}
            >
              Enable Location Services
            </Text>

            <Text
              style={[
                styles.locSubtitle,
                { color: colors.secondaryText },
              ]}
            >
              SUBIDHA uses your location to help coordinate
              pickups, delivery assignments, and assistance.
              You can also enter an address manually.
            </Text>

            <View
              style={[
                styles.locInfoBox,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.locBulletRow}>
                <Navigation
                  size={17}
                  color={colors.primaryAccent}
                />

                <Text
                  style={[
                    styles.locBulletText,
                    { color: colors.primaryText },
                  ]}
                >
                  Convenient pickup coordination
                </Text>
              </View>

              <View style={styles.locBulletRow}>
                <ShieldCheck
                  size={17}
                  color={colors.primaryAccent}
                />

                <Text
                  style={[
                    styles.locBulletText,
                    { color: colors.primaryText },
                  ]}
                >
                  Location details for assistance requests
                </Text>
              </View>
            </View>

            {manualMode ? (
              <View style={styles.manualWrapper}>
                <TextInput
                  value={customAddress}
                  onChangeText={setCustomAddress}
                  placeholder="Enter your address"
                  placeholderTextColor={colors.secondaryText}
                  style={[
                    styles.manualInput,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.primaryText,
                    },
                  ]}
                />

                <Pressable
                  onPress={() =>
                    updateLocationPermission(
                      'granted',
                      customAddress.trim() || DEFAULT_LOCATION
                    )
                  }
                  style={[
                    styles.allowBtn,
                    { backgroundColor: colors.primaryAccent },
                  ]}
                >
                  <Text style={styles.allowBtnText}>
                    Confirm Address
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setManualMode(false)}
                  style={[
                    styles.manualBtn,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.manualBtnText,
                      { color: colors.primaryText },
                    ]}
                  >
                    Back
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.locButtonStack}>
                <Pressable
                  onPress={() =>
                    updateLocationPermission('granted')
                  }
                  style={[
                    styles.allowBtn,
                    { backgroundColor: colors.primaryAccent },
                  ]}
                >
                  <Navigation
                    size={17}
                    color="#FFFFFF"
                  />

                  <Text style={styles.allowBtnText}>
                    Allow Location
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setManualMode(true)}
                  style={[
                    styles.manualBtn,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.manualBtnText,
                      { color: colors.primaryText },
                    ]}
                  >
                    Enter Address Manually
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    updateLocationPermission('denied')
                  }
                  style={styles.skipLocationBtn}
                >
                  <Text
                    style={[
                      styles.manualBtnText,
                      { color: colors.secondaryText },
                    ]}
                  >
                    Not Now
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DashboardShell;

/* Styles */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
  },

  topHeader: {
    borderBottomWidth: 1,
    width: '100%',
  },

  topHeaderInner: {
    maxWidth: 1420,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },

  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  desktopLocationBox: {
    borderLeftWidth: 1,
    paddingLeft: 16,
    marginLeft: 4,
    maxWidth: 260,
  },

  deliveryEtaText: {
    fontSize: 14,
    fontWeight: '800',
  },

  locRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },

  locAddressText: {
    fontSize: 12,
    flexShrink: 1,
  },

  desktopSearchBar: {
    flex: 1,
    maxWidth: 520,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 0,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },

  downloadAppHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },

  mobileLocationBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  mobileLocationCopy: {
    flex: 1,
    minWidth: 0,
  },

  mobileEtaTitle: {
    fontSize: 15,
    fontWeight: '800',
  },

  mobileAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },

  mobileLocSub: {
    fontSize: 12,
    flex: 1,
  },

  mobileUserBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  bodyWrapper: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'row',
    width: '100%',
  },

  desktopSidebar: {
    width: 260,
    borderRightWidth: 1,
    padding: 20,
    justifyContent: 'space-between',
  },

  sidebarProfileBox: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
    marginBottom: 16,
  },

  sidebarUserName: {
    fontSize: 16,
    fontWeight: '800',
  },

  desktopNavList: {
    gap: 6,
  },

  desktopNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },

  sidebarFooter: {
    borderTopWidth: 1,
    paddingTop: 14,
    gap: 10,
  },

  sosSidebarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 10,
  },

  sosSidebarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },

  logoutSidebarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },

  mainScroll: {
    flex: 1,
    minHeight: 0,
    width: '100%',
  },

  mainScrollContent: {
    width: '100%',
    flexGrow: 1,
  },

  wideContainer: {
    width: '100%',
    alignSelf: 'center',
    minWidth: 0,
  },

  bottomFooterGrid: {
    flexShrink: 0,
    zIndex: 20,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 7,
    paddingBottom: 7,
    paddingHorizontal: 6,
    minHeight: 72,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  footerGridCell: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 1,
  },

  footerIconBox: {
    minWidth: 40,
    height: 36,
    paddingHorizontal: 9,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerGridLabel: {
    fontSize: 12,
    textAlign: 'center',
    includeFontPadding: false,
  },

  drawerBackdrop: {
    flex: 1,
    flexDirection: 'row',
  },

  drawerPanel: {
    width: 320,
    maxWidth: '86%',
    height: '100%',
    borderRightWidth: 1,
    padding: 20,
    justifyContent: 'space-between',
  },

  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },

  drawerSectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 10,
    marginBottom: 12,
  },

  drawerOutside: {
    flex: 1,
  },

  closeBtn: {
    padding: 9,
    borderRadius: 12,
    borderWidth: 1,
  },

  locBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  locSheet: {
    width: '100%',
    maxWidth: 480,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 24,
    paddingBottom: 30,
    alignItems: 'center',
    gap: 12,
  },

  pinCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  locTitle: {
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },

  locSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },

  locInfoBox: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },

  locBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  locBulletText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },

  locButtonStack: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },

  allowBtn: {
    width: '100%',
    minHeight: 48,
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  allowBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  manualBtn: {
    width: '100%',
    minHeight: 46,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  manualBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },

  skipLocationBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  manualWrapper: {
    width: '100%',
    gap: 10,
  },

  manualInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
  },
});