import useSelectedApps from "@/hooks/useSelectedApps";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { AppDetail } from "react-native-launcher-kit/typescript/Interfaces/InstalledApps";

interface AppGridProps {
  apps: AppDetail[];
}

const AppGrid = ({ apps }: AppGridProps) => {
  const { selectedApps,setScreen } = useSelectedApps();

  useEffect(() => {
    setScreen(selectedApps.length > 0);
  }, [selectedApps]);
 

  const isEmpty = () => {
    selectedApps.length === 0 ? setScreen(false) : setScreen(true);
  };

  // console.log("STATE ",screen);
  
  const toggleAppSelection = (packageName: string) => {
    const { selectedApps, setSelectedApps, setScreen } = useSelectedApps.getState();
  
    let updatedSelection: string[];
  
    if (selectedApps.includes(packageName)) {
      updatedSelection = selectedApps.filter((pkg) => pkg !== packageName);
    } else {
      updatedSelection = [...selectedApps, packageName];
    }
  
    setSelectedApps(updatedSelection);
    setScreen(updatedSelection.length > 0); // Update modal visibility
  };
  

  return (
    <View style={styles.container}>
      {apps.map((item) => (
        <Pressable
          key={item.packageName}
          onPress={() => toggleAppSelection(item.packageName)}
          style={[styles.appIconContainer]}
        >
          <View style={styles.imageCard}>
            {selectedApps.includes(item.packageName) && (
              <>
                <View style={styles.shadowAb} />
                <MaterialIcons
                  name="check-circle"
                  size={20}
                  color="green"
                  style={{
                    position: "absolute",
                    top: -7,
                    right: -7,
                  }}
                />
              </>
            )}

            <Image
              style={[styles.appIcon, { transform: [{ scale: 0.7 }] }]}
              source={{ uri: `${item.icon}` }}
            />
          </View>

          <Text style={styles.appLabel} numberOfLines={1}>
            {item.label}
          </Text>
          <Text style={styles.appSize}>{item.appBytes}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default AppGrid;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    backgroundColor: "white",
    marginTop: 3,
  },
  appIconContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    margin: 8,
    padding: 2,
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
  imageCard: {
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  shadowAb: {
    position: "absolute",
    top: -7,
    left: 0,
    right: 0,
    height: 90,
    width: "120%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 0.1,
    elevation: 0.1,
    zIndex: 2,
  },
  appIcon: {
    width: 62,
    height: 60,
    resizeMode: "cover",
  },
});
