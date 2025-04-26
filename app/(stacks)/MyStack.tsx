import Preparations from "@/components/Preparations";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import TabLayout from "../(tabs)/_layout";

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
            headerStyle:{backgroundColor:"#066341"},
            headerTitleStyle:{
                color:"white"
            },
            
             headerTintColor:"white",
        }}
      name="Preparations" component={Preparations} />
    </Stack.Navigator>
  );
};

export default MyStack;
