import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./pages/getStarted";
import UserDetailsScreen from "./pages/userDetails";
import Account from "./pages/Account";

const Stack = createStackNavigator();

const App = () => {
  return (
      <Stack.Navigator initialRouteName="GetStarted" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GetStarted" component={WelcomeScreen} />
        <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
        <Stack.Screen name="Account" component={Account} />
      </Stack.Navigator>
  );
};

export default App;