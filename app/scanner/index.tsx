
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  AppState,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Scanner = () => {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    startAnimation();
  }, []);

  const getTorch = () => {
  
    // TorchState.setEnabledState(torch)
   console.log("My Torch: ",torch);
   
  }

  useEffect(() => {

  getTorch()

  return () => {
    getTorch()
  }
  }, [getTorch]);

  const startAnimation = () => {
    animatedValue.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const isPermissionGranted = Boolean(permission?.granted);

  // console.log("permission: ", isPermissionGranted);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250], // size of the focusBox
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(async () => {
              await Linking.openURL(data);
            }, 500);
          }
        }}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.overlayBackground} />
        <View style={styles.overlayCenterRow}>
          <View style={styles.overlayBackground} />
          <View style={styles.focusBox}>
            {/* Animated sliding line */}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY }],
                },
              ]}
            />
          </View>
          <View style={styles.overlayBackground} />
        </View>
        <View style={styles.overlayBackground} />
      </View>

      {/* If no permission */}
      {!isPermissionGranted && (
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "100%",
          }}
          onPress={requestPermission}
        >
          <Text style={styles.buttonStyle}>
            We need your permission to show the camera
          </Text>
        </Pressable>
      )}

      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100%",
        }}
        onPress={() => setTorch(!torch)}
      >
        {torch ? (
          <MaterialIcons name="flashlight-on" size={64} color="black" />
        ) : (
          <MaterialIcons name="flashlight-off" size={64} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  buttonStyle: {
    color: "#066341",
    fontSize: 20,
    textAlign: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // dark overlay
    width: "100%",
  },
  overlayCenterRow: {
    flexDirection: "row",
  },
  focusBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#066341",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  scanLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#066341",
    position: "absolute",
  },
});
