import React, { useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import { AuthContext } from "../context/AuthContext";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isLoggedIn, checkLogin } = useContext(AuthContext);

  useEffect(() => {
    checkLogin(); // * Check login status on app load
    console.log('Authentication status:', isLoggedIn); // * Debug authentication status
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Home" component={HomeScreen} /> // * Show Home screen if logged in
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} /> // * Show Login screen if not logged in
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
