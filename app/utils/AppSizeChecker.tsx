import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import RNFS from "react-native-fs";

const AppSizeChecker = ({ packageName }: { packageName: string }) => {
    const [size, setSize] = useState<number | null>(null);
    useEffect(() => {
      const getAppSize = async () => {
        try {
          const appDir = `/data/user/0/${packageName}`;
          const files = await RNFS.readDir(appDir);
  
          let totalSize = 0;
          for (const file of files) {
            totalSize += file.size;
          }
  
          setSize(totalSize / (1024 * 1024)); // Convert bytes to MB
        } catch (error) {
          console.error("Error fetching app size:", error);
        }
      };
  
      getAppSize();
    }, [packageName]);

  return (
   <View>
      <Text>Package: {packageName}</Text>
      <Text>Size: {size ? `${size.toFixed(2)} MB` : "Loading..."}</Text>
    </View>
  )
}

export default AppSizeChecker