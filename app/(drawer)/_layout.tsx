import React from "react";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabLayout from "../(tabs)/_layout";

const Drawer = createDrawerNavigator();

const DrawerLayout = () => {
  return (
    <Drawer.Navigator
      backBehavior="history"
      screenOptions={({ navigation }) => ({
        drawerType: "front",
        swipeEnabled: true,
        swipeEdgeWidth: 10,
        headerShown: false,
      })}
      drawerContent={CustomDrawerContent}
    >
      <Drawer.Screen
        name="xender"
        component={TabLayout}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      {/* <Drawer.Screen
        name="language"
        component={Language}
        options={{
          title: "Language",
          drawerLabel: "Language",

          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="person-outline" size={size} color={color} />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};

export default DrawerLayout;
