import { CameraView, useCameraPermissions, FlashMode } from "expo-camera";
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
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
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

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  const toggleFlashMode = () => {
    setFlashMode((prev) => (prev === "on" ? "off" : "on"));
  };

  return (
    <View style={{ flex: 1 }}>
      {isPermissionGranted && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          flash={flashMode}
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              setTimeout(async () => {
                await Linking.openURL(data);
              }, 500);
            }
          }}
        />
      )}

      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.overlayBackground} />
        <View style={styles.overlayCenterRow}>
          <View style={styles.overlayBackground} />
          <View style={styles.focusBox}>
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY }] }]}
            />
          </View>
          <View style={styles.overlayBackground} />
        </View>
        <View style={styles.overlayBackground} />
      </View>

      {/* No Permission */}
      {!isPermissionGranted && (
        <Pressable style={styles.permissionPrompt} onPress={requestPermission}>
          <Text style={styles.buttonStyle}>
            We need your permission to show the camera
          </Text>
        </Pressable>
      )}

      {/* Flash Toggle Button */}
      <TouchableOpacity style={styles.flashButton} onPress={toggleFlashMode}>
        <MaterialIcons
          name={flashMode === "on" ? "flashlight-on" : "flashlight-off"}
          size={64}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
  flashButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  permissionPrompt: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
