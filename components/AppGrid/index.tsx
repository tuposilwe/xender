import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { AppDetail } from "react-native-launcher-kit/typescript/Interfaces/InstalledApps";

interface AppGridProps {
  apps: AppDetail[];
  showWithAccent: boolean;
  onAppPress: (packageName: string) => void;
}

const AppGrid: React.FC<AppGridProps> = ({
  apps,
  showWithAccent,
  onAppPress,
}) => (
  <View style={styles.container}>
    {apps.map((item) => (
      <Pressable
        key={item.packageName}
        onPress={() => onAppPress(item.packageName)}
        style={[
          styles.appIconContainer,
          {
            backgroundColor: showWithAccent
              ? `${item.accentColor}`
              : "transparent",
          },
        ]}
      >
        <Image
          style={[
            styles.appIcon,
           showWithAccent && {transform: [{scale: 0.7}]},
        ]}
          source={{ uri: `${item.icon}` }}
        />
        <Text style={styles.appLabel} numberOfLines={1}>{item.label}</Text>
        <Text style={styles.appSize}>{item.appBytes}</Text>
   
      </Pressable>
    ))}
  </View>
);

export default AppGrid;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"center",
    flexWrap: "wrap",
    backgroundColor: "white",
    marginTop:3
  },
  appIconContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    margin:8,
    padding: 2,
  },
  appIcon:{
    width: "60%",
    height: "60%",
    resizeMode: "cover", // prevents icon distortion
  },
  appLabel: {
     marginTop: 4,
     fontSize: 12,
     fontWeight: "500",
    color: "#333",
    textAlign: "center",
    maxWidth: "100%",
  },
  appSize: {
    marginTop: 2,
    fontSize: 10,
    color: "#666",
    textAlign: "center",
  },
});
