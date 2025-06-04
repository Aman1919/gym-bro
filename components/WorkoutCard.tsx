import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '@/constants/Theme';
import { Workout } from '@/types';
import Card from './Card';
import { formatDate } from '@/utils/helpers';
import { ChevronRight } from 'lucide-react-native';

type WorkoutCardProps = {
  workout: Workout;
  onPress?: () => void;
};

export default function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const exerciseCount = workout.exercises.length;
  
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{workout.title}</Text>
            <Text style={styles.date}>{formatDate(workout.date)}</Text>
          </View>
          {onPress && <ChevronRight size={20} color={Theme.colors.subtext} />}
        </View>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exerciseCount}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {workout.exercises.reduce((total, exercise) => {
                if (exercise.type === 'set' && exercise.sets) {
                  return total + exercise.sets.length;
                }
                return total;
              }, 0)}
            </Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.round(workout.exercises.reduce((total, exercise) => {
                if (exercise.type === 'set' && exercise.sets) {
                  const completedSets = exercise.sets.filter(set => set.completed);
                  return total + completedSets.length;
                }
                return total;
              }, 0) * 100 / Math.max(1, workout.exercises.reduce((total, exercise) => {
                if (exercise.type === 'set' && exercise.sets) {
                  return total + exercise.sets.length;
                }
                return total;
              }, 0)))}%
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
        
        <View style={styles.exercises}>
          {workout.exercises.slice(0, 3).map((exercise, index) => (
            <Text key={exercise.id} style={styles.exerciseText}>
              • {exercise.name}
            </Text>
          ))}
          {exerciseCount > 3 && (
            <Text style={styles.moreText}>+{exerciseCount - 3} more</Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  title: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
  },
  date: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.subtext,
    marginTop: Theme.spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    ...Theme.typography.h4,
    color: Theme.colors.accent.BLUE,
  },
  statLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.subtext,
  },
  exercises: {
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  exerciseText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  moreText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.subtext,
    fontStyle: 'italic',
  },
});