import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserDetailsStore } from '../store';

const Account = () => {
  const { userDetails } = useUserDetailsStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <Text style={styles.detail}>Gender: {userDetails.gender}</Text>
      <Text style={styles.detail}>Name: {userDetails.name}</Text>
      <Text style={styles.detail}>Age: {userDetails.age}</Text>
      <Text style={styles.detail}>Weight: {userDetails.weight}</Text>
      <Text style={styles.detail}>Height: {userDetails.height}</Text>
      <Text style={styles.detail}>Exercise Experience: {userDetails.exerciseExperience}</Text>
      <Text style={styles.detail}>Equipment Type: {userDetails.equipmentType}</Text>
      <Text style={styles.detail}>Workout Frequency: {userDetails.workoutFrequency}</Text>
      <Text style={styles.detail}>BMI: {userDetails.bmi}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A1E", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  title: { fontSize: 24, color: "#fff", marginBottom: 20 },
  detail: { fontSize: 18, color: "#fff", marginBottom: 10 },
});

export default Account;