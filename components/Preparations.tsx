import { useNetworkAndLocation } from "@/hooks/useNetworkAndLocation";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityAction, startActivityAsync } from "expo-intent-launcher";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Device from "@react-native-tethering/hotspot";
import TorchState from "@britishgas-engineering/bg-react-native-torch"



const Preparations = ({ navigation }: any) => {
  const [chev, setChev] = useState(false);
  const [chev2, setChev2] = useState(false);

  const stat = Device.isHotspotEnabled;
  console.log("Hello There: ", stat);

 

  const { wifiEnabled, gpsEnabled } = useNetworkAndLocation();

  // console.log("Wifi:", wifiEnabled, "GPS:", gpsEnabled);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            margin: 7,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          onPress={() => setChev(!chev)}
        >
          <View
            style={{
              backgroundColor: "#066341",
              padding: 8,
              margin: 5,
              borderRadius: 20,
            }}
          >
            <FontAwesome name="wifi" size={14} color="white" />
          </View>

          <View
            style={{
              flex: 0.7,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Open WLAN
            </Text>
          </View>

          {chev ? (
            <Entypo name="chevron-up" size={24} color="#066341" />
          ) : (
            <Entypo name="chevron-down" size={24} color="#066341" />
          )}
        </Pressable>

        {wifiEnabled ? (
          <View
            style={{
              margin: 7,
            }}
          >
            <MaterialIcons name="check-circle" size={30} color="green" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => startActivityAsync(ActivityAction.WIFI_SETTINGS)}
            style={{
              margin: 7,
              padding: 3,
              borderColor: "#066341",
              borderWidth: 0.8,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "#066341",
              }}
            >
              SETUP
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {chev && (
        <View style={{ marginLeft: 37 }}>
          <Text
            style={{
              color: "#a09e9e",
            }}
          >
            WLAN is used to connect to your friend and transfer
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            margin: 7,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          onPress={() => setChev2(!chev2)}
        >
          <View
            style={{
              backgroundColor: "#066341",
              padding: 8,
              margin: 5,
              borderRadius: 20,
            }}
          >
            <Ionicons name="location-outline" size={14} color="white" />
          </View>

          <View
            style={{
              flex: 0.7,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Open GPS
            </Text>
          </View>

          {chev2 ? (
            <Entypo name="chevron-up" size={24} color="#066341" />
          ) : (
            <Entypo name="chevron-down" size={24} color="#066341" />
          )}
        </Pressable>

        {gpsEnabled ? (
          <View
            style={{
              margin: 7,
            }}
          >
            <MaterialIcons name="check-circle" size={30} color="green" />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() =>
              startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS)
            }
            style={{
              margin: 7,
              padding: 3,
              borderColor: "#066341",
              borderWidth: 0.8,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "#066341",
              }}
            >
              SETUP
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {chev2 && (
        <View style={{ marginLeft: 37 }}>
          <Text
            style={{
              color: "#a09e9e",
            }}
          >
            Android 6.0 or above require you to open location service to find
            friends nearby
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 5,
          margin: 8,
          bottom: -430,
          borderStyle: "dotted",
        }}
      >
        <MaterialIcons name="info-outline" size={24} color="red" />
        <Text
          style={{
            marginLeft: 5,
          }}
        >
          <Text style={{ color: "red" }}>Based on Android technology,</Text>
          Xender need {"\n"}
          <Text style={{ color: "red" }}>WLAN</Text>( Hotspot) +
          <Text style={{ color: "red" }}>Location</Text>
          (GPS) Permissions.
        </Text>
      </View>

      <TouchableOpacity
        style={{
          position: "fixed",
          justifyContent: "center",
          alignItems: "center",
          bottom: -420,
          margin: 9,
          padding: 12,
          borderRadius: 5,
          backgroundColor: wifiEnabled && gpsEnabled ? "#066341" : "#c2c2c2",
        }}
        disabled={wifiEnabled && gpsEnabled ? false : true}
        onPress={() => navigation.navigate("Scanner")}
      >
        <Text
          style={{
            color: "white",
          }}
        >
          NEXT
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Preparations;
