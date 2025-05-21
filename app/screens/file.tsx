import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";

const File = () => {
  const [free, setFree] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const freeSpace = await FileSystem.getFreeDiskStorageAsync();
        const totalSpace = await FileSystem.getTotalDiskCapacityAsync();
        setFree(freeSpace);
        setTotal(totalSpace);
      } catch (e) {
        console.error("Error fetching storage info", e);
      }
    };

    fetchStorage();
  }, []);

  const formatBytes = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
  };

  const used = total !== null && free !== null ? total - free : 0;
  const usedPercent = total ? used / total : 0;

  return (
    <View style={{ flexDirection: "row", padding: 10 }}>
      <SimpleLineIcons name="screen-smartphone" size={54} color="#444" />
      <View
        style={{
          flex: 1,
        }}
      >
        <Text style={styles.title}>Phone Storage</Text>

        {total && free ? (
          <View
            style={{
              flex: 2,
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text style={styles.text}>Total: {formatBytes(total)}</Text>
              {/* <Text style={styles.text}>Used: {formatBytes(used)}</Text> */}
              <Text style={styles.textAvailable}>
                Available: {formatBytes(free)}
              </Text>
            </View>

            <Progress.Bar
              progress={usedPercent}
              width={null}
              color="#b9414b"
              unfilledColor="#e0e0e0"
              borderRadius={8}
              borderWidth={0}
              height={5}
              style={styles.progress}
            />
          </View>
        ) : (
          <Text>Loading storage info...</Text>
        )}
      </View>
    </View>
  );
};

export default File;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 20,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
  },
  progress: {
    marginTop: 10,
  },
  textAvailable: {
    fontSize: 16,
    marginVertical: 2,
    marginLeft: 25,
  },
});
