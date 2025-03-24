import React from "react";
import { View, Pressable, Image, StyleSheet, Text } from "react-native";

import { AppDetail } from "react-native-launcher-kit/typescript/Interfaces/InstalledApps";
import LabelSummary from "../../utils/LabelSummary";
import RNFS from "react-native-fs";
import AppSizeChecker from "@/app/utils/AppSizeChecker";

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
        <LabelSummary text={item.label} />
        <AppSizeChecker packageName={item.packageName}/>
      </Pressable>
    ))}
  </View>
);

export default AppGrid;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"flex-start",
    flexWrap: "wrap",
    backgroundColor: "white",
  },
  appIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 13,
    backgroundColor: "#000",
    borderRadius: 20,
    width: 70,
    padding: 2,
    height: 70,
    // overflow: 'hidden',
  },
  appIcon:{
    width: "60%",
    height: "60%",
    marginTop: "8%", 
    resizeMode: "cover",
  },
});
