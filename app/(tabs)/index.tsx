import React, { useEffect, useCallback,useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Theme } from '@/constants/Theme';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { Workout } from '@/types';
import { getCurrentWorkout, completeWorkout } from '@/utils/db';
import { useRouter ,useFocusEffect} from 'expo-router';
import ExerciseCard from '@/components/ExerciseCard';
import Button from '@/components/Button';
import { formatDate } from '@/utils/helpers';

export default function HomeScreen() {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

useFocusEffect(
    useCallback(() => {
      loadWorkout();
    }, [])
  );
  const loadWorkout = async () => {
    setLoading(true);
    const workout = await getCurrentWorkout();
    setCurrentWorkout(workout);
    setLoading(false);
  };

  const handleAddWorkout = () => {
    router.push('/add');
  };

  const handleCompleteWorkout = async () => {
    await completeWorkout();
    setCurrentWorkout(null);
  };

  const handleUpdateExercise = (exerciseId: string, updatedExercise: any) => {
    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        return updatedExercise;
      }
      return exercise;
    });

    const updatedWorkout = {
      ...currentWorkout,
      exercises: updatedExercises,
    };

    setCurrentWorkout(updatedWorkout);
    // Save to AsyncStorage
    // saveCurrentWorkout(updatedWorkout);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Today's Workout" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </View>
    );
  }

  if (!currentWorkout) {
    return (
      <View style={styles.container}>
        <Header title="Today's Workout" />
        <EmptyState
          title="No Workout Today"
          message="Start a new workout to begin tracking your progress!"
          actionText="Start Workout"
          onAction={handleAddWorkout}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Today's Workout" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.workoutTitle}>{currentWorkout?.title || ''}</Text>
          <Text style={styles.workoutDate}>{currentWorkout?.date ? formatDate(currentWorkout.date) : ''}</Text>
        </View>

        <Text style={styles.sectionTitle}>Exercises</Text>
        {currentWorkout?.exercises?.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdate={(updatedExercise) => handleUpdateExercise(exercise.id, updatedExercise)}
          />
        ))}

        <Button
          title="Complete Workout"
          onPress={handleCompleteWorkout}
          variant="success"
          style={styles.completeButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingTop: Theme.spacing.lg,
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
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  completeButton: {
    marginTop: Theme.spacing.lg,
  },
});