import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Theme } from '@/constants/Theme';
import { saveUserProfile } from '@/utils/db';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { UserProfile } from '@/types';
import { Dumbbell, ChevronRight } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    dateOfBirth: '',
    weight: 0,
    weightUnit: 'kg',
    height: 0,
    heightUnit: 'cm',
    gender: 'other',
    workoutDaysPerWeek: 0,
    preferredTimeOfDay: '',
  });
 console.log('Initial profile state:', profile);
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setProfile({ ...profile, dateOfBirth: selectedDate.toISOString().split('T')[0] });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setProfile({
        ...profile,
        preferredTimeOfDay: selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await saveUserProfile(profile);
    router.replace('/(tabs)');
  };

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const renderStep1 = () => (
    <Animated.View 
      entering={FadeInUp.duration(500)} 
      exiting={FadeOutDown.duration(300)}
      style={styles.step}
    >
      <Animated.View entering={FadeInDown.delay(300)}>
        <Dumbbell size={64} color={Theme.colors.accent.PURPLE} />
      </Animated.View>
      <Text style={styles.title}>Welcome to FitTrack</Text>
      <Text style={styles.subtitle}>Let's get to know you better</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>What's your name?</Text>
        <TextInput
          style={styles.input}
          value={profile.name}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
          placeholder="Enter your name"
          placeholderTextColor={Theme.colors.subtext}
          autoFocus={Platform.OS !== 'web'}
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.genderButton,
                profile.gender === option.value && styles.genderButtonSelected,
              ]}
              onPress={() => setProfile({ ...profile, gender: option.value as 'male' | 'female' | 'other' })}
            >
              <Text
                style={[
                  styles.genderButtonText,
                  profile.gender === option.value && styles.genderButtonTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View 
      entering={FadeInUp.duration(500)} 
      exiting={FadeOutDown.duration(300)}
      style={styles.step}
    >
      <Text style={styles.title}>Physical Details</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.inputText}>
            {profile.dateOfBirth || 'Select your date of birth'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date()}
            mode="date"
            onChange={handleDateChange}
          />
        )}

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Weight</Text>
            <View style={styles.unitInput}>
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={profile.weight ? profile.weight.toString() : ''}
                onChangeText={(text) => setProfile({ ...profile, weight: parseFloat(text) || 0 })}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={Theme.colors.subtext}
              />
              <TouchableOpacity
                style={[styles.unitButton, { backgroundColor: Theme.colors.accent.TEAL }]}
                onPress={() => setProfile({
                  ...profile,
                  weightUnit: profile.weightUnit === 'kg' ? 'lbs' : 'kg'
                })}
              >
                <Text style={styles.unitButtonText}>{profile.weightUnit}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.halfInput}>
            <Text style={styles.label}>Height</Text>
            <View style={styles.unitInput}>
              <TextInput
                style={[styles.input, styles.numberInput]}
                value={profile.height ? profile.height.toString() : ''}
                onChangeText={(text) => setProfile({ ...profile, height: parseFloat(text) || 0 })}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={Theme.colors.subtext}
              />
              <TouchableOpacity
                style={[styles.unitButton, { backgroundColor: Theme.colors.accent.TEAL }]}
                onPress={() => setProfile({
                  ...profile,
                  heightUnit: profile.heightUnit === 'cm' ? 'ft' : 'cm'
                })}
              >
                <Text style={styles.unitButtonText}>{profile.heightUnit}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View 
      entering={FadeInUp.duration(500)} 
      exiting={FadeOutDown.duration(300)}
      style={styles.step}
    >
      <Text style={styles.title}>Workout Preferences</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>How many days do you work out per week?</Text>
        <TextInput
          style={styles.input}
          value={profile.workoutDaysPerWeek ? profile.workoutDaysPerWeek.toString() : ''}
          onChangeText={(text) => setProfile({ ...profile, workoutDaysPerWeek: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={Theme.colors.subtext}
        />

        <Text style={styles.label}>Preferred workout time</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.inputText}>
            {profile.preferredTimeOfDay || 'Select your preferred time'}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            onChange={handleTimeChange}
          />
        )}
      </View>
    </Animated.View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      <Animated.View 
        entering={FadeInUp.delay(300)} 
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={[
            styles.button,
            ((!profile.name || !profile.gender) && step === 1) && styles.buttonDisabled,
            { backgroundColor: Theme.colors.accent.PURPLE }
          ]}
          onPress={handleNext}
          disabled={(!profile.name || !profile.gender) && step === 1}
        >
          <Text style={styles.buttonText}>
            {step === 3 ? "Complete Setup" : "Continue"}
          </Text>
          <ChevronRight color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    padding: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xxl,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Theme.typography.h1,
    color: Theme.colors.text,
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.subtext,
    marginBottom: Theme.spacing.xl,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: Theme.spacing.xl,
  },
  label: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  input: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.typography.body,
    marginBottom: Theme.spacing.lg,
  },
  inputText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -Theme.spacing.xs,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  unitInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberInput: {
    flex: 1,
    marginBottom: 0,
  },
  unitButton: {
    backgroundColor: Theme.colors.accent.TEAL,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginLeft: Theme.spacing.sm,
    minWidth: 50,
    alignItems: 'center',
  },
  unitButtonText: {
    ...Theme.typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: Theme.spacing.xl,
  },
  button: {
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonDisabled: {
    backgroundColor: Theme.colors.border,
    opacity: 0.5,
  },
  buttonText: {
    ...Theme.typography.button,
    color: '#FFFFFF',
    marginRight: Theme.spacing.sm,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Theme.spacing.sm,
  },
  genderButton: {
    flex: 1,
    padding: Theme.spacing.md,
    marginHorizontal: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  genderButtonSelected: {
    backgroundColor: Theme.colors.accent.PURPLE,
    borderColor: Theme.colors.accent.PURPLE,
  },
  genderButtonText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
  },
  genderButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});