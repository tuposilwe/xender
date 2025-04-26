import icons from "@/constants/icons";
import useSelectedApps from "@/hooks/useSelectedApps";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Portal } from "react-native-paper";
import Animated, {
  interpolate,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Profile from "../Profile";
import Home from "../home";
import Playlist from "./playlist";
import Social from "./social";
import Tomp3 from "./tomp3";

const TabIcon = ({
  focused,
  icon,
  title,
  isCenterTab = false,
}: {
  focused: boolean;
  icon: any;
  title: string;
  isCenterTab?: boolean;
}) => (
  <View style={styles.tabIconContainer}>
    {isCenterTab ? (
      <View
        style={[
          styles.centerTabBackground,
          focused && styles.centerTabBackgroundFocused,
        ]}
      >
        <Image source={icon} style={styles.centerTabIcon} />
      </View>
    ) : (
      <>
        <Image
          source={icon}
          style={[
            styles.tabIcon,
            { tintColor: focused ? "#066341" : "#666876" },
          ]}
        />
        <Text
          style={[
            styles.tabLabel,
            focused ? styles.tabLabelActive : styles.tabLabelInactive,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </>
    )}
  </View>
);

const DURATION = 200;
const TRANSLATE_Y = -100;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TabLayout = ({ navigation }: any) => {
  const { selectedApps, screen, setSelectedApps } = useSelectedApps();

  const Tab = createBottomTabNavigator();
  const isOpened = useRef(false);
  const [opened, setOpened] = useState(false);

  const transYSend = useSharedValue(0);
  const transYUpload = useSharedValue(0);

  const rSendAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateY: transYSend.value },
      { scale: interpolate(transYSend.value, [TRANSLATE_Y, 0], [1, 0]) },
    ],
  }));

  const rReceiveAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateY: transYUpload.value },
      { scale: interpolate(transYUpload.value, [TRANSLATE_Y, 0], [1, 0]) },
    ],
  }));

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: [styles.tabBar, screen && { display: "none" }],
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "center",
        }}
        initialRouteName="index"
      >
        <Tab.Screen
          name="PLAYLIST"
          component={Playlist}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={icons.playlist}
                focused={focused}
                title="PLAYLIST"
              />
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
          name="index"
          listeners={({ navigation }) => ({
            focus: () => navigation.jumpTo("index"),
            tabPress: (e) => {
              navigation.jumpTo("index");

              if (isOpened.current) {
                transYSend.value = withTiming(0, { duration: DURATION });
                transYUpload.value = withTiming(0, { duration: DURATION });
                setOpened(false);
              } else {
                transYSend.value = withTiming(TRANSLATE_Y, {
                  duration: DURATION,
                });
                transYUpload.value = withTiming(TRANSLATE_Y, {
                  duration: DURATION,
                });
                setOpened(true);

                setTimeout(() => {
                  if (isOpened.current) {
                    transYSend.value = withTiming(0, { duration: DURATION });
                    transYUpload.value = withTiming(0, { duration: DURATION });
                    isOpened.current = false;
                    setOpened(false);
                  }
                }, 3000);
              }

              isOpened.current = !isOpened.current;
              e.preventDefault();
            },
          })}
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={icons.shuffle}
                focused={focused}
                title=""
                isCenterTab={true}
              />
            ),
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

      {/* Send & Receive Buttons Outside tabBarIcon */}
      {opened && (
        <>
          <AnimatedPressable
            style={[styles.sendButton, rSendAnimatedStyles]}
            onPress={() => Alert.alert("Sending!", "You Clicked Send")}
          >
            <Feather name="send" size={28} color="white" />
            <Text style={{ color: "white", marginLeft: 5 }}>SEND</Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={[styles.dowloadButton, rReceiveAnimatedStyles]}
            onPress={() => navigation.navigate("Preparations")}
          >
            <FontAwesome name="download" size={28} color="white" />
            <Text style={{ color: "white", marginLeft: 5 }}>RECEIVE</Text>
          </AnimatedPressable>
        </>
      )}

      {/* Bottom Slide Panel */}
      {selectedApps.length > 0 && (
        <Portal>
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={[styles.sliderModal]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ margin: 3, marginLeft: 15 }}
                onPress={() => setSelectedApps([])}
              >
                <Entypo name="cross" size={25} color="#9c9696" />
              </TouchableOpacity>

              <View
                style={{
                  borderRadius: 9,
                  width: 120,
                  height: 45,
                  backgroundColor: "#08723d",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: "center",
                    marginTop: 2,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  SEND ({selectedApps.length})
                </Text>
              </View>

              <TouchableOpacity
                style={{ margin: 10 }}
                onPress={() =>
                  Alert.alert("", "Delete selected items", [
                    { text: "Cancel", style: "cancel" },
                    { text: "OK", onPress: () => console.log("OK Pressed") },
                  ])
                }
              >
                <FontAwesome5 name="trash" size={20} color="#9c9696" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sliderModal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 0.1,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  tabBar: {
    backgroundColor: "#f8f9fa",
    borderTopColor: "#0061FF1A",
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  header: {
    backgroundColor: "#ffffff",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#000",
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 0,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  tabLabelActive: {
    color: "#066341",
    fontWeight: "600",
  },
  tabLabelInactive: {
    color: "#666876",
  },
  centerTabBackground: {
    width: 70,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#066341",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    borderWidth: 3,
    borderColor: "#f8f9fa",
  },
  centerTabBackgroundFocused: {
    backgroundColor: "#044b33",
  },
  centerTabIcon: {
    width: 28,
    height: 28,
    tintColor: "#fff",
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: 80,
    marginTop: 25,
  },
  sendButton: {
    flexDirection: "row",
    width: 90,
    height: 50,
    padding: 9,
    backgroundColor: "#066341",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 70,
    zIndex: 100,
  },
  dowloadButton: {
    flexDirection: "row",
    width: 110,
    height: 50,
    padding: 9,
    backgroundColor: "#066341",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 70,
    zIndex: 100,
  },
});

export default TabLayout;
