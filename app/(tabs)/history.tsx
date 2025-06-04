import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Theme } from '@/constants/Theme';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { Workout } from '@/types';
import { getWorkouts } from '@/utils/db';
import WorkoutCard from '@/components/WorkoutCard';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setLoading(true);
    const loadedWorkouts = await getWorkouts();
    // Sort by date, newest first
    loadedWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setWorkouts(loadedWorkouts);
    setLoading(false);
  };

  const handleWorkoutPress = (workout: Workout) => {
    // Navigate to workout details page
    router.push({
      pathname: `/workout-detail`,
      params: { id: workout.id }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Workout History" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </View>
    );
  }

  if (workouts.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Workout History" />
        <EmptyState
          title="No Workout History"
          message="Complete your first workout to see it here!"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Workout History" />
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <WorkoutCard 
              workout={item} 
              onPress={() => handleWorkoutPress(item)} 
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
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
  listContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  cardContainer: {
    marginBottom: Theme.spacing.md,
  },
});