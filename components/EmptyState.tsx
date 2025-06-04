import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@/constants/Theme';
import Button from './Button';
import { Dumbbell } from 'lucide-react-native';

type EmptyStateProps = {
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
};

export default function EmptyState({
  title,
  message,
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon || <Dumbbell size={64} color={Theme.colors.accent.BLUE} style={styles.icon} />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionText && onAction && (
        <Button
          title={actionText}
          onPress={onAction}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  icon: {
    marginBottom: Theme.spacing.lg,
  },
  title: {
    ...Theme.typography.h2,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...Theme.typography.body,
    color: Theme.colors.subtext,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
  },
  button: {
    minWidth: 200,
  },
});