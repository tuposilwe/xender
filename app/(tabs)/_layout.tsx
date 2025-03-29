import icons from "@/constants/icons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useRef } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
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

const TabLayout = () => {
  const Tab = createBottomTabNavigator();
  const isOpened = useRef(false);
  const transYSend = useSharedValue(0);
  const transYUpload = useSharedValue(0);
  const rSendAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: transYSend.value },

        { scale: interpolate(transYSend.value, [TRANSLATE_Y, 0], [1, 0]) },
      ],
    };
  }, []);

  const rDownloadAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: transYSend.value },

        { scale: interpolate(transYSend.value, [TRANSLATE_Y, 0], [1, 0]) },
      ],
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
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
        name="index"
        listeners={({ navigation }) => ({
          focus: () => navigation.jumpTo("index"),
          tabPress: (e) => {
            navigation.jumpTo("index");

            if (isOpened.current) {
              transYSend.value = withTiming(0, {
                duration: DURATION,
              });
            } else {
              transYSend.value = withTiming(TRANSLATE_Y, {
                duration: DURATION,
              });
              transYUpload.value = withTiming(TRANSLATE_Y, {
                duration: DURATION,
              });
            }

            isOpened.current = !isOpened.current;

            e.preventDefault();
          },
        })}
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon
                icon={icons.shuffle}
                focused={focused}
                title=""
                isCenterTab={true}
              />
              <AnimatedPressable
                style={[styles.sendButton, rSendAnimatedStyles]}
                onPress={() => {
                  Alert.alert("Sending!", "You Clicked Send");
                }}
              >
                <Feather name="send" size={28} color="white" />
                <Text style={{ color: "white", marginLeft: 5 }}>SEND</Text>
              </AnimatedPressable>
              <AnimatedPressable
                style={[styles.dowloadButton, rDownloadAnimatedStyles]}
                onPress={() => {
                  Alert.alert("Download", "You Clicked Download");
                }}
              >
                <FontAwesome name="download" size={28} color="white" />
                <Text style={{ color: "white", marginLeft: 5 }}>RECEIVE</Text>
              </AnimatedPressable>
            </>
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
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#044b33", // Slightly darker when focused
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
    left: -89,
    zIndex: -1,
  },
  dowloadButton: {
    flexDirection: "row",
    width: 110,
    height: 50,
    padding: 9,
    backgroundColor: "#066341",
    borderRadius: 30,
    // borderWidth: 4,
    // borderColor: "#f4fdfd",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 20,
    zIndex: -1,
  },
});

export default TabLayout;
