import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
  prefixText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  prefixText,
  ...inputProps
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.primaryText }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.sos : colors.border,
          },
        ]}
      >
        {prefixText ? (
          <View style={[styles.prefixBox, { borderRightColor: colors.border }]}>
            <Text style={[styles.prefixText, { color: colors.primaryAccent }]}>
              {prefixText}
            </Text>
          </View>
        ) : null}
        <TextInput
          placeholderTextColor={colors.secondaryText}
          style={[
            styles.input,
            {
              color: colors.primaryText,
              minHeight: inputProps.multiline ? 82 : 46,
            },
          ]}
          {...inputProps}
        />
      </View>
      {error ? (
        <Text style={[styles.error, { color: colors.sos }]}>{error}</Text>
      ) : helperText ? (
        <Text style={[styles.helper, { color: colors.secondaryText }]}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  prefixBox: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRightWidth: 1,
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
  },
  error: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  helper: {
    fontSize: 12,
    marginTop: 5,
  },
});