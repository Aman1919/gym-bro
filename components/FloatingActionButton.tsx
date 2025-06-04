import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Theme } from '@/constants/Theme';
import { Plus } from 'lucide-react-native';

type FloatingActionButtonProps = {
  onPress: () => void;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function FloatingActionButton({
  onPress,
  icon,
  style,
}: FloatingActionButtonProps) {
  return (
    <TouchableOpacity style={[styles.fab, style]} onPress={onPress} activeOpacity={0.8}>
      {icon || <Plus color="#FFFFFF\" size={24} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.accent.BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});