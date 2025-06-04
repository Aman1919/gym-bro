import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '@/constants/Theme';
import { Exercise, Set } from '@/types';
import { ChevronDown, ChevronUp, Clock, Dumbbell } from 'lucide-react-native';
import Card from './Card';
import { formatTime, generateId } from '@/utils/helpers';

type ExerciseCardProps = {
  exercise: Exercise;
  onUpdate?: (updatedExercise: Exercise) => void;
  readOnly?: boolean;
};

export default function ExerciseCard({
  exercise,
  onUpdate,
  readOnly = false,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleAddSet = () => {
    if (readOnly || exercise.type !== 'set') return;

    const newSet: Set = {
      id: generateId(),
      weight: 0,
      reps: 0,
      completed: false,
    };

    const updatedExercise = {
      ...exercise,
      sets: [...(exercise.sets || []), newSet],
    };

    onUpdate?.(updatedExercise);
  };

  const handleUpdateSet = (setId: string, field: keyof Set, value: any) => {
    if (readOnly || exercise.type !== 'set') return;

    const updatedSets = exercise.sets?.map(set => {
      if (set.id === setId) {
        return { ...set, [field]: value };
      }
      return set;
    });

    const updatedExercise = {
      ...exercise,
      sets: updatedSets,
    };

    onUpdate?.(updatedExercise);
  };

  const handleUpdateTime = (seconds: number) => {
    if (readOnly || exercise.type !== 'timer') return;

    const updatedExercise = {
      ...exercise,
      duration: seconds,
    };

    onUpdate?.(updatedExercise);
  };

  return (
    <Card>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setExpanded(!expanded)}
        disabled={readOnly}
      >
        <View style={styles.titleContainer}>
          {exercise.type === 'set' ? (
            <Dumbbell size={20} color={Theme.colors.accent.GREEN} style={styles.icon} />
          ) : (
            <Clock size={20} color={Theme.colors.accent.BLUE} style={styles.icon} />
          )}
          <Text style={styles.title}>{exercise.name}</Text>
        </View>
        {!readOnly && (
          expanded ? (
            <ChevronUp size={20} color={Theme.colors.text} />
          ) : (
            <ChevronDown size={20} color={Theme.colors.text} />
          )
        )}
      </TouchableOpacity>

      {/* Exercise details */}
      {(expanded || readOnly) && (
        <View style={styles.content}>
          {exercise.type === 'set' && exercise.sets && (
            <>
              <View style={styles.setsHeader}>
                <Text style={styles.setsHeaderText}>Set</Text>
                <Text style={styles.setsHeaderText}>Weight</Text>
                <Text style={styles.setsHeaderText}>Reps</Text>
                {!readOnly && <Text style={styles.setsHeaderText}>Done</Text>}
              </View>
              {exercise.sets.map((set, index) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={styles.setText}>{index + 1}</Text>
                  
                  <View style={styles.weightContainer}>
                    {!readOnly ? (
                      <>
                        <TouchableOpacity 
                          style={styles.counterButton}
                          onPress={() => handleUpdateSet(set.id, 'weight', Math.max(0, set.weight - 2.5))}
                        >
                          <Text style={styles.counterButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.setText}>{set.weight}</Text>
                        <TouchableOpacity 
                          style={styles.counterButton}
                          onPress={() => handleUpdateSet(set.id, 'weight', set.weight + 2.5)}
                        >
                          <Text style={styles.counterButtonText}>+</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text style={styles.setText}>{set.weight}</Text>
                    )}
                  </View>
                  
                  <View style={styles.repsContainer}>
                    {!readOnly ? (
                      <>
                        <TouchableOpacity 
                          style={styles.counterButton}
                          onPress={() => handleUpdateSet(set.id, 'reps', Math.max(0, set.reps - 1))}
                        >
                          <Text style={styles.counterButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.setText}>{set.reps}</Text>
                        <TouchableOpacity 
                          style={styles.counterButton}
                          onPress={() => handleUpdateSet(set.id, 'reps', set.reps + 1)}
                        >
                          <Text style={styles.counterButtonText}>+</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text style={styles.setText}>{set.reps}</Text>
                    )}
                  </View>
                  
                  {!readOnly && (
                    <TouchableOpacity
                      style={[
                        styles.checkButton,
                        set.completed ? styles.completedButton : {}
                      ]}
                      onPress={() => handleUpdateSet(set.id, 'completed', !set.completed)}
                    >
                      <Text style={styles.checkButtonText}>✓</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              
              {!readOnly && (
                <TouchableOpacity 
                  style={styles.addSetButton}
                  onPress={handleAddSet}
                >
                  <Text style={styles.addSetButtonText}>+ Add Set</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {exercise.type === 'timer' && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {formatTime(exercise.duration || 0)}
              </Text>
              {!readOnly && (
                <View style={styles.timerControls}>
                  <TouchableOpacity
                    style={styles.timerButton}
                    onPress={() => handleUpdateTime(Math.max(0, (exercise.duration || 0) - 30))}
                  >
                    <Text style={styles.timerButtonText}>-30s</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timerButton}
                    onPress={() => handleUpdateTime((exercise.duration || 0) + 30)}
                  >
                    <Text style={styles.timerButtonText}>+30s</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {exercise.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText}>{exercise.notes}</Text>
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: Theme.spacing.sm,
  },
  title: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
  },
  content: {
    marginTop: Theme.spacing.md,
  },
  setsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    marginBottom: Theme.spacing.sm,
  },
  setsHeaderText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.subtext,
    flex: 1,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  setText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    textAlign: 'center',
    flex: 1,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  repsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  counterButton: {
    width: 28,
    height: 28,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    ...Theme.typography.button,
    color: Theme.colors.text,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    maxWidth: 32,
  },
  completedButton: {
    backgroundColor: Theme.colors.accent.GREEN,
  },
  checkButtonText: {
    ...Theme.typography.button,
    color: Theme.colors.text,
  },
  addSetButton: {
    paddingVertical: Theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.background,
    marginTop: Theme.spacing.sm,
  },
  addSetButtonText: {
    ...Theme.typography.button,
    color: Theme.colors.accent.BLUE,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
  },
  timerText: {
    ...Theme.typography.h1,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  timerButton: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  timerButtonText: {
    ...Theme.typography.button,
    color: Theme.colors.text,
  },
  notesContainer: {
    marginTop: Theme.spacing.md,
    padding: Theme.spacing.sm,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.md,
  },
  notesLabel: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.subtext,
    marginBottom: Theme.spacing.xs,
  },
  notesText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
});