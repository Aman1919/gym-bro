import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Theme } from '@/constants/Theme';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { getUserProfile, saveUserProfile } from '@/utils/db';
import { UserProfile } from '@/types';
import { calculateBMI, getBMICategory, calculateAge } from '@/utils/helpers';
import Card from '@/components/Card';

export default function SettingsScreen() {
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const savedProfile = await getUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveUserProfile(profile);
    setSaving(false);
  };

  const bmi = calculateBMI(profile);
  const bmiCategory = bmi ? getBMICategory(bmi) : '';
  const age = calculateAge(profile.dateOfBirth);

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholder="Your Name"
                placeholderTextColor={Theme.colors.subtext}
              />

              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                value={profile.dateOfBirth}
                onChangeText={(text) => setProfile({ ...profile, dateOfBirth: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Theme.colors.subtext}
              />

              <Text style={styles.label}>Gender</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    profile.gender === 'male' && styles.radioButtonActive,
                  ]}
                  onPress={() => setProfile({ ...profile, gender: 'male' })}
                >
                  <View style={[
                    styles.radioCircle,
                    profile.gender === 'male' && styles.radioCircleActive,
                  ]} />
                  <Text style={styles.radioText}>Male</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    profile.gender === 'female' && styles.radioButtonActive,
                  ]}
                  onPress={() => setProfile({ ...profile, gender: 'female' })}
                >
                  <View style={[
                    styles.radioCircle,
                    profile.gender === 'female' && styles.radioCircleActive,
                  ]} />
                  <Text style={styles.radioText}>Female</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    profile.gender === 'other' && styles.radioButtonActive,
                  ]}
                  onPress={() => setProfile({ ...profile, gender: 'other' })}
                >
                  <View style={[
                    styles.radioCircle,
                    profile.gender === 'other' && styles.radioCircleActive,
                  ]} />
                  <Text style={styles.radioText}>Other</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Physical Data</Text>
              
              <View style={styles.rowInputs}>
                <View style={styles.rowInput}>
                  <Text style={styles.label}>Weight</Text>
                  <View style={styles.unitInputContainer}>
                    <TextInput
                      style={styles.unitInput}
                      value={profile.weight ? profile.weight.toString() : ''}
                      onChangeText={(text) => {
                        const weight = parseFloat(text) || 0;
                        setProfile({ ...profile, weight });
                      }}
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor={Theme.colors.subtext}
                    />
                    <TouchableOpacity
                      style={styles.unitSelector}
                      onPress={() => setProfile({
                        ...profile,
                        weightUnit: profile.weightUnit === 'kg' ? 'lbs' : 'kg'
                      })}
                    >
                      <Text style={styles.unitText}>{profile.weightUnit}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.rowInput}>
                  <Text style={styles.label}>Height</Text>
                  <View style={styles.unitInputContainer}>
                    <TextInput
                      style={styles.unitInput}
                      value={profile.height ? profile.height.toString() : ''}
                      onChangeText={(text) => {
                        const height = parseFloat(text) || 0;
                        setProfile({ ...profile, height });
                      }}
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor={Theme.colors.subtext}
                    />
                    <TouchableOpacity
                      style={styles.unitSelector}
                      onPress={() => setProfile({
                        ...profile,
                        heightUnit: profile.heightUnit === 'cm' ? 'ft' : 'cm'
                      })}
                    >
                      <Text style={styles.unitText}>{profile.heightUnit}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {bmi && (
                <Card style={styles.bmiCard}>
                  <Text style={styles.bmiTitle}>BMI</Text>
                  <Text style={styles.bmiValue}>{bmi}</Text>
                  <Text style={styles.bmiCategory}>{bmiCategory}</Text>
                </Card>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Workout Preferences</Text>
              
              <Text style={styles.label}>Workout Days per Week</Text>
              <TextInput
                style={styles.input}
                value={profile.workoutDaysPerWeek ? profile.workoutDaysPerWeek.toString() : ''}
                onChangeText={(text) => {
                  const days = parseInt(text) || 0;
                  setProfile({ ...profile, workoutDaysPerWeek: days });
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={Theme.colors.subtext}
              />

              <Text style={styles.label}>Preferred Time of Day</Text>
              <TextInput
                style={styles.input}
                value={profile.preferredTimeOfDay}
                onChangeText={(text) => setProfile({ ...profile, preferredTimeOfDay: text })}
                placeholder="E.g., Morning, Evening"
                placeholderTextColor={Theme.colors.subtext}
              />
            </View>

            <Button
              title={saving ? 'Saving...' : 'Save Profile'}
              onPress={handleSave}
              disabled={saving}
              style={styles.saveButton}
              loading={saving}
            />
          </>
        )}
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
    minHeight: 300,
  },
  loadingText: {
    ...Theme.typography.body,
    color: Theme.colors.subtext,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
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
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.xs,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  radioButtonActive: {
    borderColor: Theme.colors.accent.PURPLE,
    backgroundColor: 'rgba(41, 121, 255, 0.1)',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Theme.colors.subtext,
    marginRight: Theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: Theme.colors.accent.PURPLE,
    backgroundColor: Theme.colors.accent.PURPLE,
  },
  radioText: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.text,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
    marginHorizontal: Theme.spacing.xs,
  },
  unitInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitInput: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    color: Theme.colors.text,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.typography.body,
    flex: 1,
  },
  unitSelector: {
    backgroundColor: Theme.colors.accent.PURPLE,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginLeft: Theme.spacing.sm,
    minWidth: 50,
    alignItems: 'center',
  },
  unitText: {
    ...Theme.typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bmiCard: {
    alignItems: 'center',
    marginTop: Theme.spacing.lg,
  },
  bmiTitle: {
    ...Theme.typography.h4,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  bmiValue: {
    ...Theme.typography.h1,
    color: Theme.colors.accent.PURPLE,
    marginBottom: Theme.spacing.xs,
  },
  bmiCategory: {
    ...Theme.typography.body,
    color: Theme.colors.subtext,
  },
  saveButton: {
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.xxl,
  },
});