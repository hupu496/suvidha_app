
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { useAppTheme } from '@/context/ThemeContext';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { AppFooter } from '@/components/layout/AppFooter';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function AboutPage() {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      style={[
        styles.scrollView,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={styles.scrollContent}
    >
      <PublicNavbar />

      <View style={styles.container}>
        <StatusBadge label="ABOUT SUBIDHA" />

        <Text
          style={[
            styles.title,
            { color: colors.primaryText },
          ]}
        >
          Built for Dependable Assistance & Accountable Field
          Operations
        </Text>

        <Text
          style={[
            styles.lead,
            { color: colors.secondaryText },
          ]}
        >
          SUBIDHA combines compassionate personal concierge
          support for households with structured local logistics
          for businesses.
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.accent,
              { backgroundColor: colors.primaryAccent },
            ]}
          />

          <View style={styles.cardContent}>
            <Text
              style={[
                styles.sectionHeading,
                { color: colors.primaryText },
              ]}
            >
              Architecture & Backend Readiness
            </Text>

            <Text
              style={[
                styles.body,
                { color: colors.secondaryText },
              ]}
            >
              This frontend uses React Native Web, React, Vite,
              TypeScript, and React Router for the web application.
              Authentication, booking, and task-management
              workflows are organized in typed service modules
              under src/services/ to support integration with a
              Python Django REST Framework and PostgreSQL backend.
            </Text>

            <View
              style={[
                styles.note,
                {
                  backgroundColor: colors.secondaryBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.noteTitle,
                  { color: colors.primaryText },
                ]}
              >
                Current implementation
              </Text>

              <Text
                style={[
                  styles.noteBody,
                  { color: colors.secondaryText },
                ]}
              >
                Backend integration depends on configuring and
                connecting the relevant service modules and API
                endpoints. The frontend alone does not establish
                that authentication, bookings, or task management
                are backed by a live server.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 44,
    gap: 18,
  },
  title: {
    fontSize: 32,
    lineHeight: 41,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  lead: {
    fontSize: 16,
    lineHeight: 26,
    maxWidth: 780,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 12,
  },
  accent: {
    width: 5,
  },
  cardContent: {
    flex: 1,
    padding: 24,
    gap: 14,
  },
  sectionHeading: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    lineHeight: 25,
  },
  note: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 6,
    marginTop: 6,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  noteBody: {
    fontSize: 13,
    lineHeight: 21,
  },
});
