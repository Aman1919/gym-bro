import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./components/getStarted";
import UserDetailsScreen from "./components/userDetails";

const Stack = createStackNavigator();

const App = () => {
  return (
      <Stack.Navigator initialRouteName="GetStarted" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GetStarted" component={WelcomeScreen} />
        <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      </Stack.Navigator>
  );
};

export default App;
