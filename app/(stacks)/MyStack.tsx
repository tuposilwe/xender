import Preparations from "@/components/Preparations";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import TabLayout from "../(tabs)/_layout";
import Scanner from "../scanner";

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={TabLayout}
      />
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#066341" },
          headerTitleStyle: {
            color: "white",
          },

          headerTintColor: "white",
        }}
        name="Preparations"
        component={Preparations}
      />

      <Stack.Screen
        name="Scanner"
        component={Scanner}
        options={{
          headerShown: true,
          headerTransparent: true, // Make header transparent
           headerTitle: "", // Optional: hide title if you want only back button
           headerTintColor: "#fff", // Make the back button white (for better visibility over camera)
        }}
      />
    </Stack.Navigator>
  );
};

export default MyStack;
