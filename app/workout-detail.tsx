import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Theme } from '@/constants/Theme';
import Header from '@/components/Header';
import { useLocalSearchParams } from 'expo-router';
import { getWorkouts } from '@/utils/db';
import { Workout } from '@/types';
import { formatDate } from '@/utils/helpers';
import ExerciseCard from '@/components/ExerciseCard';
import Card from '@/components/Card';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadWorkout(id);
    }
  }, [id]);

  const loadWorkout = async (workoutId: string) => {
    setLoading(true);
    const workouts = await getWorkouts();
    const foundWorkout = workouts.find(w => w.id === workoutId);
    setWorkout(foundWorkout || null);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Workout Details" showBackButton />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.container}>
        <Header title="Workout Details" showBackButton />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Workout not found</Text>
        </View>
      </View>
    );
  }

  // Calculate workout statistics
  const totalExercises = workout.exercises.length;
  const totalSets = workout.exercises.reduce((count, exercise) => {
    if (exercise.type === 'set' && exercise.sets) {
      return count + exercise.sets.length;
    }
    return count;
  }, 0);
  const completedSets = workout.exercises.reduce((count, exercise) => {
    if (exercise.type === 'set' && exercise.sets) {
      return count + exercise.sets.filter(set => set.completed).length;
    }
    return count;
  }, 0);

  return (
    <View style={styles.container}>
      <Header title="Workout Details" showBackButton />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          <Text style={styles.workoutDate}>{formatDate(workout.date)}</Text>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalExercises}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalSets}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
          
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Exercises</Text>
        {workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            readOnly
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    ...Theme.typography.body,
    color: Theme.colors.subtext,
  },
  headerContainer: {
    marginBottom: Theme.spacing.lg,
  },
  workoutTitle: {
    ...Theme.typography.h1,
    color: Theme.colors.text,
  },
  workoutDate: {
    ...Theme.typography.body,
    color: Theme.colors.subtext,
    marginTop: Theme.spacing.xs,
  },
  workoutType: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.accent.BLUE,
    marginTop: Theme.spacing.xs,
  },
  statsCard: {
    marginBottom: Theme.spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    ...Theme.typography.h2,
    color: Theme.colors.accent.BLUE,
  },
  statLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.subtext,
  },
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
});