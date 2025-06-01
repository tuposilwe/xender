import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const RING_COUNT = 2;

const PulseIndicator = () => {
  const scaleAnims = useRef<Animated.Value[]>([]);
  const opacityAnims = useRef<Animated.Value[]>([]);

  useEffect(() => {
    if (scaleAnims.current.length === 0) {
      for (let i = 0; i < RING_COUNT; i++) {
        scaleAnims.current.push(new Animated.Value(0));
        opacityAnims.current.push(new Animated.Value(1));
      }
    }
    startRadarPulse();
    return () => {
      stopRadarPulse();
    };
  }, []);

  const startRadarPulse = () => {
    const animations = scaleAnims.current.map((_, i) =>
      Animated.loop(
        Animated.parallel([
          Animated.timing(scaleAnims.current[i], {
            toValue: 2,
            duration: 2000,
            delay: i * 400,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(opacityAnims.current[i], {
            toValue: 0,
            duration: 2000,
            delay: i * 400,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
        ]),
        { resetBeforeIteration: true }
      )
    );

    Animated.stagger(400, animations).start();
  };

  const stopRadarPulse = () => {
    scaleAnims.current.forEach((anim) => anim.stopAnimation());
    opacityAnims.current.forEach((anim) => anim.stopAnimation());
    scaleAnims.current.forEach((anim) => anim.setValue(0));
    opacityAnims.current.forEach((anim) => anim.setValue(1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.radarContainer}>
        {scaleAnims.current.map((scaleAnim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.radarRing,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnims.current[index],
              },
            ]}
          />
        ))}
        {/* Expo Icon Heart with white fill and red circular background */}
        <View style={styles.iconBackground}>
          <MaterialCommunityIcons name="heart" size={60} color="#fff" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 50,
  },
  radarContainer: {
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  radarRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(230, 57, 70, 0.25)",
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF6060", // red background
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PulseIndicator;
