import icons from "@/constants/icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import * as Device from "expo-device";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Divider from "./Divider";

const CustomDrawerContent = (props: any) => {
  const [chev, setChev] = useState(false);
  const { bottom } = useSafeAreaInsets();


  const version = DeviceInfo.getReadableVersion();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Image source={icons.xender} style={styles.xenderImage} />
            <Text style={styles.text}>Xender</Text>
          </View>
          <Divider width={1.5} />
          <View
            style={{
              flexDirection: "row",
              alignContent: "flex-start",
              alignItems: "center",
              marginTop: 5,
              paddingLeft: 10,
              paddingBottom: bottom + 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#4B9CD3",
                padding: 5,
                borderRadius: 10,
              }}
            >
              <MaterialCommunityIcons name="web" size={14} color="white" />
            </View>
            <Text style={styles.itemText}>Language</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "flex-start",
              alignItems: "center",
              marginTop: 5,
              paddingLeft: 10,
              paddingBottom: bottom + 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#4B9CD3",
                padding: 5,
                borderRadius: 10,
              }}
            >
              <FontAwesome name="wifi" size={14} color="white" />
            </View>
            <Text style={styles.itemText}>High-speed Mode supported</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "flex-start",
              alignItems: "center",
              marginTop: 5,
              paddingLeft: 10,
              paddingBottom: bottom + 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#4B9CD3",
                padding: 5,
                borderRadius: 10,
              }}
            >
              <AntDesign name="setting" size={14} color="white" />
            </View>
            <Text style={styles.itemText}>Settings</Text>
          </View>

          <Divider width={1.5} />
          <View
            style={{
              flexDirection: "row",
              alignContent: "flex-start",
              alignItems: "center",
              marginTop: 5,
              paddingLeft: 10,
              paddingBottom: bottom + 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#4B9CD3",
                padding: 5,
                borderRadius: 10,
              }}
            >
              <Feather name="moon" size={14} color="white" />
            </View>
            <Text style={styles.itemText}>Night mode</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "flex-start",
              alignItems: "center",
              marginTop: 5,
              paddingLeft: 10,
              paddingBottom: bottom + 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#8FFE09",
                padding: 5,
                borderRadius: 10,
              }}
            >
              <Feather name="help-circle" size={14} color="white" />
            </View>
            <Text style={styles.itemText}>Help & Feedback</Text>
          </View>
          <Divider width={1.5} />
          <View
            style={{
              flexDirection: "row",
              alignContent: "flex-start",
              alignItems: "center",
              marginTop: 5,
              paddingLeft: 10,
              paddingBottom: bottom + 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#c52ca4",
                padding: 5,
                borderRadius: 10,
              }}
            >
              <AntDesign name="star" size={14} color="white" />
            </View>
            <Text style={styles.itemText}>Ratings</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignContent: "flex-start",
              alignItems: "center",
              marginTop: 5,
              paddingLeft: 10,
              paddingBottom: bottom + 10,
            }}
          >
            <View
              style={{
                backgroundColor: "gold",
                padding: 5,
                borderRadius: 10,
              }}
            >
              <AntDesign name="infocirlceo" size={14} color="white" />
            </View>
            <Text style={styles.itemText}>About</Text>
          </View>
          <Divider width={1.5} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 5,
              paddingBottom: bottom + 10,
            }}
          >
            <Pressable onPress={() => setChev(!chev)}>
              {chev ? (
                <Image
                  source={icons.eject_up}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              ) : (
                <Image
                  source={icons.eject_down}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              )}
            </Pressable>
          </View>

          {chev && (
            <View>
              <Text>Device: {Device.modelName} </Text>
              <Text>App Version: {version} </Text>
              <Text>PlatformApiLevel: {Device.platformApiLevel}</Text>
              <Text>Manufacturer: {Device.manufacturer} </Text>
            </View>
          )}
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

 
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  itemText: {
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 15,
  },
  text: {
    fontFamily: "cursive",
    fontSize: 28,
  },
  xenderImage: {
    width: 30,
    height: 30,
  },
});
