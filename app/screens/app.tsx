import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  InstalledApps,
} from "react-native-launcher-kit";
import { AppDetail } from "react-native-launcher-kit/typescript/Interfaces/InstalledApps";

export interface AppState {
  showWithAccent: boolean;
  apps: AppDetail[];
  firstApp?: AppDetail;
  defaultLauncherPackageName: string;
  isLoading: boolean;
}

const App = () => {
  const [apps, setApps] = useState<AppState["apps"]>([]);

  useEffect(() => {
    const initApp = async () => {
      try {
        const installedApps = await InstalledApps.getSortedApps({
          includeVersion: true,
          includeAccentColor: true,
        });

        setApps(installedApps);
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initApp();
  }, []);

  return (
    <View className="flex items-center justify-center">
      <TouchableOpacity>
      <Text className="text-3xl mt-72 ">Total Apps  {apps.length}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
