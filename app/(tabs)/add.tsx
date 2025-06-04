import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Theme } from '@/constants/Theme';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { Exercise, Workout } from '@/types';
import { saveCurrentWorkout } from '@/utils/db';
import { generateId } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import { Clock, Dumbbell, Plus } from 'lucide-react-native';

export default function AddWorkoutScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Partial<Exercise>>({
    name: '',
    type: 'set',
  });

  const handleNextStep = () => {
    if (step === 1 && workoutTitle) {
      setStep(2);
    }
  };

  const handleAddExercise = () => {
    if (currentExercise.name) {
      const newExercise: Exercise = {
        id: generateId(),
        name: currentExercise.name,
        type: currentExercise.type || 'set',
        sets: currentExercise.type === 'set' ? [{ id: generateId(), weight: 0, reps: 0, completed: false }] : undefined,
        duration: currentExercise.type === 'timer' ? 60 : undefined,
        notes: currentExercise.notes,
      };

      setExercises([...exercises, newExercise]);
      setCurrentExercise({ name: '', type: 'set' });
    }
  };

  const handleCreateWorkout = async () => {
    if (workoutTitle && exercises.length > 0) {
      const newWorkout: Workout = {
        id: generateId(),
        title: workoutTitle,
        date: new Date().toISOString(),
        exercises: exercises,
        completed: false,
      };

      await saveCurrentWorkout(newWorkout);
      router.replace('/');
    }
  };

  const renderStep1 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Workout Title</Text>
      <TextInput
        style={styles.input}
        value={workoutTitle}
        onChangeText={setWorkoutTitle}
        placeholder="E.g., Leg Day, Upper Body, etc."
        placeholderTextColor={Theme.colors.subtext}
      />


      <Button
        title="Next"
        onPress={handleNextStep}
        disabled={!workoutTitle}
        style={styles.button}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Add Exercises</Text>

      {exercises.length > 0 && (
        <View style={styles.exerciseList}>
          {exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <View style={styles.exerciseItemContent}>
                {exercise.type === 'set' ? (
                  <Dumbbell size={16} color={Theme.colors.accent.GREEN} style={styles.exerciseIcon} />
                ) : (
                  <Clock size={16} color={Theme.colors.accent.BLUE} style={styles.exerciseIcon} />
                )}
                <Text style={styles.exerciseItemText}>{exercise.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const updatedExercises = [...exercises];
                  updatedExercises.splice(index, 1);
                  setExercises(updatedExercises);
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.addExerciseForm}>
        <Text style={styles.label}>Exercise Name</Text>
        <TextInput
          style={styles.input}
          value={currentExercise.name}
          onChangeText={(text) => setCurrentExercise({ ...currentExercise, name: text })}
          placeholder="E.g., Squats, Bench Press, etc."
          placeholderTextColor={Theme.colors.subtext}
        />

        <Text style={styles.label}>Exercise Type</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              currentExercise.type === 'set' && styles.typeButtonActive
            ]}
            onPress={() => setCurrentExercise({ ...currentExercise, type: 'set' })}
          >
            <Dumbbell size={20} color={currentExercise.type === 'set' ? Theme.colors.text : Theme.colors.subtext} />
            <Text style={[
              styles.typeButtonText,
              currentExercise.type === 'set' && styles.typeButtonTextActive
            ]}>Set Based</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              currentExercise.type === 'timer' && styles.typeButtonActive
            ]}
            onPress={() => setCurrentExercise({ ...currentExercise, type: 'timer' })}
          >
            <Clock size={20} color={currentExercise.type === 'timer' ? Theme.colors.text : Theme.colors.subtext} />
            <Text style={[
              styles.typeButtonText,
              currentExercise.type === 'timer' && styles.typeButtonTextActive
            ]}>Timer Based</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={currentExercise.notes}
          onChangeText={(text) => setCurrentExercise({ ...currentExercise, notes: text })}
          placeholder="Add any notes about this exercise..."
          placeholderTextColor={Theme.colors.subtext}
          multiline
        />

        <Button
          title="Add Exercise"
          onPress={handleAddExercise}
          disabled={!currentExercise.name}
          style={styles.button}
        />
      </View>

      <Button
        title="Create Workout"
        onPress={handleCreateWorkout}
        disabled={exercises.length === 0}
        variant="success"
        style={styles.createButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title={step === 1 ? "Create Workout" : "Add Exercises"} 
        showBackButton={step === 2}
        rightComponent={step === 2 ? (
          <TouchableOpacity onPress={handleAddExercise} disabled={!currentExercise.name}>
            <Plus size={24} color={!currentExercise.name ? Theme.colors.subtext : Theme.colors.accent.BLUE} />
          </TouchableOpacity>
        ) : undefined}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {step === 1 ? renderStep1() : renderStep2()}
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
  formContainer: {
    flex: 1,
  },
  label: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
    marginTop: Theme.spacing.md,
  },
  input: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.typography.body,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: Theme.spacing.lg,
  },
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.xs,
  },
  typeButton: {
    flex: 1,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Theme.spacing.xs,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    flexDirection: 'row',
  },
  typeButtonActive: {
    borderColor: Theme.colors.accent.BLUE,
    backgroundColor: 'rgba(41, 121, 255, 0.1)',
  },
  typeButtonText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.subtext,
    marginLeft: Theme.spacing.sm,
  },
  typeButtonTextActive: {
    color: Theme.colors.text,
  },
  exerciseList: {
    marginTop: Theme.spacing.md,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  exerciseItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseIcon: {
    marginRight: Theme.spacing.sm,
  },
  exerciseItemText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    lineHeight: 26,
  },
  addExerciseForm: {
    marginTop: Theme.spacing.lg,
  },
  createButton: {
    marginTop: Theme.spacing.xl,
  },
});