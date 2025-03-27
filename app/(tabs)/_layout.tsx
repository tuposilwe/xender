import icons from "@/constants/icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Image, Text, View } from "react-native";
import Profile from "../Profile";
import Home from "../home";
import Playlist from "./playlist";
import Social from "./social";
import Tomp3 from "./tomp3";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: any;
  title: string;
}) => (
  <View className="flex-auto mt-2 flex-col items-center">
    <Image
      source={icon}
      tintColor={focused ? "#066341" : "#666876"}
      resizeMode="contain"
      className={`${title == "" ? "size-9" : "size-6"} `}
    />
    <Text
      className={`mt-2  text-xs  w-full mt-1${
        focused ? "text-[#066341] font-medium" : "text-[#666876]"
      }`}
    >
      {title}
    </Text>
  </View>
);

const TabLayout = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#066341",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#f8f9fa",
          borderTopColor: "#0061FF1A",
          borderTopWidth: 1,
          paddingBottom: 5,
          height: 60,
        },
        // headerShown: false,
        headerStyle: {
          //    height: 47,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tab.Screen
        name="PLAYLIST"
        component={Playlist}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.playlist} focused={focused} title="PLAYLIST" />
          ),
        }}
      />
      <Tab.Screen
        name="TOMP3"
        component={Tomp3}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.toMp3} focused={focused} title="TOMP3" />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.shuffle} focused={focused} title="" />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="SOCIAL"
        component={Social}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.social} focused={focused} title="SOCIAL" />
          ),
        }}
      />
      <Tab.Screen
        name="ME"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.profile} focused={focused} title="ME" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabLayout;
