import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FaMale, FaFemale } from "react-icons/fa";
import { GiBodyHeight } from "react-icons/gi";
import { FaWeight } from "react-icons/fa";
import { SiStagetimer } from "react-icons/si";
import { CgNametag } from "react-icons/cg";

const UserDetailsScreen = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    gender: "",
    name: "",
    age: "",
    weight: "",
    height: "",
    exerciseExperience: "",
    equipmentType: "",
    workoutFrequency: "",
  });

  const handleNext = async () => {
    const currentField = step === 1 ? "gender" : step === 2 ? "name" : step === 3 ? "age" : step === 4 ? "weight" : step === 5 ? "height" : step === 6 ? "exerciseExperience" : step === 7 ? "equipmentType" : "workoutFrequency";
    
    if (!userData[currentField]) {
      Alert.alert("Error", "Please fill out this field.");
      return;
    }

    if (step < 8) {
      setStep(step + 1);
    } else {
      try {
        await AsyncStorage.setItem('@userData', JSON.stringify(userData));
        Alert.alert("Profile Complete! 🎉");
      } catch (e) {
        Alert.alert("Error", "Failed to save data.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Step 1: Gender Selection */}
      {step === 1 && (
        <>
          <Text style={styles.question}>What is your gender?</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderBox, userData.gender === "Male" && styles.selectedBox]}
              onPress={() => setUserData({ ...userData, gender: "Male" })}
            >
              <FaMale style={{...styles.Image,color:"#333EBD"}}/>
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBox, userData.gender === "Female" && styles.selectedBox]}
              onPress={() => setUserData({ ...userData, gender: "Female" })}
            >
              <FaFemale style={{...styles.Image,color:"#FF75A2"}}/>
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Step 2-5: User Inputs */}
      {step === 2 && (
        <>
          <Text style={styles.question}>What is your name?</Text>
          <CgNametag style={{...styles.Image,color:"#0000FF"}}/>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={userData.name}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
          />
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.question}>What is your age?</Text>
          <SiStagetimer style={{...styles.Image,color:"#008000"}}/>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            keyboardType="numeric"
            value={userData.age}
            onChangeText={(text) => setUserData({ ...userData, age: text })}
          />
        </>
      )}

      {step === 4 && (
        <>
          <Text style={styles.question}>What is your weight?</Text>
          <FaWeight style={{...styles.Image,color:"#800080"}}/>
          <TextInput
            style={styles.input}
            placeholder="Enter your weight (kgs)"
            keyboardType="numeric"
            value={userData.weight}
            onChangeText={(text) => setUserData({ ...userData, weight: text })}
          />
        </>
      )}

      {step === 5 && (
        <>
          <Text style={styles.question}>What is your height?</Text>
          <GiBodyHeight style={{...styles.Image,color:"#FFA500"}}/>
          <TextInput
            style={styles.input}
            placeholder="Enter your height (cm)"
            keyboardType="numeric"
            value={userData.height}
            onChangeText={(text) => setUserData({ ...userData, height: text })}
          />
        </>
      )}

      {/* Step 6: Exercise Experience */}
      {step === 6 && (
        <>
          <Text style={styles.question}>What is your exercise experience?</Text>
          <View style={{...styles.genderContainer,flexDirection:"column"}}>
            <TouchableOpacity
              style={[styles.genderBox, userData.exerciseExperience === "Newbie" && styles.selectedBox]}
              onPress={() => setUserData({ ...userData, exerciseExperience: "Newbie" })}
            >
              <Text style={styles.genderText}>Newbie</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBox, userData.exerciseExperience === "Intermediate" && styles.selectedBox]}
              onPress={() => setUserData({ ...userData, exerciseExperience: "Intermediate" })}
            >
              <Text style={styles.genderText}>Intermediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBox, userData.exerciseExperience === "Advanced" && styles.selectedBox]}
              onPress={() => setUserData({ ...userData, exerciseExperience: "Advanced" })}
            >
              <Text style={styles.genderText}>Advanced</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Step 7: Equipment Type */}
      {step === 7 && (
        <>
          <Text style={styles.question}>What kind of equipment do you have?</Text>
          <View style={{...styles.genderContainer,flexDirection:"column"}}>
            <TouchableOpacity
              style={[styles.genderBox, userData.equipmentType === "Home Workout (No equipment)" && styles.selectedBox]}
              onPress={() => setUserData({ ...userData, equipmentType: "Home Workout (No equipment)" })}
            >
              <Text style={styles.genderText}>Home Workout (No equipment)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBox, userData.equipmentType === "Home Workout (Few Dumbbells)" && styles.selectedBox]}
              onPress={() => setUserData({ ...userData, equipmentType: "Home Workout (Few Dumbbells)" })}
            >
              <Text style={styles.genderText}>Home Workout (Few Dumbbells)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBox, userData.equipmentType === "Going to the Gym" && styles.selectedBox]}
              onPress={() => setUserData({ ...userData, equipmentType: "Going to the Gym" })}
            >
              <Text style={styles.genderText}>Going to the Gym</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Step 8: Workout Frequency */}
      {step === 8 && (
        <>
          <Text style={styles.question}>How often do you work out per week?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of times per week"
            keyboardType="numeric"
            value={userData.workoutFrequency}
            onChangeText={(text) => setUserData({ ...userData, workoutFrequency: text })}
          />
        </>
      )}

      {/* Next Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A1E", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  question: { fontSize: 18, color: "#fff", marginBottom: 20 },
  genderContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 20 ,gap:"1rem"},
  genderBox: { alignItems: "center", borderWidth: 2, borderColor: "#fff", borderRadius: 10, padding: 15, marginHorizontal: 10 },
  selectedBox: { borderColor: "#4CAF50" },
  Image: { width: 100, height: 100, marginBottom: 10 },
  genderText: { color: "#fff", fontSize: 16 },
  input: { width: "80%", backgroundColor: "#fff", padding: 10, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: "#1E90FF", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default UserDetailsScreen;
