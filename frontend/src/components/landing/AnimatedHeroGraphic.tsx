
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AccessibilityInfo,
} from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { ShieldCheck, Truck, HeartHandshake } from 'lucide-react';

export const AnimatedHeroGraphic: React.FC = () => {
  const { colors } = useAppTheme();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active) {
          setReduceMotion(Boolean(enabled));
        }
      })
      .catch(() => {
        // Keep the default visual state if the preference is unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <svg
        width="100%"
        height="290"
        viewBox="0 0 540 290"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Illustration of a connected concierge and logistics network"
      >
        <defs>
          <linearGradient
            id="subidha-route-gradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={colors.primaryAccent}
              stopOpacity="0.65"
            />
            <stop
              offset="100%"
              stopColor={colors.secondaryAccent}
              stopOpacity="0.15"
            />
          </linearGradient>
        </defs>

        {/* Subtle isometric grid planes */}
        <g opacity="0.32">
          <path
            d="M70 210 L270 110 L470 210 L270 275 Z"
            stroke={colors.border}
            strokeWidth="1.5"
            fill={colors.cardBackground}
          />
          <path
            d="M120 185 L270 110 L420 185 L270 245 Z"
            stroke={colors.primaryAccent}
            strokeWidth="1"
            strokeDasharray="5 5"
          />
        </g>

        {/* Connected route network */}
        <path
          d="M95 190 C180 90, 350 90, 445 180"
          stroke="url(#subidha-route-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M135 215 C235 155, 310 230, 415 145"
          stroke={colors.secondaryAccent}
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        {/* Hub nodes */}
        <circle cx="95" cy="190" r="9" fill={colors.primaryAccent} />
        <circle cx="270" cy="128" r="12" fill={colors.secondaryAccent} />
        <circle cx="445" cy="180" r="9" fill={colors.primaryAccent} />

        <rect
          x="248"
          y="106"
          width="44"
          height="44"
          rx="12"
          stroke={colors.primaryAccent}
          strokeWidth="1.5"
        />
      </svg>

      {/* Individual assistance card */}
      <View
        style={[
          styles.floatingPillLeft,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            transform: [{ translateY: reduceMotion ? 0 : 0 }],
          },
        ]}
      >
        <HeartHandshake size={18} color={colors.primaryAccent} />

        <View>
          <Text style={[styles.pillTitle, { color: colors.primaryText }]}>
            Individual Assistance
          </Text>
          <Text style={[styles.pillSub, { color: colors.secondaryText }]}>
            Escort • Errands • Care
          </Text>
        </View>
      </View>

      {/* Business logistics card */}
      <View
        style={[
          styles.floatingPillRight,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            transform: [{ translateY: reduceMotion ? 0 : 0 }],
          },
        ]}
      >
        <Truck size={18} color={colors.primaryAccent} />

        <View>
          <Text style={[styles.pillTitle, { color: colors.primaryText }]}>
            Business Logistics
          </Text>
          <Text style={[styles.pillSub, { color: colors.secondaryText }]}>
            Fleet • Dispatch • B2B Runs
          </Text>
        </View>
      </View>

      {/* Bottom trust strip */}
      <View
        style={[
          styles.bottomStrip,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <ShieldCheck size={16} color={colors.primaryAccent} />
        <Text style={[styles.stripText, { color: colors.secondaryText }]}>
          Unified Concierge & Field Operations Network (Illustrative Architecture Preview)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  floatingPillLeft: {
    position: 'absolute',
    top: 22,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  floatingPillRight: {
    position: 'absolute',
    bottom: 66,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  pillTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  pillSub: {
    fontSize: 11,
  },
  bottomStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  stripText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
});
